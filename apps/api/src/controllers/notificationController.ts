import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getUserNotifications(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, notifications);
}

export async function markNotificationAsRead(req: AuthenticatedRequest, res: Response) {
  if (!req.user) return sendError(res, 'Unauthenticated', 401);

  const id = req.params.id as string;

  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return sendSuccess(res, notification, 'Notification marked as read');
}
