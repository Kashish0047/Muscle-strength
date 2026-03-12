import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url'

dotenv.config();

import { errorHandler, notFound } from './middleware/error.middleware.js'
import { initializeFirebase } from './middleware/firebase.middleware.js'
import Category from './models/category.model.js'
import Product from './models/product.model.js'
import Admin from './models/admin.model.js'

initializeFirebase();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (origin.includes('localhost')) {
        return callback(null, true);
      }
      
      const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://localhost:5174',
        process.env.CLIENT_URL
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));



const MONGO_URI = process.env.MONGO_URI

const initializeCategories = async () => {
    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            const defaultCategories = [
                { CategoryName: 'Creatine', CategoryDescription: 'Pure creatine monohydrate for strength and power', categoryType: 'Creatine', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/creatine.png' },
                { CategoryName: 'Protein', CategoryDescription: 'Whey and plant-based protein supplements', categoryType: 'Protein', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/protein.png' },
                { CategoryName: 'Fat Burner', CategoryDescription: 'Thermogenic supplements for weight management', categoryType: 'Fat Burner', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/fatburner.png' },
                { CategoryName: 'Pre-Workout', CategoryDescription: 'Energy and focus boosters for training', categoryType: 'Pre-Workout', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/preworkout.png' },
                { CategoryName: 'Post Workout', CategoryDescription: 'Recovery supplements after exercise', categoryType: 'Post Workout', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/postworkout.png' },
                { CategoryName: 'Mass Gainer', CategoryDescription: 'High-calorie supplements for muscle growth', categoryType: 'Mass-gainer', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/massgainer.png' },
                { CategoryName: 'EAA', CategoryDescription: 'Essential amino acids for muscle recovery', categoryType: 'EAA', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/eaa.png' },
                { CategoryName: 'BCAA', CategoryDescription: 'Branched-chain amino acids for endurance', categoryType: 'BCAA', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/bcaa.png' },
                { CategoryName: 'Vitamin', CategoryDescription: 'Essential vitamins and minerals', categoryType: 'Vitamin', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/vitamin.png' },
                { CategoryName: 'Collagen', CategoryDescription: 'Collagen supplements for joints and skin', categoryType: 'Collagen', CategoryImage: 'https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/categories/collagen.png' },
                { CategoryName: 'Fish Oil', CategoryDescription: 'Omega-3 fatty acids for heart and brain health', categoryType: 'Fish Oil', CategoryImage: 'https://via.placeholder.com/150?text=Fish+Oil' }
            ];
            
            console.log('📝 Creating default categories...');
            await Category.insertMany(defaultCategories);
            console.log('✅ Default categories created successfully!');
        } else {
            console.log('✅ Categories already exist, skipping initialization');
        }
    } catch (error) {
        console.error('❌ Error initializing categories:', error.message);
    }
};

const db = mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('MongoDB connected successfully');
    
    try {
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        console.log(`📊 DB Stats: Categories: ${categoryCount}, Products: ${productCount}`);
    } catch (err) {
        console.error('Error getting stats:', err);
    }
    
    await initializeCategories();
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import contactRoutes from './routes/contact.routes.js';

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('');
    console.log('🎯 Muscle Strength Nutrition Backend Ready!');
});