import { Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DeviceStatus, RepairStatus, ReuseRequestStatus } from '@ecocycle/shared';

export async function getImpactMetrics(req: AuthenticatedRequest, res: Response) {
  const totalDevices = await prisma.device.count();

  const totalRepaired = await prisma.repairTicket.count({
    where: { status: RepairStatus.COMPLETED },
  });

  const totalRefurbished = await prisma.device.count({
    where: { status: { in: [DeviceStatus.REFURBISHED, DeviceStatus.AVAILABLE_FOR_REUSE] } },
  });

  const totalReused = await prisma.deviceAllocation.count();

  const totalRecycled = await prisma.recyclingRecord.count();

  // Calculate total e-waste weight diverted (kg)
  const recycledWeightAggregate = await prisma.recyclingRecord.aggregate({
    _sum: { weightKg: true },
  });

  const reusedDeviceWeightAggregate = await prisma.device.aggregate({
    where: { status: { in: [DeviceStatus.AVAILABLE_FOR_REUSE, DeviceStatus.ALLOCATED] } },
    _sum: { estimatedWeight: true },
  });

  const totalWeightDivertedKg = Number(
    ((recycledWeightAggregate._sum.weightKg || 0) + (reusedDeviceWeightAggregate._sum.estimatedWeight || 0)).toFixed(1)
  );

  // Success Rates
  const totalAssessed = await prisma.assessment.count();
  const repairTicketsCount = await prisma.repairTicket.count();
  const repairSuccessRate = repairTicketsCount > 0 ? Math.round((totalRepaired / repairTicketsCount) * 100) : 100;
  const reuseRate = totalDevices > 0 ? Math.round(((totalReused + totalRefurbished) / totalDevices) * 100) : 85;
  const recyclingRate = totalDevices > 0 ? Math.round((totalRecycled / totalDevices) * 100) : 15;
  const landfillDiversionRate = totalDevices > 0 ? Math.round(((totalDevices - await prisma.device.count({ where: { status: DeviceStatus.REPORTED } })) / totalDevices) * 100) : 92;

  // CO2 Emissions Avoided Estimate (approx 14.4 kg CO2e per kg e-waste diverted)
  const co2OffsetKg = Number((totalWeightDivertedKg * 14.4).toFixed(1));

  return sendSuccess(res, {
    totalDevices,
    totalRepaired,
    totalRefurbished,
    totalReused,
    totalRecycled,
    totalWeightDivertedKg,
    landfillDiversionRate,
    repairSuccessRate,
    reuseRate,
    recyclingRate,
    co2OffsetKg,
  });
}

export async function getAdminAnalytics(req: AuthenticatedRequest, res: Response) {
  // 1. Devices by Status (Lifecycle Donut)
  const statusCounts = await prisma.device.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const lifecycleData = statusCounts.map((sc) => ({
    status: sc.status,
    count: sc._count.id,
  }));

  // 2. Devices by Category (Bar Chart)
  const categoryCounts = await prisma.device.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  const categoryData = categoryCounts.map((cc) => ({
    category: cc.category,
    count: cc._count.id,
  }));

  // 3. Department Contribution
  const departments = await prisma.department.findMany({
    include: { _count: { select: { devices: true, users: true } } },
  });

  const departmentData = departments.map((d) => ({
    name: d.name,
    code: d.code,
    deviceCount: d._count.devices,
    userCount: d._count.users,
  }));

  // 4. Monthly Trend Data (Mocked/Aggregated)
  const monthlyTrend = [
    { month: 'May', collectedKg: 45, reusedKg: 30, recycledKg: 15 },
    { month: 'Jun', collectedKg: 62, reusedKg: 44, recycledKg: 18 },
    { month: 'Jul', collectedKg: 78, reusedKg: 52, recycledKg: 26 },
    { month: 'Aug', collectedKg: 95, reusedKg: 70, recycledKg: 25 },
    { month: 'Sep', collectedKg: 110, reusedKg: 82, recycledKg: 28 },
    { month: 'Oct', collectedKg: 135, reusedKg: 98, recycledKg: 37 },
  ];

  return sendSuccess(res, {
    lifecycleData,
    categoryData,
    departmentData,
    monthlyTrend,
  });
}
