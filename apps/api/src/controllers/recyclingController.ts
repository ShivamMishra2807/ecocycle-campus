import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { DeviceStatus } from '@ecocycle/shared';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function createRecyclingRecord(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const { deviceId, recyclerName, recyclerRegistrationNumber, weightKg, certificateNumber, certificateUrl, method, notes } = req.body;

  if (!deviceId || !recyclerName || !certificateNumber) {
    return sendError(res, 'Device ID, Recycler Name, and Certificate Number are required', 400);
  }

  const device = await prisma.device.findUnique({ where: { id: deviceId } });
  if (!device) return sendError(res, 'Device not found', 404);

  // Business Rule: Cannot recycle an allocated device
  if (device.status === DeviceStatus.ALLOCATED) {
    return sendError(res, 'Cannot recycle a device that is currently allocated for campus reuse', 400);
  }

  const record = await prisma.recyclingRecord.create({
    data: {
      deviceId,
      recyclerName,
      recyclerRegistrationNumber: recyclerRegistrationNumber || 'REG-PENDING',
      weightKg: parseFloat(weightKg) || device.estimatedWeight || 1.5,
      certificateNumber,
      certificateUrl: certificateUrl || `https://ecocycle.local/certificates/${certificateNumber}.pdf`,
      method: method || 'Zero-Landfill Pyrometallurgical/Hydrometallurgical Recovery',
      notes: notes || null,
    },
    include: { device: true },
  });

  // Mark Device as RECYCLED
  await prisma.device.update({
    where: { id: deviceId },
    data: {
      status: DeviceStatus.RECYCLED,
      currentLocation: `Certified Recycler: ${recyclerName}`,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: req.user.userId,
      action: 'CERTIFIED_RECYCLING_RECORD',
      entity: 'RecyclingRecord',
      entityId: record.id,
      metadata: JSON.stringify({ deviceId, weightKg: record.weightKg, certificateNumber }),
    },
  });

  return sendSuccess(res, record, 'Recycling record created successfully', 201);
}

export async function getRecyclingRecords(req: AuthenticatedRequest, res: Response) {
  const records = await prisma.recyclingRecord.findMany({
    include: { device: true },
    orderBy: { createdAt: 'desc' },
  });
  return sendSuccess(res, records);
}
