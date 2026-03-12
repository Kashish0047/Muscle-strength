import Razorpay from 'razorpay';
import crypto from 'crypto';
import { asyncHandler } from '../middleware/error.middleware.js';

// Initialize Razorpay
// Important: These will be loaded from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
        return res.status(400).json({
            success: false,
            message: 'Amount is required'
        });
    }

    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Razorpay order',
            error: error.message
        });
    }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        res.json({
            success: true,
            message: 'Payment verified successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid payment signature'
        });
    }
});
