import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';



// @desc    Get all admins (SuperAdmin only)
// @route   GET /api/admin/admins
// @access  SuperAdmin
export const getAllAdmins = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admins = await Admin.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Admin.countDocuments();

    res.json({
        success: true,
        count: admins.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: admins
    });
});

// @desc    Update admin permissions
// @route   PUT /api/admin/:id/permissions
// @access  SuperAdmin
export const updateAdminPermissions = asyncHandler(async (req, res) => {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
        return res.status(400).json({
            success: false,
            message: 'Permissions array is required'
        });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: 'Admin not found'
        });
    }

    // Validate permissions
    const validPermissions = [
        "product_management", 
        "order_management", 
        "user_management", 
        "analytics"
    ];

    const invalidPermissions = permissions.filter(
        perm => !validPermissions.includes(perm)
    );

    if (invalidPermissions.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Invalid permissions: ${invalidPermissions.join(', ')}`
        });
    }

    admin.permissions = permissions;
    await admin.save();

    res.json({
        success: true,
        message: 'Admin permissions updated successfully',
        data: {
            _id: admin._id,
            username: admin.username,
            permissions: admin.permissions
        }
    });
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Get basic stats
    const [
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue
    ] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Order.aggregate([
            { $group: { _id: null, total: { $sum: '$TotalAmount' } } }
        ])
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
        .populate('userId', 'Name Email')
        .sort({ createdAt: -1 })
        .limit(10);

    // Get top products
    const topProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('ProductName Brand Price Stock');

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
        {
            $group: {
                _id: '$OrderStatus',
                count: { $sum: 1 }
            }
        }
    ]);

    res.json({
        success: true,
        data: {
            overview: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            recentOrders,
            topProducts,
            ordersByStatus
        }
    });
});

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
        .select('-Password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    res.json({
        success: true,
        count: users.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: users
    });
});

// @desc    Update user status (Admin)
// @route   PUT /api/admin/users/:id/status
// @access  Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'isActive must be a boolean'
        });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
});

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Admin
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
        .populate('Category', 'CategoryName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments();

    res.json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: products
    });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Soft delete
    user.isActive = false;
    user.Email = `deleted_${Date.now()}_${user.Email}`;
    await user.save();

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Admin
export const getSystemHealth = asyncHandler(async (req, res) => {
    const [
        totalProducts,
        lowStockProducts,
        pendingOrders,
        totalUsers
    ] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ Stock: { $lt: 10 } }),
        Order.countDocuments({ OrderStatus: 'Processing' }),
        User.countDocuments({ isActive: true })
    ]);

    res.json({
        success: true,
        data: {
            totalProducts,
            lowStockProducts,
            pendingOrders,
            totalUsers,
            systemStatus: 'healthy'
        }
    });
});
