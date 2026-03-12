import express from 'express';
import {
    submitContactForm,
    getContactInquiries,
    updateInquiryStatus,
    deleteInquiry
} from '../controllers/contact.controller.js';
import { authenticateAdmin } from '../middleware/firebase.middleware.js';

const router = express.Router();

// Public route to submit contact form
router.post('/', submitContactForm);

// Admin routes to manage inquiries
router.get('/', authenticateAdmin, getContactInquiries);
router.put('/:id', authenticateAdmin, updateInquiryStatus);
router.delete('/:id', authenticateAdmin, deleteInquiry);

export default router;
