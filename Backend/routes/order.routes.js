import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    trackOrder
} from '../controllers/order.controller.js';
import { authenticateFirebaseUser } from '../middleware/firebase.middleware.js';
import { authenticateAdmin } from '../middleware/firebase.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// Public routes
router.get('/track/:orderId', trackOrder);

// User routes (require Firebase authentication)
router.use(authenticateFirebaseUser);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes (require Admin authentication)
router.put('/:id/status', authenticateAdmin, updateOrderStatus);
router.put('/:id/cancel', authenticateAdmin, cancelOrder);

// Admin statistics routes
router.get('/stats', authenticateAdmin, getOrderStats);

export default router;
