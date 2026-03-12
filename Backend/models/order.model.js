import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    OrderId : {
        type : String,
        required : true,
        unique : true
    },
    Items : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        total : {
            type : Number,
            required : true
        }
    }],
    TotalAmount : {
        type : Number,
        required : true
    },
    PaymentStatus : {
        type : String,
        enum : ['Pending', 'Completed', 'Failed', 'Refunded'],
        default : 'Pending'
    },
    PaymentId : {
        type : String
    },
    PaymentMethod : {
        type : String,
        enum : ['COD', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'WhatsApp'],
        required : true
    },
    PaymentDate : {
        type : Date
    },
    ShippingAddress : {
        street : String,
        city : String,
        state : String,
        pincode : String,
        country : String
    },
    OrderStatus : {
        type : String,
        enum : ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default : 'Processing'
    },
    ShippingDate : {
        type : Date
    },
    DeliveryDate : {
        type : Date
    }
    
}, {timestamps:true})

const Order = mongoose.model("Order", OrderSchema)
export default Order