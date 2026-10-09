import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { EwasteSubmissionSchema, DeviceStatus, CollectionStatus } from '@ecocycle/shared';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function createSubmission(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const parsed = EwasteSubmissionSchema.parse(req.body);

  // Generate unique asset number
  const count = await prisma.device.count();
  const assetNumber = `DEV-2026-${String(count + 1).padStart(3, '0')}`;

  // 1. Create Device
  const device = await prisma.device.create({
    data: {
      assetNumber,
      category: parsed.category,
      brand: parsed.brand,
      model: parsed.model,
      serialNumber: parsed.serialNumber || null,
      purchaseYear: parsed.purchaseYear || null,
      estimatedAge: parsed.estimatedAge || null,
      condition: parsed.condition,
      status: DeviceStatus.REPORTED,
      ownerId: req.user.userId,
      currentLocation: parsed.currentLocation || 'Submitted by user',
      estimatedWeight: parsed.estimatedWeight || 1.5,
      imageUrl: parsed.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
      description: parsed.description || parsed.reason,
    },
  });

  // 2. Create DeviceImage if provided
  if (parsed.imageUrl) {
    await prisma.deviceImage.create({
      data: {
        deviceId: device.id,
        url: parsed.imageUrl,
        uploadedBy: req.user.userId,
      },
    });
  }

  // 3. Create E-Waste Submission
  const submission = await prisma.ewasteSubmission.create({
    data: {
      userId: req.user.userId,
      deviceId: device.id,
      reason: parsed.reason,
      description: parsed.description || null,
      preferredCollectionDate: parsed.preferredCollectionDate ? new Date(parsed.preferredCollectionDate) : null,
      collectionPointId: parsed.collectionPointId || null,
      status: CollectionStatus.REQUESTED,
    },
    include: {
      device: true,
      collectionPoint: true,
    },
  });

  // 4. Create Initial Collection Request
  await prisma.collectionRequest.create({
    data: {
      submissionId: submission.id,
      requestedById: req.user.userId,
      collectionPointId: parsed.collectionPointId || null,
      status: CollectionStatus.REQUESTED,
    },
  });

  // Notification for user
  await prisma.notification.create({
    data: {
      userId: req.user.userId,
      title: 'E-Waste Submitted!',
      message: `Device ${device.assetNumber} (${device.brand} ${device.model}) submitted successfully. Track status under My Devices.`,
      type: 'SUCCESS' as any,
    },
  });

  return sendSuccess(res, submission, 'E-waste submission created successfully', 201);
}

export async function getSubmissions(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const where: any = {};
  if (req.user.role === 'STUDENT' || req.user.role === 'FACULTY' || req.user.role === 'STAFF') {
    where.userId = req.user.userId;
  }

  const submissions = await prisma.ewasteSubmission.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      device: true,
      collectionPoint: true,
      collectionRequests: {
        include: { assignedVolunteer: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, submissions);
}
