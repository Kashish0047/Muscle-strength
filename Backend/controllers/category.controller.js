import Category from '../models/category.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { getFileUrl, deleteFile } from '../middleware/upload.middleware.js';

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'Category',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: { $size: '$products' }
            }
        },
        {
            $project: {
                CategoryName: 1,
                CategoryDescription: 1,
                CategoryImage: 1,
                categoryType: 1,
                isActive: 1,
                productCount: 1
            }
        },
        {
            $sort: { CategoryName: 1 }
        }
    ]);

    res.json({
        success: true,
        count: categories.length,
        data: categories.map(category => ({
            ...category,
            CategoryImage: getFileUrl(category.CategoryImage)
        }))
    });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    res.json({
        success: true,
        data: {
            ...category.toObject(),
            CategoryImage: getFileUrl(category.CategoryImage)
        }
    });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
    const {
        CategoryName,
        CategoryDescription,
        categoryType
    } = req.body;

    // Check if category type already exists
    const existingCategory = await Category.findOne({ 
        $or: [
            { CategoryName },
            { categoryType }
        ]
    });

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            message: 'Category with this name or type already exists'
        });
    }

    // Process uploaded image
    const CategoryImage = req.file ? (req.file.path || req.file.url) : null;

    const category = new Category({
        CategoryName,
        CategoryDescription,
        CategoryImage,
        categoryType,
        isActive: true
    });

    const createdCategory = await category.save();

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: {
            ...createdCategory.toObject(),
            CategoryImage: getFileUrl(createdCategory.CategoryImage)
        }
    });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    const updates = req.body;

    // Handle new image if uploaded
    if (req.file) {
        updates.CategoryImage = req.file.path || req.file.url;
    }

    // Check if new name or type conflicts with existing categories
    if (updates.CategoryName || updates.categoryType) {
        const conflictCategory = await Category.findOne({
            _id: { $ne: req.params.id },
            $or: [
                updates.CategoryName ? { CategoryName: updates.CategoryName } : null,
                updates.categoryType ? { categoryType: updates.categoryType } : null
            ].filter(Boolean)
        });

        if (conflictCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name or type already exists'
            });
        }
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: {
                ...updatedCategory.toObject(),
                CategoryImage: getFileUrl(updatedCategory.CategoryImage)
            }
        });
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Validation failed',
            details: error.errors
        });
    }
});

// @desc    Delete category (soft delete)
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    // Check if category has products
    const Product = await import('../models/product.model.js').then(m => m.default);
    const productsCount = await Product.countDocuments({ Category: category._id });

    if (productsCount > 0) {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete category with existing products. Please delete products first.'
        });
    }

    // Delete category image
    if (category.CategoryImage) {
        deleteFile(category.CategoryImage);
    }

    // Soft delete - set isActive to false
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
        success: true,
        message: 'Category deleted successfully'
    });
});

// @desc    Get category by type
// @route   GET /api/categories/type/:type
// @access  Public
export const getCategoryByType = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ 
        categoryType: req.params.type,
        isActive: true 
    });

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    res.json({
        success: true,
        data: {
            ...category.toObject(),
            CategoryImage: getFileUrl(category.CategoryImage)
        }
    });
});

// @desc    Get all category types
// @route   GET /api/categories/types
// @access  Public
export const getCategoryTypes = asyncHandler(async (req, res) => {
    const categoryTypes = [
        'Creatine', 'Protein', 'Fat Burner', 'Pre-Workout', 
        'Post Workout', 'Mass-gainer', 'EAA', 'BCAA', 
        'Vitamin', 'Collagen', 'Fish Oil'
    ];

    // Get categories with product counts
    const Product = await import('../models/product.model.js').then(m => m.default);
    const categoriesWithCounts = await Category.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'Category',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: { $size: '$products' }
            }
        },
        {
            $project: {
                CategoryName: 1,
                categoryType: 1,
                CategoryImage: 1,
                productCount: 1
            }
        },
        {
            $sort: { categoryType: 1 }
        }
    ]);

    res.json({
        success: true,
        data: categoryTypes.map(type => ({
            type,
            name: type.replace('-', ' '),
            category: categoriesWithCounts.find(cat => cat.categoryType === type),
            hasProducts: categoriesWithCounts.some(cat => cat.categoryType === type && cat.productCount > 0)
        }))
    });
});

// @desc    Activate/Deactivate category
// @route   PATCH /api/categories/:id/toggle
// @access  Admin
export const toggleCategoryStatus = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
        success: true,
        message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            ...category.toObject(),
            CategoryImage: getFileUrl(category.CategoryImage)
        }
    });
});
