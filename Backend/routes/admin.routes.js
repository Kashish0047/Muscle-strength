import express from 'express';
import {
    registerAdmin,
    loginAdmin,
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

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

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
