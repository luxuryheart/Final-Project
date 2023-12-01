const mongoose = require('mongoose');

const floorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "floor is required"]
    },
    rooms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Room",
        default: null,
    },
}, { timestamps: true });

const roomsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "room is required"],
    },
    roomCharge: {
        type: Number,
        default: 0.00,
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    waterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Water",
        default: null,
    },
    electricID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Electric",
        default: null,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        default: null,
    }
}, { timestamps: true });

const dormitorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Dormitory name is required"],
    },
    address: {
        address: {
            type: String,
        },
        province: {
            type: String,
            required: [true, "Province is required"],
        },
        district: {
            type: String,
            required: [true, "District is required"],
        },
        sub_district: {
            type: String,
            required: [true, "Sub-District is required"],
        },
        zipcode: {
            type: String,
            required: [true, "Zipcode is required"],
        },
    },
    contact: {
        tel: {
            type: [String],
            min: 10,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        }
    },
    floors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Floor',
        default: null,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required on dormitory"]
    }
}, { timestamps:true });

const dormitoryModel = mongoose.model("Dormitory", dormitorySchema);
const floorsModel = mongoose.model("Floor", floorsSchema);
const roomsModel = mongoose.model("Room", roomsSchema);

module.exports = { dormitoryModel, floorsModel, roomsModel }