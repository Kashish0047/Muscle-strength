import express from 'express';
import {

    getAllAdmins,
    updateAdminPermissions,
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllProductsAdmin,
    deleteUser,
    getSystemHealth
} from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/firebase.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();



// Admin only routes
router.use(authenticateAdmin);
router.get('/dashboard', getDashboardStats);
router.get('/admins', getAllAdmins);
router.put('/admin/:id/permissions', updateAdminPermissions);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/products', getAllProductsAdmin);
router.get('/health', getSystemHealth);

export default router;
