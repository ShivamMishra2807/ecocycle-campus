import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  const { action, entity } = req.query;

  const where: any = {};
  if (action) where.action = String(action);
  if (entity) where.entity = String(entity);

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return sendSuccess(res, logs);
}

export async function exportAuditLogsCSV(req: AuthenticatedRequest, res: Response) {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  let csvContent = 'ID,Date,User,Action,Entity,EntityID,IPAddress\n';
  logs.forEach((log) => {
    const userStr = log.user ? `${log.user.name} (${log.user.email})` : 'System';
    csvContent += `"${log.id}","${log.createdAt.toISOString()}","${userStr}","${log.action}","${log.entity}","${log.entityId || ''}","${log.ipAddress || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ecocycle-audit-logs.csv"');
  return res.send(csvContent);
}
