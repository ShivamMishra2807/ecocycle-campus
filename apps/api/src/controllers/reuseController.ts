import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { ReuseRequestSchema, ListingStatus, ReuseRequestStatus, DeviceStatus } from '@ecocycle/shared';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getListings(req: AuthenticatedRequest, res: Response) {
  const { category, condition, search } = req.query;

  const where: any = { availability: ListingStatus.AVAILABLE };
  if (category) where.device = { ...where.device, category };
  if (condition) where.condition = condition;
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } },
    ];
  }

  const listings = await prisma.reuseListing.findMany({
    where,
    include: {
      device: true,
      listedBy: { select: { name: true, email: true } },
    },
    orderBy: { listedAt: 'desc' },
  });

  return sendSuccess(res, listings);
}

export async function requestDevice(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const parsed = ReuseRequestSchema.parse(req.body);

  const listing = await prisma.reuseListing.findUnique({ where: { id: parsed.listingId } });
  if (!listing || listing.availability !== ListingStatus.AVAILABLE) {
    return sendError(res, 'This refurbished device is no longer available for reuse', 400);
  }

  // Check duplicate active request
  const existing = await prisma.reuseRequest.findFirst({
    where: {
      listingId: parsed.listingId,
      requesterId: req.user.userId,
      status: ReuseRequestStatus.PENDING,
    },
  });
  if (existing) {
    return sendError(res, 'You already have an active pending request for this device', 400);
  }

  const reuseRequest = await prisma.reuseRequest.create({
    data: {
      listingId: parsed.listingId,
      requesterId: req.user.userId,
      departmentId: parsed.departmentId || req.user.departmentId || null,
      reason: parsed.reason,
      status: ReuseRequestStatus.PENDING,
    },
    include: {
      listing: { include: { device: true } },
    },
  });

  return sendSuccess(res, reuseRequest, 'Reuse request submitted successfully', 201);
}

export async function getReuseRequests(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const where: any = {};
  if (req.user.role === 'STUDENT' || req.user.role === 'FACULTY' || req.user.role === 'STAFF') {
    where.requesterId = req.user.userId;
  }

  const requests = await prisma.reuseRequest.findMany({
    where,
    include: {
      listing: { include: { device: true } },
      requester: { select: { id: true, name: true, email: true, role: true } },
      department: true,
      reviewedBy: { select: { id: true, name: true } },
    },
    orderBy: { requestedAt: 'desc' },
  });

  return sendSuccess(res, requests);
}

export async function reviewReuseRequest(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const id = req.params.id as string;
  const { status } = req.body; // APPROVED or REJECTED

  if (!status || ![ReuseRequestStatus.APPROVED, ReuseRequestStatus.REJECTED].includes(status)) {
    return sendError(res, 'Status must be APPROVED or REJECTED', 400);
  }

  const reuseReq = await prisma.reuseRequest.findUnique({
    where: { id },
    include: { listing: { include: { device: true } } },
  });

  if (!reuseReq) return sendError(res, 'Reuse request not found', 404);

  const updatedReq = await prisma.reuseRequest.update({
    where: { id },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedById: req.user.userId,
    },
  });

  if (status === ReuseRequestStatus.APPROVED && reuseReq.listing) {
    // 1. Mark listing as ALLOCATED
    await prisma.reuseListing.update({
      where: { id: reuseReq.listingId },
      data: {
        availability: ListingStatus.ALLOCATED,
        allocatedAt: new Date(),
      },
    });

    // 2. Mark device as ALLOCATED
    await prisma.device.update({
      where: { id: reuseReq.listing.deviceId },
      data: {
        status: DeviceStatus.ALLOCATED,
        currentLocation: `Allocated to ${reuseReq.requesterId}`,
        currentDepartmentId: reuseReq.departmentId || undefined,
      },
    });

    // 3. Create DeviceAllocation record
    await prisma.deviceAllocation.create({
      data: {
        deviceId: reuseReq.listing.deviceId,
        userId: reuseReq.requesterId,
        departmentId: reuseReq.departmentId || null,
        allocatedById: req.user.userId,
        conditionAtAllocation: reuseReq.listing.condition,
        notes: `Reuse request approved: ${reuseReq.reason}`,
      },
    });

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: reuseReq.requesterId,
        title: 'Reuse Request Approved! 🎉',
        message: `Your request for ${reuseReq.listing.title} was approved by Admin. Please visit Knowledge Center Tech Desk for pickup.`,
        type: 'SUCCESS' as any,
      },
    });
  }

  return sendSuccess(res, updatedReq, `Reuse request ${status.toLowerCase()} successfully`);
}
