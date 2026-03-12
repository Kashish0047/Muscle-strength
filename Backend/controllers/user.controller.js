import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-Password')
        .populate('Wishlist', 'ProductName Brand Price OfferPrice ProductImages');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const {
        Name,
        Phone,
        Address
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Update fields
    if (Name) user.Name = Name;
    if (Phone) user.Phone = Phone;
    if (Address) user.Address = { ...user.Address, ...Address };

    await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            _id: user._id,
            Name: user.Name,
            Email: user.Email,
            Phone: user.Phone,
            Address: user.Address,
            createdAt: user.createdAt
        }
    });
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: 'Product ID is required'
        });
    }

    const user = await User.findById(req.user._id);

    if (!user.Wishlist.includes(productId)) {
        user.Wishlist.push(productId);
        await user.save();
    }

    res.json({
        success: true,
        message: 'Product added to wishlist'
    });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.Wishlist = user.Wishlist.filter(
        item => item.toString() !== req.params.productId
    );

    await user.save();

    res.json({
        success: true,
        message: 'Product removed from wishlist'
    });
});

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: 'Wishlist',
            populate: {
                path: 'Category',
                select: 'CategoryName CategoryImage'
            }
        });

    res.json({
        success: true,
        count: user.Wishlist.length,
        data: user.Wishlist
    });
});

// @desc    Get user's orders
// @route   GET /api/users/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id)
        .populate({
            path: 'Orders',
            options: {
                sort: { createdAt: -1 },
                skip,
                limit,
                populate: {
                    path: 'Items.productId',
                    select: 'ProductName Brand Price OfferPrice ProductImages'
                }
            }
        });

    const total = user.Orders.length;

    res.json({
        success: true,
        count: user.Orders.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: user.Orders
    });
});

// @desc    Get user's cart
// @route   GET /api/users/cart
// @access  Private
export const getUserCart = asyncHandler(async (req, res) => {
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

    // Calculate totals
    let totalAmount = 0;
    const cartItems = cart.items.map(item => {
        const product = item.productId;
        const price = product.OfferPrice || product.Price;
        const itemTotal = price * item.quantity;
        totalAmount += itemTotal;

        return {
            _id: item._id,
            productId: product._id,
            ProductName: product.ProductName,
            Brand: product.Brand,
            Price: product.Price,
            OfferPrice: product.OfferPrice,
            quantity: item.quantity,
            total: itemTotal,
            ProductImages: product.ProductImages,
            Category: product.Category,
            inStock: product.Stock > 0
        };
    });

    // Update cart total
    cart.totalAmount = totalAmount;
    await cart.save();

    res.json({
        success: true,
        count: cartItems.length,
        totalAmount,
        data: cartItems
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Password is required to delete account'
        });
    }

    const user = await User.findById(req.user._id).select('+Password');

    // Verify password (if user has password)
    if (user.Password) {
        const bcrypt = await import('bcryptjs').then(m => m.default);
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }
    }

    // Soft delete - set inactive
    user.isActive = false;
    user.Email = `deleted_${Date.now()}_${user.Email}`;
    await user.save();

    // Clear user's cart
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.json({
        success: true,
        message: 'Account deleted successfully'
    });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('Orders', 'TotalAmount OrderStatus createdAt');

    const totalOrders = user.Orders.length;
    const totalSpent = user.Orders
        .filter(order => order.OrderStatus === 'Delivered')
        .reduce((sum, order) => sum + order.TotalAmount, 0);

    const pendingOrders = user.Orders.filter(
        order => order.OrderStatus === 'Processing' || order.OrderStatus === 'Confirmed'
    ).length;

    const wishlistCount = user.Wishlist.length;

    res.json({
        success: true,
        data: {
            totalOrders,
            totalSpent,
            pendingOrders,
            wishlistCount,
            memberSince: user.createdAt
        }
    });
});
