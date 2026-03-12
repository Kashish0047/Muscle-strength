import mongoose from 'mongoose';
import Category from './Backend/models/category.model.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb+srv://skashish871:kashish0047@cluster0.nbti6.mongodb.net/Bodyrazenutrition?retryWrites=true&w=majority";

async function checkCategories() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        const categories = await Category.find();
        console.log("Categories found:", JSON.stringify(categories, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkCategories();
