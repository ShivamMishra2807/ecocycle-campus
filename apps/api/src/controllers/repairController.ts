import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AssessmentSchema, RepairTicketSchema, RecommendedAction, DeviceStatus, RepairStatus } from '@ecocycle/shared';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function createAssessment(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const parsed = AssessmentSchema.parse(req.body);

  // 1. Create Assessment Record
  const assessment = await prisma.assessment.create({
    data: {
      deviceId: parsed.deviceId,
      technicianId: req.user.userId,
      physicalCondition: parsed.physicalCondition,
      functionalCondition: parsed.functionalCondition,
      repairability: parsed.repairability,
      estimatedRepairCost: parsed.estimatedRepairCost || null,
      estimatedReuseValue: parsed.estimatedReuseValue || null,
      recommendedAction: parsed.recommendedAction,
      diagnosis: parsed.diagnosis,
      notes: parsed.notes || null,
    },
    include: { device: true },
  });

  // 2. Map Recommended Action to Device Lifecycle Status
  let newStatus: DeviceStatus = DeviceStatus.UNDER_ASSESSMENT;
  if (parsed.recommendedAction === RecommendedAction.REPAIR) {
    newStatus = DeviceStatus.REPAIR_REQUIRED;
  } else if (parsed.recommendedAction === RecommendedAction.REFURBISH || parsed.recommendedAction === RecommendedAction.REUSE_DIRECTLY) {
    newStatus = DeviceStatus.AVAILABLE_FOR_REUSE;
  } else if (parsed.recommendedAction === RecommendedAction.RECYCLE || parsed.recommendedAction === RecommendedAction.PARTS_RECOVERY) {
    newStatus = DeviceStatus.SENT_FOR_RECYCLING;
  }

  await prisma.device.update({
    where: { id: parsed.deviceId },
    data: {
      status: newStatus,
      currentLocation: `Assessed by Technician (${parsed.recommendedAction})`,
    },
  });

  // If action is REPAIR, automatically create a repair ticket
  if (parsed.recommendedAction === RecommendedAction.REPAIR) {
    await prisma.repairTicket.create({
      data: {
        deviceId: parsed.deviceId,
        technicianId: req.user.userId,
        issue: parsed.diagnosis,
        diagnosis: parsed.notes || parsed.diagnosis,
        estimatedCost: parsed.estimatedRepairCost || 500,
        status: RepairStatus.OPEN,
      },
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user.userId,
      action: 'ASSESS_DEVICE',
      entity: 'Assessment',
      entityId: assessment.id,
      metadata: JSON.stringify({ deviceId: parsed.deviceId, recommendedAction: parsed.recommendedAction }),
    },
  });

  return sendSuccess(res, assessment, 'Device assessment saved successfully', 201);
}

export async function getRepairs(req: AuthenticatedRequest, res: Response) {
  const { status, priority } = req.query;

  const where: any = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const tickets = await prisma.repairTicket.findMany({
    where,
    include: {
      device: true,
      technician: { select: { id: true, name: true, email: true } },
      updates: { include: { technician: { select: { name: true } } }, orderBy: { createdAt: 'asc' } },
      parts: { include: { part: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return sendSuccess(res, tickets);
}

export async function createRepairTicket(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const parsed = RepairTicketSchema.parse(req.body);

  const ticket = await prisma.repairTicket.create({
    data: {
      deviceId: parsed.deviceId,
      technicianId: req.user.userId,
      issue: parsed.issue,
      diagnosis: parsed.diagnosis || null,
      priority: parsed.priority || 'MEDIUM',
      estimatedCost: parsed.estimatedCost || null,
      estimatedCompletion: parsed.estimatedCompletion ? new Date(parsed.estimatedCompletion) : null,
      status: RepairStatus.OPEN,
    },
  });

  await prisma.device.update({
    where: { id: parsed.deviceId },
    data: { status: DeviceStatus.UNDER_REPAIR },
  });

  return sendSuccess(res, ticket, 'Repair ticket created', 201);
}

export async function addRepairUpdate(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const id = req.params.id as string;
  const { status, message } = req.body;

  if (!status || !message) return sendError(res, 'Status and message are required', 400);

  const ticket = await prisma.repairTicket.findUnique({ where: { id } });
  if (!ticket) return sendError(res, 'Repair ticket not found', 404);

  // 1. Create update timeline item
  const update = await prisma.repairUpdate.create({
    data: {
      repairTicketId: id,
      technicianId: req.user.userId,
      status,
      message,
    },
  });

  // 2. Update Ticket status
  await prisma.repairTicket.update({
    where: { id },
    data: {
      status,
      completedAt: status === RepairStatus.COMPLETED ? new Date() : undefined,
    },
  });

  // 3. If COMPLETED, mark device as REFURBISHED / AVAILABLE_FOR_REUSE
  if (status === RepairStatus.COMPLETED) {
    await prisma.device.update({
      where: { id: ticket.deviceId },
      data: {
        status: DeviceStatus.AVAILABLE_FOR_REUSE,
        condition: 'GOOD' as any,
        currentLocation: 'Refurbished Device Warehouse - Ready for Reuse',
      },
    });

    // Auto-create Reuse Listing draft
    const device = await prisma.device.findUnique({ where: { id: ticket.deviceId } });
    if (device) {
      await prisma.reuseListing.create({
        data: {
          deviceId: device.id,
          listedById: req.user.userId,
          title: `Refurbished ${device.brand} ${device.model}`,
          description: `Repaired and tested by Campus Maintenance. ${message}`,
          condition: device.condition,
          availability: 'AVAILABLE',
        },
      });
    }
  }

  return sendSuccess(res, update, 'Repair update added successfully');
}

export async function getParts(req: AuthenticatedRequest, res: Response) {
  const parts = await prisma.part.findMany({
    orderBy: { quantity: 'asc' },
  });
  return sendSuccess(res, parts);
}

export async function addRepairPart(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const { partId, quantity } = req.body;

  const part = await prisma.part.findUnique({ where: { id: partId } });
  if (!part) return sendError(res, 'Part not found', 404);

  if (part.quantity < (quantity || 1)) {
    return sendError(res, `Insufficient stock for part '${part.name}'. Available: ${part.quantity}`, 400);
  }

  const cost = part.unitCost * (quantity || 1);

  const repairPart = await prisma.repairPart.create({
    data: {
      repairTicketId: id,
      partId,
      quantity: quantity || 1,
      cost,
    },
  });

  // Deduct inventory
  await prisma.part.update({
    where: { id: partId },
    data: { quantity: { decrement: quantity || 1 } },
  });

  return sendSuccess(res, repairPart, 'Part added to repair ticket');
}
