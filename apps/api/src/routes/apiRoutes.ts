import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { getDevices, getDeviceByAssetNumber, updateDeviceStatus } from '../controllers/deviceController';
import { createSubmission, getSubmissions } from '../controllers/ewasteController';
import { getCollectionPoints, createCollectionPoint, getCollectionRequests, updateCollectionRequestStatus } from '../controllers/collectionController';
import { createAssessment, getRepairs, createRepairTicket, addRepairUpdate, getParts, addRepairPart } from '../controllers/repairController';
import { getListings, requestDevice, getReuseRequests, reviewReuseRequest } from '../controllers/reuseController';
import { createRecyclingRecord, getRecyclingRecords } from '../controllers/recyclingController';
import { getImpactMetrics, getAdminAnalytics } from '../controllers/analyticsController';
import { getUserNotifications, markNotificationAsRead } from '../controllers/notificationController';
import { getAuditLogs, exportAuditLogsCSV } from '../controllers/auditController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '@ecocycle/shared';

const router = Router();

// --- AUTH ROUTES ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

// --- DEVICE LIFECYCLE & TRACKING ---
router.get('/devices', authenticate, getDevices);
router.get('/devices/:assetNumber', getDeviceByAssetNumber); // Public scan capability
router.patch('/devices/:id/status', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), updateDeviceStatus);

// --- E-WASTE SUBMISSIONS ---
router.post('/ewaste/submissions', authenticate, createSubmission);
router.get('/ewaste/submissions', authenticate, getSubmissions);

// --- COLLECTION SYSTEM ---
router.get('/collections/points', getCollectionPoints);
router.post('/collections/points', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), createCollectionPoint);
router.get('/collections/requests', authenticate, authorize(Role.VOLUNTEER, Role.ADMIN, Role.SUPER_ADMIN), getCollectionRequests);
router.patch('/collections/requests/:id', authenticate, authorize(Role.VOLUNTEER, Role.ADMIN, Role.SUPER_ADMIN), updateCollectionRequestStatus);

// --- ASSESSMENT & REPAIRS ---
router.post('/assessments', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), createAssessment);
router.get('/repairs', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), getRepairs);
router.post('/repairs', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), createRepairTicket);
router.post('/repairs/:id/updates', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), addRepairUpdate);
router.get('/repairs/parts', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), getParts);
router.post('/repairs/:id/parts', authenticate, authorize(Role.TECHNICIAN, Role.ADMIN, Role.SUPER_ADMIN), addRepairPart);

// --- REUSE MARKETPLACE ---
router.get('/reuse/listings', getListings);
router.post('/reuse/requests', authenticate, requestDevice);
router.get('/reuse/requests', authenticate, getReuseRequests);
router.patch('/reuse/requests/:id', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), reviewReuseRequest);

// --- RECYCLING ---
router.post('/recycling', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), createRecyclingRecord);
router.get('/recycling', authenticate, getRecyclingRecords);

// --- SUSTAINABILITY IMPACT & ANALYTICS ---
router.get('/impact', getImpactMetrics);
router.get('/analytics', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), getAdminAnalytics);

// --- NOTIFICATIONS ---
router.get('/notifications', authenticate, getUserNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationAsRead);

// --- AUDIT LOGS ---
router.get('/audit-logs', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), getAuditLogs);
router.get('/audit-logs/export', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), exportAuditLogsCSV);

export default router;
