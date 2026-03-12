import express from 'express';
import {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCart,
    moveToWishlist,
    getCartSummary
} from '../controllers/cart.controller.js';
import { authenticateFirebaseUser } from '../middleware/firebase.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// All routes require Firebase authentication
router.use(authenticateFirebaseUser);

// Cart operations
router.post('/add', addToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.get('/', getCart);
router.post('/move-to-wishlist/:itemId', moveToWishlist);
router.get('/summary', getCartSummary);

export default router;
