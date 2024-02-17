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
    sessionId: {
        type: String,
        required: [true, "Session id is required"],
        unique: true    
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    }
}, { timestamps: true });

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = { paymentModel }