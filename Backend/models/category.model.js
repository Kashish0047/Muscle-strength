import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    CategoryName : {
        type : String,
        required : true,
        unique : true
    },
    CategoryDescription: {
        type : String,
        required : true
    },
    CategoryImage : {
        type : String,
        required : true
    },
    isActive : {
        type : Boolean,
        required : true,
        default : true
    },
    categoryType : {
        type : String,
        enum : ['Creatine', 'Protein', 'Fat Burner', 'Pre-Workout', 'Post Workout', 'Mass-gainer', 'EAA', 'BCAA', 'Vitamin', 'Collagen', 'Fish Oil'],
        required : true,
        unique : true
    }
}, {timestamps : true})

const Category = mongoose.model("Category", CategorySchema)
export default Category