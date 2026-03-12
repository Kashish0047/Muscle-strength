import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for product images
const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bodyraze/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

// Configure storage for category images
const categoryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bodyraze/categories',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

// Multer configuration for product images
export const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
    }
});

// Multer configuration for category images
export const uploadCategoryImage = multer({
    storage: categoryStorage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
});

// Single image upload for category
export const uploadCategory = uploadCategoryImage.single('CategoryImage');

// Multiple images upload for products
export const uploadProducts = uploadProductImages.array('ProductImages', 5);

// Middleware to handle file upload errors
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB for products and 2MB for categories.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 5 images allowed for products.'
            });
        }
    }
    
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Error uploading files'
        });
    }
    
    next();
};

// Helper function to get file URL
export const getFileUrl = (file) => {
    // With Cloudinary, the file object from multer already contains the path (URL)
    // if file is a string (legacy/existing), return it as is if it's already a URL
    if (typeof file === 'string') {
        return file;
    }
    return file?.path || file?.url || null;
};

// Helper function to delete file from Cloudinary
export const deleteFile = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
    }
};

// Helper function to delete multiple files from Cloudinary
export const deleteFiles = async (publicIds) => {
    if (!publicIds || !Array.isArray(publicIds)) return;
    try {
        await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
        console.error('Error deleting files from Cloudinary:', error);
    }
};
