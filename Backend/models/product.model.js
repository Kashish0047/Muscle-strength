import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    ProductName : {
        type : String,
        required : true
    },
    ProductImages : [{
        type : String,
        required : false
    }],
    Brand : {
        type : String,
        required : true
    },
    Category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    Price : {
        type : Number,
        required : true
    },
    OfferPrice : {
        type : Number,
        required : false
    },
    Stock : {
        type : Number,
        required : false
    },
    Description : {
        type : String,
        required : true
    },
    Ingredients :{
        type : String,
        required : true
    },
    NutritionalValue : {
        type : String,
        required : true
    },
    Benefits : {
        type : String,
        required : true
    },
    Usage : {
        type : String,
        required : true
    },
    isFeatured : {
        type : Boolean,
        required : false,
        default : false
    },
    isOnOffer :{
        type : Boolean,
        required : false,
        default : false
    },
    
    
    
}, {timestamps: true})

// Indexes for faster queries on 1000+ products
productSchema.index({ ProductName: 'text', Brand: 'text', Description: 'text' }); // Full-text search
productSchema.index({ Category: 1 });           // Fast category filter
productSchema.index({ Price: 1 });              // Fast price sort
productSchema.index({ isFeatured: 1 });         // Fast featured filter
productSchema.index({ isOnOffer: 1 });          // Fast offer filter
productSchema.index({ createdAt: -1 });         // Fast default sort (newest first)
productSchema.index({ Category: 1, Price: 1 }); // Compound: category + price filter


const Product = mongoose.model("Product", productSchema)
export default Product