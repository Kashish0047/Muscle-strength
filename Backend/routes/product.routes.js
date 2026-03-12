import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getOfferProducts,
    getProductsByCategory,
    getBestSellingProducts
} from '../controllers/product.controller.js';
import { authenticateAdmin } from '../middleware/firebase.middleware.js';
import { uploadProducts, handleUploadError } from '../middleware/upload.middleware.js';
import { validateProduct, handleValidationErrors } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/offers', getOfferProducts);
router.get('/category/:categoryType', getProductsByCategory);
router.get('/bestsellers', getBestSellingProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', 
    authenticateAdmin, 
    uploadProducts, 
    handleUploadError,
    createProduct
);

router.put('/:id', 
    authenticateAdmin, 
    uploadProducts, 
    handleUploadError,
    updateProduct
);

router.delete('/:id', 
    authenticateAdmin, 
    deleteProduct
);

export default router;
