import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { generateDeviceQRCodeDataURL } from '../utils/qrcode';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DeviceStatus } from '@ecocycle/shared';

export async function getDevices(req: AuthenticatedRequest, res: Response) {
  const { category, status, condition, search } = req.query;

  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;
  if (condition) where.condition = condition;
  if (search) {
    where.OR = [
      { assetNumber: { contains: String(search), mode: 'insensitive' } },
      { brand: { contains: String(search), mode: 'insensitive' } },
      { model: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } },
    ];
  }

  const devices = await prisma.device.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      currentDepartment: { select: { id: true, name: true, code: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return sendSuccess(res, devices);
}

export async function getDeviceByAssetNumber(req: AuthenticatedRequest, res: Response) {
  const assetNumber = req.params.assetNumber as string;

  const device = await prisma.device.findUnique({
    where: { assetNumber },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      currentDepartment: true,
      images: true,
      ewasteSubmissions: {
        include: {
          user: { select: { name: true, role: true } },
          collectionPoint: true,
          collectionRequests: {
            include: { assignedVolunteer: { select: { name: true } } },
          },
        },
      },
      assessments: {
        include: { technician: { select: { name: true } } },
      },
      repairTickets: {
        include: {
          technician: { select: { name: true } },
          updates: { include: { technician: { select: { name: true } } } },
          parts: { include: { part: true } },
        },
      },
      reuseListings: {
        include: {
          requests: { include: { requester: { select: { name: true } } } },
        },
      },
      recyclingRecords: true,
      allocations: {
        include: {
          user: { select: { name: true } },
          department: { select: { name: true } },
        },
      },
    },
  });

  if (!device) {
    return sendError(res, `Device with Asset Number '${assetNumber}' not found`, 404);
  }

  const qrCodeDataUrl = await generateDeviceQRCodeDataURL(device.assetNumber);

  return sendSuccess(res, {
    ...device,
    qrCodeDataUrl,
  });
}

export async function updateDeviceStatus(req: AuthenticatedRequest, res: Response) {
  const id = req.params.id as string;
  const { status, currentLocation } = req.body;

  if (!status || !Object.values(DeviceStatus).includes(status)) {
    return sendError(res, 'Valid status is required', 400);
  }

  const device = await prisma.device.update({
    where: { id },
    data: {
      status,
      currentLocation: currentLocation || undefined,
    },
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user?.userId,
      action: 'UPDATE_DEVICE_STATUS',
      entity: 'Device',
      entityId: device.id,
      metadata: JSON.stringify({ newStatus: status, assetNumber: device.assetNumber }),
    },
  });

  return sendSuccess(res, device, 'Device status updated successfully');
}
