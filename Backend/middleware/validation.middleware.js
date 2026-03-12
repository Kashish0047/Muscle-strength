import { body, validationResult } from 'express-validator';

// User validation rules
export const validateUserRegistration = [
    body('Name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('Email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('Password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('Phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('Address')
        .notEmpty()
        .withMessage('Address is required')
];

export const validateUserLogin = [
    body('Email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('Password')
        .notEmpty()
        .withMessage('Password is required')
];

// Admin validation rules
export const validateAdminRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

export const validateAdminLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Product validation rules
export const validateProduct = [
    body('ProductName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('Brand')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand name must be between 2 and 50 characters'),
    
    body('Category')
        .isMongoId()
        .withMessage('Valid category ID is required'),
    
    body('Price')
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price must be greater than or equal to 0'),
    
    body('OfferPrice')
        .optional()
        .isNumeric()
        .withMessage('Offer price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Offer price must be greater than or equal to 0'),
    
    body('Stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    
    body('Description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    
    body('Ingredients')
        .trim()
        .notEmpty()
        .withMessage('Ingredients are required'),
    
    body('Benefits')
        .trim()
        .notEmpty()
        .withMessage('Benefits are required'),
    
    body('Usage')
        .trim()
        .notEmpty()
        .withMessage('Usage instructions are required')
];

// Category validation rules
export const validateCategory = [
    body('CategoryName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
    
    body('CategoryDescription')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Category description must be at least 10 characters long'),
    
    body('categoryType')
        .isIn(['Creatine', 'Protein', 'Fat Burner', 'Pre-Workout', 'Post Workout', 'Mass-gainer', 'EAA', 'BCAA', 'Vitamin', 'Collagen', 'Fish Oil'])
        .withMessage('Invalid category type')
];

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};
