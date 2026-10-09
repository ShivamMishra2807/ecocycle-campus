import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient, Role, DeviceCategory, DeviceCondition, DeviceStatus, CollectionStatus, RecommendedAction, RepairStatus, ListingStatus, ReuseRequestStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EcoCycle Campus database seeding with updated collection points & role users...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.recyclingRecord.deleteMany();
  await prisma.deviceAllocation.deleteMany();
  await prisma.reuseRequest.deleteMany();
  await prisma.reuseListing.deleteMany();
  await prisma.repairPart.deleteMany();
  await prisma.part.deleteMany();
  await prisma.repairUpdate.deleteMany();
  await prisma.repairTicket.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.collectionRequest.deleteMany();
  await prisma.ewasteSubmission.deleteMany();
  await prisma.collectionPoint.deleteMany();
  await prisma.deviceImage.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('🧹 Cleaned previous database records.');

  // 1. Create Departments
  const feDept = await prisma.department.create({
    data: {
      name: 'First Year Engineering (FE)',
      code: 'FE',
      building: 'FE Main Department Building',
    },
  });

  const cseDept = await prisma.department.create({
    data: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      building: 'Alan Turing Block',
    },
  });

  const eceDept = await prisma.department.create({
    data: {
      name: 'Electronics & Communication',
      code: 'ECE',
      building: 'C.V. Raman Labs',
    },
  });

  const meDept = await prisma.department.create({
    data: {
      name: 'Mechanical Engineering',
      code: 'MECH',
      building: 'Visvesvaraya Workshop',
    },
  });

  const adminDept = await prisma.department.create({
    data: {
      name: 'University Administration',
      code: 'ADMIN',
      building: 'Main Administrative Block',
    },
  });

  console.log('🏢 Created 5 Campus Departments.');

  // Passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const techPassword = await bcrypt.hash('Tech@123', 10);
  const volPassword = await bcrypt.hash('Vol@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  // 2. Create Users - Single Admin + Multiple Students, Volunteers, Technicians
  const singleAdmin = await prisma.user.create({
    data: {
      name: 'Dr. Aris Thorne (Chief Admin)',
      email: 'admin@ecocycle.local',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: '+91 98765 43210',
      departmentId: adminDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  });

  // Multiple Students
  const student1 = await prisma.user.create({
    data: {
      name: 'Rohan Gupta',
      email: 'student@ecocycle.local',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      phone: '+91 91234 56789',
      departmentId: cseDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Neha Sharma',
      email: 'neha.student@ecocycle.local',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      phone: '+91 91234 11111',
      departmentId: feDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Siddharth Verma',
      email: 'sid.student@ecocycle.local',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      phone: '+91 91234 22222',
      departmentId: eceDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    },
  });

  // Multiple Volunteers
  const volunteer1 = await prisma.user.create({
    data: {
      name: 'Ananya Roy (FE Zone Lead)',
      email: 'volunteer@ecocycle.local',
      passwordHash: volPassword,
      role: Role.VOLUNTEER,
      phone: '+91 99887 76655',
      departmentId: feDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    },
  });

  const volunteer2 = await prisma.user.create({
    data: {
      name: 'Vikram Patel (Gate 1 Zone Lead)',
      email: 'vikram.vol@ecocycle.local',
      passwordHash: volPassword,
      role: Role.VOLUNTEER,
      phone: '+91 99887 11111',
      departmentId: meDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    },
  });

  const volunteer3 = await prisma.user.create({
    data: {
      name: 'Sneha Rao (Gate 2 Zone Lead)',
      email: 'sneha.vol@ecocycle.local',
      passwordHash: volPassword,
      role: Role.VOLUNTEER,
      phone: '+91 99887 22222',
      departmentId: cseDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    },
  });

  // Multiple Technicians
  const technician1 = await prisma.user.create({
    data: {
      name: 'Suresh Kumar (Hardware Spec)',
      email: 'technician@ecocycle.local',
      passwordHash: techPassword,
      role: Role.TECHNICIAN,
      phone: '+91 98123 45678',
      departmentId: cseDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    },
  });

  const technician2 = await prisma.user.create({
    data: {
      name: 'Priya Nair (Electronics Repair)',
      email: 'priya.tech@ecocycle.local',
      passwordHash: techPassword,
      role: Role.TECHNICIAN,
      phone: '+91 98123 99999',
      departmentId: eceDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
  });

  const technician3 = await prisma.user.create({
    data: {
      name: 'Rajesh Deshmukh (Lab Tech)',
      email: 'rajesh.tech@ecocycle.local',
      passwordHash: techPassword,
      role: Role.TECHNICIAN,
      phone: '+91 98123 33333',
      departmentId: meDept.id,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    },
  });

  console.log('👤 Created Single Admin and Multiple Students, Volunteers, & Technicians.');

  // 3. Create Updated Collection Points as requested:
  // "In front of FE department", "Gate no 1", "Gate no 2"
  const cpFE = await prisma.collectionPoint.create({
    data: {
      name: 'In front of FE Department',
      building: 'FE Department Block',
      floor: 'Main Entrance Foyer',
      room: 'Eco Drop Box #1',
      latitude: 12.9716,
      longitude: 77.5946,
      operatingHours: '08:00 AM - 07:00 PM',
      capacity: 150,
      currentLoad: 45,
    },
  });

  const cpGate1 = await prisma.collectionPoint.create({
    data: {
      name: 'Gate No. 1',
      building: 'Main Campus Entrance Gate 1',
      floor: 'Security Office Kiosk',
      room: 'Bin Section Gate 1',
      latitude: 12.9720,
      longitude: 77.5950,
      operatingHours: '24 Hours Open',
      capacity: 200,
      currentLoad: 80,
    },
  });

  const cpGate2 = await prisma.collectionPoint.create({
    data: {
      name: 'Gate No. 2',
      building: 'Campus Rear Entrance Gate 2',
      floor: 'Visitor Parking Hub',
      room: 'Bin Section Gate 2',
      latitude: 12.9710,
      longitude: 77.5930,
      operatingHours: '06:00 AM - 10:00 PM',
      capacity: 120,
      currentLoad: 25,
    },
  });

  console.log('📍 Created 3 Updated Collection Points: In front of FE department, Gate no 1, Gate no 2.');

  // 4. Create Parts Inventory
  const part1 = await prisma.part.create({
    data: {
      name: 'DDR4 8GB RAM Module',
      partNumber: 'RAM-DDR4-8G-01',
      category: 'Memory',
      quantity: 16,
      minimumStock: 5,
      unitCost: 1450.0,
      supplier: 'Crucial Tech India',
    },
  });

  const part2 = await prisma.part.create({
    data: {
      name: '500GB SATA 2.5" SSD',
      partNumber: 'SSD-SATA-500G-02',
      category: 'Storage',
      quantity: 5,
      minimumStock: 5,
      unitCost: 2200.0,
      supplier: 'Kingston Direct',
    },
  });

  // 5. Create Devices & Full Lifecycle Data
  const deviceList = [
    {
      assetNumber: 'DEV-2026-001',
      category: DeviceCategory.LAPTOP,
      brand: 'Dell',
      model: 'Latitude 3400',
      serialNumber: 'DL3400-88712',
      purchaseYear: 2021,
      estimatedAge: 4,
      condition: DeviceCondition.GOOD,
      status: DeviceStatus.AVAILABLE_FOR_REUSE,
      estimatedWeight: 1.8,
      description: 'Fully refurbished Dell laptop with 8GB RAM & 256GB SSD. Submitted in front of FE Department.',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
      currentDepartmentId: feDept.id,
      currentLocation: 'Knowledge Center Refurbished Hub',
    },
    {
      assetNumber: 'DEV-2026-002',
      category: DeviceCategory.MONITOR,
      brand: 'HP',
      model: 'ProDisplay P223 21.5"',
      serialNumber: 'HP223-99120',
      purchaseYear: 2020,
      estimatedAge: 5,
      condition: DeviceCondition.EXCELLENT,
      status: DeviceStatus.AVAILABLE_FOR_REUSE,
      estimatedWeight: 3.2,
      description: 'FHD IPS LED Monitor submitted at Gate No. 1 drop box.',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
      currentDepartmentId: cseDept.id,
      currentLocation: 'Gate No. 1 Collection Kiosk',
    },
    {
      assetNumber: 'DEV-2026-003',
      category: DeviceCategory.DESKTOP,
      brand: 'Lenovo',
      model: 'ThinkCentre M720 Tower',
      serialNumber: 'LNV-TC-11029',
      purchaseYear: 2019,
      estimatedAge: 6,
      condition: DeviceCondition.POOR,
      status: DeviceStatus.UNDER_REPAIR,
      estimatedWeight: 6.5,
      description: 'Core i5 9th Gen desktop submitted at Gate No. 2.',
      imageUrl: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=600',
      currentDepartmentId: eceDept.id,
      currentLocation: 'Hardware Maintenance Workshop',
    },
  ];

  const createdDevices = [];
  for (const dev of deviceList) {
    const d = await prisma.device.create({
      data: {
        ...dev,
        ownerId: student1.id,
      },
    });
    createdDevices.push(d);
  }

  // E-Waste Submission linked to "In front of FE Department"
  const sub1 = await prisma.ewasteSubmission.create({
    data: {
      userId: student1.id,
      deviceId: createdDevices[0].id,
      reason: 'Upgrading laptop, submitted in front of FE Department for junior students.',
      description: 'Original power cable included, clean battery status.',
      collectionPointId: cpFE.id,
      status: CollectionStatus.PICKED_UP,
    },
  });

  await prisma.collectionRequest.create({
    data: {
      submissionId: sub1.id,
      requestedById: student1.id,
      assignedVolunteerId: volunteer1.id,
      collectionPointId: cpFE.id,
      scheduledAt: new Date(Date.now() - 3 * 86400000),
      collectedAt: new Date(Date.now() - 2 * 86400000),
      status: CollectionStatus.PICKED_UP,
      notes: 'Picked up cleanly from In front of FE Department drop box.',
    },
  });

  // Assessment & Repair
  await prisma.assessment.create({
    data: {
      deviceId: createdDevices[0].id,
      technicianId: technician1.id,
      physicalCondition: DeviceCondition.GOOD,
      functionalCondition: DeviceCondition.GOOD,
      repairability: 5,
      estimatedRepairCost: 0,
      estimatedReuseValue: 12000,
      recommendedAction: RecommendedAction.REFURBISH,
      diagnosis: 'Motherboard healthy, display clean.',
      notes: 'Ready for allocation.',
    },
  });

  const repTicket = await prisma.repairTicket.create({
    data: {
      deviceId: createdDevices[2].id,
      technicianId: technician1.id,
      issue: 'Power supply fan faulty',
      diagnosis: 'PSU capacitor replaced',
      priority: 'HIGH',
      estimatedCost: 1500.0,
      status: RepairStatus.IN_PROGRESS,
    },
  });

  // Reuse Marketplace
  await prisma.reuseListing.create({
    data: {
      deviceId: createdDevices[0].id,
      listedById: singleAdmin.id,
      title: 'Refurbished Dell Latitude 3400 (Core i5 / 8GB / 256GB SSD)',
      description: 'Submitted in front of FE Department, refurbished by Campus Tech Team.',
      condition: DeviceCondition.GOOD,
      specifications: 'Intel Core i5, 8GB DDR4 RAM, 256GB SSD',
      availability: ListingStatus.AVAILABLE,
    },
  });

  // Recycling Record
  await prisma.recyclingRecord.create({
    data: {
      deviceId: createdDevices[2].id,
      recyclerName: 'GreenTech Eco-Recyclers (Govt Authorized)',
      recyclerRegistrationNumber: 'GPCB/EW/2024/9918',
      weightKg: 6.5,
      certificateNumber: 'CERT-EW-2026-9001',
      certificateUrl: 'https://ecocycle.local/certificates/CERT-EW-2026-9001.pdf',
      method: 'Zero-Landfill Pyrometallurgical Recovery',
      notes: 'Collected from Gate No. 2.',
    },
  });

  // Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: singleAdmin.id,
      action: 'SYSTEM_INITIALIZED',
      entity: 'System',
      entityId: 'SYSTEM',
      metadata: JSON.stringify({ collectionPoints: ['In front of FE Department', 'Gate No. 1', 'Gate No. 2'] }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ EcoCycle Campus database seeding with new collection points & role users complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
