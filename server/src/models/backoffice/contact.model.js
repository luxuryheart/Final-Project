const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    personalId: {
        type: String,
        required: [true, "Personal ID is required"],
    },
    tel: {
        type: String,
        required: [true, "Telephone is required"],
    },
    rangeContact: {
        type: String,
        required: [true, "Range Contact is required"],
    },
    contactStartDate: {
        type: Date,
        required: [true, "Start Date is required"],
    },
    contactEndDate: {
        type: String,
        required: [true, "End Date is required"],
    },
    deposit: {
        type: Number,
        required: [true, "Deposit is required"],
    },
    minusDeposit: {
        type: Number,
        default: 0,
    },
    depositCheck: {
        type: Boolean,
        default: false,
    },
    waterMeter: {
        type: Number,
        required: [true, "water meter is required"],
    },
    electricalMeter: {
        type: Number,
        required: [true, "electrical meter is required"],
    },
    note: {
        type: String,
        max: 255,
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory",
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }
}, { timestamps: true });

const contactModel = mongoose.model("Contact", contactSchema)

module.exports = { contactModel }