import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Name : {
        type: String,
        required : true,
        trim : true
    },
    Email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    firebaseUid : {
        type : String,
        unique : true,
        sparse : true 
    },
    Password : {
        type : String,
        required : function() { return !this.firebaseUid; }, 
        minlength : 6
    },
    Phone : {
        type : String,
        default : ''
    },
    Address : {
        street : String,
        city : String,
        state : String,
        pincode : String,
        country : { type: String, default: "India" }
    },
    Orders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Order"
    }],
    Cart : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cart"
    }],
    Wishlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    }],
    isActive : {
        type : Boolean,
        default : true
    }

}, {timestamps : true})

const User = mongoose.model("User", UserSchema)
export default User