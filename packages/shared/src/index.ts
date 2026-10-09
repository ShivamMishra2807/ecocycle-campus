import { z } from 'zod';

export enum Role {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum DeviceCategory {
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  MONITOR = 'MONITOR',
  PRINTER = 'PRINTER',
  PROJECTOR = 'PROJECTOR',
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE',
  ROUTER = 'ROUTER',
  SERVER = 'SERVER',
  HARD_DRIVE = 'HARD_DRIVE',
  BATTERY = 'BATTERY',
  CABLE = 'CABLE',
  OTHER = 'OTHER',
}

export enum DeviceCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED',
  NON_FUNCTIONAL = 'NON_FUNCTIONAL',
}

export enum DeviceStatus {
  REPORTED = 'REPORTED',
  COLLECTION_PENDING = 'COLLECTION_PENDING',
  COLLECTED = 'COLLECTED',
  UNDER_ASSESSMENT = 'UNDER_ASSESSMENT',
  REPAIR_REQUIRED = 'REPAIR_REQUIRED',
  UNDER_REPAIR = 'UNDER_REPAIR',
  REFURBISHED = 'REFURBISHED',
  AVAILABLE_FOR_REUSE = 'AVAILABLE_FOR_REUSE',
  ALLOCATED = 'ALLOCATED',
  SENT_FOR_RECYCLING = 'SENT_FOR_RECYCLING',
  RECYCLED = 'RECYCLED',
}

export enum CollectionStatus {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum RecommendedAction {
  REPAIR = 'REPAIR',
  REFURBISH = 'REFURBISH',
  REUSE_DIRECTLY = 'REUSE_DIRECTLY',
  PARTS_RECOVERY = 'PARTS_RECOVERY',
  RECYCLE = 'RECYCLE',
}

export enum RepairStatus {
  OPEN = 'OPEN',
  DIAGNOSING = 'DIAGNOSING',
  WAITING_FOR_PARTS = 'WAITING_FOR_PARTS',
  IN_PROGRESS = 'IN_PROGRESS',
  QUALITY_CHECK = 'QUALITY_CHECK',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ListingStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  ALLOCATED = 'ALLOCATED',
  REMOVED = 'REMOVED',
}

export enum ReuseRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  SYSTEM = 'SYSTEM',
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId?: string | null;
  departmentName?: string | null;
  avatarUrl?: string | null;
}

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).default(Role.STUDENT),
  departmentId: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const EwasteSubmissionSchema = z.object({
  category: z.nativeEnum(DeviceCategory),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().optional(),
  purchaseYear: z.number().optional(),
  estimatedAge: z.number().optional(),
  condition: z.nativeEnum(DeviceCondition),
  description: z.string().optional(),
  reason: z.string().min(3, 'Reason is required'),
  imageUrl: z.string().optional(),
  preferredCollectionDate: z.string().optional(),
  collectionPointId: z.string().optional(),
  currentLocation: z.string().optional(),
  estimatedWeight: z.number().optional(),
});

export const AssessmentSchema = z.object({
  deviceId: z.string(),
  physicalCondition: z.nativeEnum(DeviceCondition),
  functionalCondition: z.nativeEnum(DeviceCondition),
  repairability: z.number().min(1).max(5),
  estimatedRepairCost: z.number().optional(),
  estimatedReuseValue: z.number().optional(),
  recommendedAction: z.nativeEnum(RecommendedAction),
  diagnosis: z.string().min(5, 'Diagnosis description is required'),
  notes: z.string().optional(),
});

export const RepairTicketSchema = z.object({
  deviceId: z.string(),
  issue: z.string().min(3, 'Issue summary required'),
  diagnosis: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  estimatedCost: z.number().optional(),
  estimatedCompletion: z.string().optional(),
});

export const ReuseRequestSchema = z.object({
  listingId: z.string(),
  reason: z.string().min(5, 'Reason for requesting device is required'),
  departmentId: z.string().optional(),
});
