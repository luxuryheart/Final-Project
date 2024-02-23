const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    }, 
    orderId: {
        type: String,
        required: [true, "Order id is required"],
        unique: true
    },
    status: {
        type: String,
        default: "unpaid",
    }, 
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    paymentType: {
        type: String,
        required: [true, "Payment type is required"],
        enum: ["promptpay", "card", "cash", "bank transfer"],
    },
    note: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        required: [true, "Date is required"],
        default: new Date()
    },
    img: {
        type: String,
        default: null
    }
}, { timestamps: true });

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = { paymentModel }