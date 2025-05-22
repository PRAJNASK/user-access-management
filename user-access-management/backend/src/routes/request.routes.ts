import { Router } from 'express';
import {
  createRequest,
  getPendingRequests,
  updateRequestStatus,
  getMyRequests, // Add getMyRequests here
} from '../controllers/request.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Employee route to create a request
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Employee', 'Admin', 'Manager'), // Corrected usage: pass roles as separate arguments
  createRequest
);

// Manager route to get pending requests
router.get(
  '/pending',
  authenticateJWT,
  authorizeRoles('Manager', 'Admin'), // Corrected usage: pass roles as separate arguments
  getPendingRequests
);

// Manager route to update request status (approve/reject)
router.patch(
  '/:id',
  authenticateJWT,
  authorizeRoles('Manager', 'Admin'), // Corrected usage: pass roles as separate arguments
  updateRequestStatus
);

// Employee route to get their own requests
router.get(
  '/my-requests',
  authenticateJWT,
  authorizeRoles('Employee', 'Admin', 'Manager'), // Or just 'Employee' if only they should see it
  getMyRequests
);

export default router;
