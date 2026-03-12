import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    console.log('--- Add to Cart Request ---');
    console.log('User ID:', req.user?._id);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
            success: false,
            message: 'Product ID and valid quantity are required'
        });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    if (product.Stock < quantity) {
        return res.status(400).json({
            success: false,
            message: `Only ${product.Stock} items available in stock`
        });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = new Cart({
            userId: req.user._id,
            items: [],
            totalAmount: 0
        });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        if (product.Stock < newQuantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.Stock} items available in stock`
            });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
    } else {
        // Add new item
        cart.items.push({
            productId,
            quantity,
            addedAt: new Date()
        });
    }

    // Calculate total amount
    const totals = [];
    const validItems = [];
    
    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            const price = product.OfferPrice || product.Price;
            totals.push(price * item.quantity);
            validItems.push(item);
        }
    }
    
    // Clean up ghost items
    cart.items = validItems;
    cart.totalAmount = totals.reduce((sum, total) => sum + total, 0);

    await cart.save();

    res.json({
        success: true,
        message: 'Item added to cart',
        data: {
            totalItems: cart.items.length,
            totalAmount: cart.totalAmount
        }
    });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({
            success: false,
            message: 'Valid quantity is required'
        });
    }

    console.log('--- Update Cart Item Request ---');
    console.log('Item ID:', req.params.itemId);
    console.log('New Quantity:', quantity);

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    const itemIndex = cart.items.findIndex(
        item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
        console.log('Cart item not found in items list');
        return res.status(404).json({
            success: false,
            message: 'Cart item not found'
        });
    }

    // Check stock availability
    const product = await Product.findById(cart.items[itemIndex].productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    if (product.Stock < quantity) {
        return res.status(400).json({
            success: false,
            message: `Only ${product.Stock} units remaining in stock`
        });
    }

    console.log(`Updating item ${req.params.itemId} quantity from ${cart.items[itemIndex].quantity} to ${quantity}`);
    cart.items[itemIndex].quantity = quantity;
    cart.markModified('items');

    // Recalculate total
    let totalAmount = 0;
    const validItems = [];
    
    for (const item of cart.items) {
        const p = await Product.findById(item.productId);
        if (p) {
            const price = p.OfferPrice || p.Price;
            totalAmount += price * item.quantity;
            validItems.push(item);
        }
    }
    
    cart.items = validItems;
    cart.totalAmount = totalAmount;

    console.log('Saving cart with totalAmount:', totalAmount);
    await cart.save();
    console.log('Cart saved successfully');

    res.json({
        success: true,
        message: 'Cart item updated',
        data: {
            totalItems: cart.items.length,
            totalAmount: cart.totalAmount
        }
    });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    cart.items = cart.items.filter(
        item => item._id.toString() !== req.params.itemId
    );

    // Recalculate total
    let totalAmount = 0;
    const validItems = [];
    
    for (const item of cart.items) {
        const p = await Product.findById(item.productId);
        if (p) {
            const price = p.OfferPrice || p.Price;
            totalAmount += price * item.quantity;
            validItems.push(item);
        }
    }
    
    cart.items = validItems;
    cart.totalAmount = totalAmount;

    await cart.save();

    res.json({
        success: true,
        message: 'Item removed from cart',
        data: {
            totalItems: cart.items.length,
            totalAmount: cart.totalAmount
        }
    });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.json({
        success: true,
        message: 'Cart cleared successfully'
    });
});

// @desc    Get cart with populated product details
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ userId: req.user._id })
        .populate({
            path: 'items.productId',
            select: 'ProductName Brand Price OfferPrice Stock ProductImages Category'
        });

    if (!cart) {
        cart = new Cart({
            userId: req.user._id,
            items: [],
            totalAmount: 0
        });
        await cart.save();
    }

    // Calculate totals and check stock
    let totalAmount = 0;
    let outOfStockItems = [];

    const cartItems = [];
    for (const item of cart.items) {
        const product = item.productId;
        if (!product) continue; // Skip if product was deleted
        
        const price = product.OfferPrice || product.Price;
        const itemTotal = price * item.quantity;
        totalAmount += itemTotal;

        const inStock = product.Stock > 0;
        if (!inStock) {
            outOfStockItems.push(product.ProductName);
        }

        cartItems.push({
            _id: item._id,
            productId: {
                _id: product._id,
                ProductName: product.ProductName,
                Brand: product.Brand,
                Price: product.Price,
                OfferPrice: product.OfferPrice,
                ProductImages: product.ProductImages,
                Stock: product.Stock,
                Category: product.Category
            },
            quantity: item.quantity,
            total: itemTotal,
            inStock,
            availableStock: product.Stock
        });
    }

    // Update cart total
    cart.totalAmount = totalAmount;
    await cart.save();

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
        success: true,
        count: cartItems.length,
        totalQuantity,
        totalAmount,
        outOfStockItems,
        data: cartItems
    });
});

// @desc    Move item to wishlist
// @route   POST /api/cart/move-to-wishlist/:itemId
// @access  Private
export const moveToWishlist = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    const itemIndex = cart.items.findIndex(
        item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Cart item not found'
        });
    }

    const item = cart.items[itemIndex];
    const productId = item.productId;

    // Remove from cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total
    let totalAmount = 0;
    const validItems = [];
    
    for (const item of cart.items) {
        const p = await Product.findById(item.productId);
        if (p) {
            const price = p.OfferPrice || p.Price;
            totalAmount += price * item.quantity;
            validItems.push(item);
        }
    }
    
    cart.items = validItems;
    cart.totalAmount = totalAmount;

    await cart.save();

    // Add to user's wishlist
    const User = await import('../models/user.model.js').then(m => m.default);
    const user = await User.findById(req.user._id);

    if (!user.Wishlist.includes(productId)) {
        user.Wishlist.push(productId);
        await user.save();
    }

    res.json({
        success: true,
        message: 'Item moved to wishlist'
    });
});

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
export const getCartSummary = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
        return res.json({
            success: true,
            data: {
                totalItems: 0,
                totalAmount: 0,
                totalSavings: 0
            }
        });
    }

    // Calculate summary
    let totalAmount = 0;
    let originalTotal = 0;

    const validItems = [];
    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            const price = product.OfferPrice || product.Price;
            const originalPrice = product.Price;
            
            totalAmount += price * item.quantity;
            originalTotal += originalPrice * item.quantity;
            validItems.push(item);
        }
    }
    
    // Sync cart if items were filtered out
    if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        cart.totalAmount = totalAmount;
        await cart.save();
    }

    const totalSavings = originalTotal - totalAmount;

    res.json({
        success: true,
        data: {
            totalItems: cart.items.length,
            totalAmount,
            originalTotal,
            totalSavings,
            savingsPercentage: originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0
        }
    });
});
