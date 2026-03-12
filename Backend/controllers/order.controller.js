import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const {
        ShippingAddress,
        PaymentMethod,
        Items,
        PaymentStatus: reqPaymentStatus,
        PaymentId
    } = req.body;

    if (!ShippingAddress || !PaymentMethod || !Items || Items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Shipping address, payment method, and items are required'
        });
    }

    
    const cart = await Cart.findOne({ userId: req.user._id })
        .populate('items.productId');

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart is empty'
        });
    }

    // Validate stock for all items
    for (const item of cart.items) {
        const product = item.productId;
        if (product.Stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `${product.ProductName} is out of stock. Only ${product.Stock} available.`
            });
        }
    }

    // Calculate total amount
    let TotalAmount = 0;
    const orderItems = cart.items.map(item => {
        const product = item.productId;
        const price = product.OfferPrice || product.Price;
        const itemTotal = price * item.quantity;
        TotalAmount += itemTotal;

        return {
            productId: product._id,
            quantity: item.quantity,
            price: product.Price,
            total: itemTotal
        };
    });

    // Generate unique order ID
    const OrderId = `BRZ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
        userId: req.user._id,
        OrderId,
        Items: orderItems,
        TotalAmount,
        PaymentStatus: reqPaymentStatus || 'Pending',
        PaymentMethod,
        ShippingAddress,
        OrderStatus: 'Processing',
        PaymentId: PaymentId || null,
        PaymentDate: reqPaymentStatus === 'Paid' ? new Date() : null,
        ShippingDate: null,
        DeliveryDate: null
    });

    const createdOrder = await order.save();

    // Update product stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(
            item.productId._id,
            { $inc: { Stock: -item.quantity } }
        );
    }

    // Clear user's cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    // Add order to user's order history
    const user = await User.findById(req.user._id);
    user.Orders.push(createdOrder._id);
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: createdOrder
    });
});

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user._id })
        .populate('Items.productId', 'ProductName Brand ProductImages')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments({ userId: req.user._id });

    res.json({
        success: true,
        count: orders.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ 
        _id: req.params.id,
        userId: req.user._id 
    })
        .populate('Items.productId', 'ProductName Brand ProductImages Category');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.json({
        success: true,
        data: order
    });
});

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { OrderStatus, PaymentStatus } = req.body;

    if (!OrderStatus) {
        return res.status(400).json({
            success: false,
            message: 'Order status is required'
        });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Update order
    const updates = { OrderStatus };
    
    if (PaymentStatus) {
        updates.PaymentStatus = PaymentStatus;
    }

    // Add timestamps based on status
    if (OrderStatus === 'Confirmed') {
        updates.ShippingDate = new Date();
    } else if (OrderStatus === 'Shipped') {
        updates.ShippingDate = new Date();
    } else if (OrderStatus === 'Delivered') {
        updates.DeliveryDate = new Date();
        updates.PaymentDate = new Date();
        updates.PaymentStatus = 'Completed';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    );

    res.json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
    });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const order = await Order.findOne({ 
        _id: req.params.id,
        userId: req.user._id 
    });

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Can only cancel pending or processing orders
    if (!['Processing', 'Confirmed'].includes(order.OrderStatus)) {
        return res.status(400).json({
            success: false,
            message: 'Cannot cancel order that is already shipped or delivered'
        });
    }

    // Update order status
    order.OrderStatus = 'Cancelled';
    order.PaymentStatus = 'Refunded';
    
    await order.save();

    // Restore product stock
    for (const item of order.Items) {
        await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { Stock: item.quantity } }
        );
    }

    res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
    });
});

// @desc    Get order statistics (admin)
// @route   GET /api/orders/stats
// @access  Admin
export const getOrderStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const stats = await Order.aggregate([
        {
            $match: dateFilter
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$TotalAmount' },
                averageOrderValue: { $avg: '$TotalAmount' }
            }
        },
        {
            $project: {
                _id: 0,
                totalOrders: 1,
                totalRevenue: 1,
                averageOrderValue: 1
            }
        }
    ]);

    const orderStatusStats = await Order.aggregate([
        {
            $match: dateFilter
        },
        {
            $group: {
                _id: '$OrderStatus',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    const paymentMethodStats = await Order.aggregate([
        {
            $match: dateFilter
        },
        {
            $group: {
                _id: '$PaymentMethod',
                count: { $sum: 1 },
                total: { $sum: '$TotalAmount' }
            }
        }
    ]);

    res.json({
        success: true,
        data: {
            overview: stats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                averageOrderValue: 0
            },
            orderStatusBreakdown: orderStatusStats,
            paymentMethodBreakdown: paymentMethodStats
        }
    });
});

// @desc    Track order
// @route   GET /api/orders/track/:orderId
// @access  Public
export const trackOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ OrderId: req.params.orderId })
        .populate('Items.productId', 'ProductName Brand ProductImages')
        .populate('userId', 'Name Email Phone');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Return limited info for public tracking
    const trackingInfo = {
        OrderId: order.OrderId,
        OrderStatus: order.OrderStatus,
        PaymentStatus: order.PaymentStatus,
        PaymentMethod: order.PaymentMethod,
        createdAt: order.createdAt,
        ShippingDate: order.ShippingDate,
        DeliveryDate: order.DeliveryDate,
        Items: order.Items.map(item => ({
            ProductName: item.productId.ProductName,
            Brand: item.productId.Brand,
            quantity: item.quantity
        }))
    };

    res.json({
        success: true,
        data: trackingInfo
    });
});
