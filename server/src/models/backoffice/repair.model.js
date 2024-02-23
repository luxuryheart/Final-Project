const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: [true, "Room name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    date: {
        type: String,
        default: Date.now()
    },
    meetDate: {
        type: String,
        default: Date.now()
    },
    status: {
        type: String,
        default: "pending",
    },
}, { timestamps: true });

const repairModel = mongoose.model('Repair', repairSchema);
module.exports = { repairModel }