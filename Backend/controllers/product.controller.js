import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { getFileUrl, deleteFiles } from '../middleware/upload.middleware.js';
import mongoose from 'mongoose';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    // Category filter
    if (req.query.category) {
        let category;
        if (mongoose.Types.ObjectId.isValid(req.query.category)) {
            category = await Category.findById(req.query.category);
        } else {
            category = await Category.findOne({ categoryType: req.query.category });
        }
        
        if (category) {
            filter.Category = category._id;
        }
    }

    // Search filter
    if (req.query.search) {
        filter.ProductName = { $regex: req.query.search, $options: 'i' };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter.Price = {};
        if (req.query.minPrice) filter.Price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter.Price.$lte = parseFloat(req.query.maxPrice);
    }

    // Featured products
    if (req.query.featured === 'true') {
        filter.isFeatured = true;
    }

    // Products on offer
    if (req.query.offer === 'true') {
        filter.isOnOffer = true;
    }

    // Sort options
    const sort = {};
    if (req.query.sort) {
        const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
        const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
        sort[sortField] = sortOrder;
    } else {
        sort.createdAt = -1; // Default: newest first
    }

    const products = await Product.find(filter)
        .populate('Category', 'CategoryName CategoryImage')
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: products.map(product => ({
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img)),
            Category: product.Category
        }))
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('Category', 'CategoryName CategoryImage');

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    res.json({
        success: true,
        data: {
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img))
        }
    });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
    const {
        ProductName,
        Brand,
        Category: categoryId,
        Price,
        OfferPrice,
        Stock,
        Description,
        Ingredients,
        NutritionalValue,
        Benefits,
        Usage,
        isFeatured,
        isOnOffer
    } = req.body;

    // Validate category exists
    console.log('Looking for category with ID:', categoryId);
    console.log('CategoryId type:', typeof categoryId);
    console.log('CategoryId isValid ObjectId:', mongoose.Types.ObjectId.isValid(categoryId));
    
    let foundCategory;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            console.log('Invalid ObjectId format:', categoryId);
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }
        foundCategory = await Category.findById(categoryId);
        console.log('Category.findById result:', foundCategory);
    } catch (error) {
        console.log('Error finding category:', error);
        foundCategory = null;
    }
    
    console.log('Found category:', foundCategory);
    
    if (!foundCategory) {
        const allCategories = await Category.find({}).select('_id CategoryName categoryType');
        console.log('All categories in DB:', allCategories);
        console.log('Looking for exact match with ID:', categoryId);
        const exactMatch = allCategories.find(cat => cat._id.toString() === categoryId);
        console.log('Exact match found:', exactMatch);
        return res.status(400).json({
            success: false,
            message: 'Invalid category',
            debug: {
                categoryId,
                availableCategories: allCategories.map(cat => ({
                    _id: cat._id.toString(),
                    CategoryName: cat.CategoryName,
                    categoryType: cat.categoryType
                })),
                exactMatch
            }
        });
    }

    // Process uploaded images
    const ProductImages = req.files ? req.files.map(file => file.path || file.url || file.filename) : [];

    console.log('Received OfferPrice:', OfferPrice);
    
    // Robust parsing for numeric fields
    const parsedPrice = parseFloat(Price);
    const parsedStock = parseInt(Stock, 10);
    const parsedOfferPrice = (OfferPrice !== undefined && OfferPrice !== '' && OfferPrice !== null && !isNaN(parseFloat(OfferPrice))) 
        ? parseFloat(OfferPrice) 
        : null;

    console.log(`Backend: Creating product with Stock: ${parsedStock} (Original: ${Stock})`);

    const product = new Product({
        ProductName,
        ProductImages,
        Brand,
        Category: foundCategory._id,
        Price: parsedPrice,
        OfferPrice: parsedOfferPrice,
        Stock: isNaN(parsedStock) ? 0 : parsedStock,
        Description,
        Ingredients,
        NutritionalValue,
        Benefits,
        Usage,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isOnOffer: isOnOffer === 'true' || isOnOffer === true
    });

    const createdProduct = await product.save();

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
            ...createdProduct.toObject(),
            ProductImages: createdProduct.ProductImages.map(img => getFileUrl(img))
        }
    });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Update fields
    const updates = req.body;
    
    // Handle stock update - preserve existing stock ONLY if field is empty
    if (updates.Stock === undefined || updates.Stock === '' || updates.Stock === null) {
        delete updates.Stock;
    } else {
        updates.Stock = parseInt(updates.Stock, 10);
    }
    
    console.log(`Backend: Updating product ${req.params.id}. Target Stock: ${updates.Stock} (Received: ${req.body.Stock})`);
    
    // Process images
    let productImages = [];
    
    // 1. Add existing image URLs from the body
    if (req.body.imageUrls) {
        if (Array.isArray(req.body.imageUrls)) {
            productImages = [...req.body.imageUrls];
        } else {
            productImages.push(req.body.imageUrls);
        }
    }
    
    // 2. Add new uploaded files
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path || file.url || file.filename);
        productImages = [...productImages, ...newImages];
    }
    
    // 3. If no images provided at all, keep existing ones (optional, depending on intended behavior)
    if (productImages.length > 0) {
        updates.ProductImages = productImages;
    }

    // Robust parsing for numeric fields
    if (updates.Price) updates.Price = parseFloat(updates.Price);
    if (updates.OfferPrice !== undefined) {
        updates.OfferPrice = (updates.OfferPrice === '' || updates.OfferPrice === 'null' || updates.OfferPrice === null) 
            ? null 
            : parseFloat(updates.OfferPrice);
    }
// Stock already parsed above

    // Skip category validation for updates - only validate on create
    // if (updates.Category && updates.Category !== '') {
    //     console.log('Update: Looking for category with ID:', updates.Category);
    //     console.log('Update: CategoryId type:', typeof updates.Category);
    //     console.log('Update: CategoryId isValid ObjectId:', mongoose.Types.ObjectId.isValid(updates.Category));
        
    //     const category = await Category.findById(new mongoose.Types.ObjectId(updates.Category));
    //     console.log('Update: Found category:', category);
        
    //     if (!category) {
    //         const allCategories = await Category.find({}).select('_id CategoryName categoryType');
    //         console.log('Update: All available categories:', allCategories);
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Invalid category',
    //             debug: {
    //                 categoryId: updates.Category,
    //                 availableCategories: allCategories.map(cat => ({
    //                     _id: cat._id.toString(),
    //                     CategoryName: cat.CategoryName,
    //                     categoryType: cat.categoryType
    //                 }))
    //             }
    //         });
    //     }
    // } else {
    //     console.log('Update: No category update provided, skipping validation');
    // }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    ).populate('Category', 'CategoryName CategoryImage');

    console.log('Update: Applied updates:', updates);
    console.log('Update: Updated product:', updatedProduct);

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: {
            ...updatedProduct.toObject(),
            ProductImages: updatedProduct.ProductImages.map(img => getFileUrl(img))
        }
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Delete product images
    deleteFiles(product.ProductImages);

    await Product.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true })
        .populate('Category', 'CategoryName CategoryImage')
        .sort({ createdAt: -1 })
        .limit(8);

    res.json({
        success: true,
        count: products.length,
        data: products.map(product => ({
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img)),
            Category: product.Category
        }))
    });
});

// @desc    Get products on offer
// @route   GET /api/products/offers
// @access  Public
export const getOfferProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ 
        isOnOffer: true,
        OfferPrice: { $exists: true, $ne: null }
    })
        .populate('Category', 'CategoryName CategoryImage')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: products.length,
        data: products.map(product => ({
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img)),
            Category: product.Category,
            discountPercentage: Math.round(((product.Price - product.OfferPrice) / product.Price) * 100)
        }))
    });
});

// @desc    Get products by category
// @route   GET /api/products/category/:categoryType
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
    let category;
    if (mongoose.Types.ObjectId.isValid(req.params.categoryType)) {
        category = await Category.findById(req.params.categoryType);
    } else {
        category = await Category.findOne({ categoryType: req.params.categoryType });
    }
    
    if (!category) {
        return res.status(404).json({
            success: false,
            message: 'Category not found'
        });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ Category: category._id })
        .populate('Category', 'CategoryName CategoryImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments({ Category: category._id });

    res.json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: products.map(product => ({
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img)),
            Category: product.Category
        }))
    });
});

// @desc    Get best selling products
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestSellingProducts = asyncHandler(async (req, res) => {
    // For now, return featured products as best sellers
    // In a real app, you'd track sales data
    const products = await Product.find({ isFeatured: true })
        .populate('Category', 'CategoryName CategoryImage')
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({
        success: true,
        count: products.length,
        data: products.map(product => ({
            ...product.toObject(),
            ProductImages: product.ProductImages.map(img => getFileUrl(img)),
            Category: product.Category
        }))
    });
});
