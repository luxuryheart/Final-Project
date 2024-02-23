const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        unique: true
    },
    bookingDate: {
        type: Date,
        default: Date.now()
    },
    bookingStartDate: {
        type: Date,
        default: Date.now()
    },
    bookingAmount: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        default: "Guest"
    },
    tel: {
        type: String,
        default: ""
    },
    note:{
        type: String,
        default: ""
    }
}, { timestamps: true });

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = { bookingModel }