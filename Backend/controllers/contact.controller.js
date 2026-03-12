import Contact from '../models/contact.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        subject,
        message
    });

    res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully. We will get back to you soon.',
        data: contact
    });
});

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Admin
export const getContactInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: inquiries.length,
        data: inquiries
    });
});

// @desc    Update inquiry status
// @route   PUT /api/contact/:id
// @access  Admin
export const updateInquiryStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'Status is required'
        });
    }

    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: 'Inquiry not found'
        });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
        success: true,
        message: 'Inquiry status updated',
        data: inquiry
    });
});

// @desc    Delete an inquiry
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: 'Inquiry not found'
        });
    }

    await inquiry.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Inquiry deleted'
    });
});
