import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { CollectionStatus, DeviceStatus } from '@ecocycle/shared';

export async function getCollectionPoints(req: AuthenticatedRequest, res: Response) {
  const points = await prisma.collectionPoint.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
  return sendSuccess(res, points);
}

export async function createCollectionPoint(req: AuthenticatedRequest, res: Response) {
  const { name, building, floor, room, capacity, operatingHours } = req.body;

  const point = await prisma.collectionPoint.create({
    data: {
      name,
      building,
      floor,
      room,
      capacity: capacity || 100,
      operatingHours: operatingHours || '9:00 AM - 5:00 PM',
    },
  });

  return sendSuccess(res, point, 'Collection point created', 201);
}

export async function getCollectionRequests(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const where: any = {};
  if (req.user.role === 'VOLUNTEER') {
    where.OR = [
      { assignedVolunteerId: req.user.userId },
      { status: CollectionStatus.REQUESTED },
    ];
  }

  const requests = await prisma.collectionRequest.findMany({
    where,
    include: {
      submission: {
        include: {
          device: true,
          user: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
      assignedVolunteer: { select: { id: true, name: true, phone: true } },
      collectionPoint: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, requests);
}

export async function updateCollectionRequestStatus(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const { status, assignedVolunteerId, notes } = req.body;

  const collectionReq = await prisma.collectionRequest.findUnique({
    where: { id },
    include: { submission: true },
  });

  if (!collectionReq) return sendError(res, 'Collection request not found', 404);

  const updatedReq = await prisma.collectionRequest.update({
    where: { id },
    data: {
      status: status || undefined,
      assignedVolunteerId: assignedVolunteerId || undefined,
      notes: notes || undefined,
      collectedAt: status === CollectionStatus.PICKED_UP ? new Date() : undefined,
    },
  });

  // Also update submission and device status if picked up
  if (status === CollectionStatus.PICKED_UP && collectionReq.submission) {
    await prisma.ewasteSubmission.update({
      where: { id: collectionReq.submissionId },
      data: { status: CollectionStatus.PICKED_UP },
    });

    await prisma.device.update({
      where: { id: collectionReq.submission.deviceId },
      data: {
        status: DeviceStatus.COLLECTED,
        currentLocation: 'Campus Collection Hub - Awaiting Technician Assessment',
      },
    });

    // Notify submitting user
    await prisma.notification.create({
      data: {
        userId: collectionReq.submission.userId,
        title: 'Device Collected!',
        message: 'Your e-waste device has been collected by our team and moved to the tech assessment lab.',
        type: 'INFO' as any,
      },
    });
  }

  return sendSuccess(res, updatedReq, 'Collection request status updated');
}
