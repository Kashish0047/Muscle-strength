import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username : {
        type : String,
        required : false,
        unique : true,
        sparse: true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : false,
        minlength : 6
    },
    Name: {
        type: String,
        required: false
    },
    firebaseUid: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    role: {
        type : String,
        required : true,
        default : "Admin",
    },
    permissions : [{
        type : String,
        enum : ["product_management", "order_management", "user_management", "analytics"]
    }],
    isActive : {
        type : Boolean,
        default : true
    }
}, {timestamps : true})

const Admin = mongoose.model("Admin", AdminSchema)
export default Admin