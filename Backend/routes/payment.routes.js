import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import { authenticateFirebaseUser } from '../middleware/firebase.middleware.js';

const router = express.Router();

router.post('/create-order', authenticateFirebaseUser, createOrder);
router.post('/verify', authenticateFirebaseUser, verifyPayment);

export default router;
