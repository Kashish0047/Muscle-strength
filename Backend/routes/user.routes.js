import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    getUserOrders,
    deleteAccount,
    getUserStats
} from '../controllers/user.controller.js';
import { authenticateFirebaseUser } from '../middleware/firebase.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// All routes require Firebase authentication
router.use(authenticateFirebaseUser);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Wishlist routes
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.get('/wishlist', getWishlist);

// Order routes
router.get('/orders', getUserOrders);

// Account routes
router.delete('/account', deleteAccount);

// Statistics route
router.get('/stats', getUserStats);

export default router;
