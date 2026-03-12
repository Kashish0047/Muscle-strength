import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByType,
    getCategoryTypes,
    toggleCategoryStatus
} from '../controllers/category.controller.js';
import { authenticateAdmin } from '../middleware/firebase.middleware.js';
import { uploadCategory, handleUploadError } from '../middleware/upload.middleware.js';
import { validateCategory, handleValidationErrors } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/types', getCategoryTypes);
router.get('/type/:type', getCategoryByType);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', 
    authenticateAdmin, 
    uploadCategory, 
    handleUploadError,
    validateCategory, 
    handleValidationErrors, 
    createCategory
);

router.put('/:id', 
    authenticateAdmin, 
    uploadCategory, 
    handleUploadError,
    validateCategory, 
    handleValidationErrors, 
    updateCategory
);

router.patch('/:id/toggle', 
    authenticateAdmin, 
    toggleCategoryStatus
);

router.delete('/:id', 
    authenticateAdmin, 
    deleteCategory
);

export default router;
