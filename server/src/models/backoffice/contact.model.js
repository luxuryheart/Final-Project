const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    meterStart: {
        type: Number,
        required: [true, "Start Date is required"],
    },
    meterEmd: {
        type: Number,
        required: [true, "End Date is required"],
    },
    note: {
        type: String,
        max: 255,
    }
}, { timestamps: true });

const contactModel = mongoose.model("Contact", contactSchema)

module.exports = { contactModel }