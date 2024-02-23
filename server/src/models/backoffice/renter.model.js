const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "vehicle name is required"]
    },
}, { timestamps: true });

const renterDetailSchema = new mongoose.Schema({
    email: {
        type: String,
        default: "",
    },
    facebook: {
        type: String,
        default: "",
    },
    line_id: {
        type: String,
        default: "",
    },
    educational_or_office: {
        type: String,
        default: "",
    },
    department: {
        type: String,
        default: "",
    },
    position: {
        type: String,
        default: "",
    },
    studentId_or_employeeId: {
        type: String,
        default: "",
    },
    urgent_tel: {
        type: String,
        default: "",
    },
    relationships: {
        type: String,
        default: "",
    },
    tel: {
        type: String,
        default: "",
    },
    vehicle: [
        {
            type: {
                type: String,
                default: "",
            },
            carId: {
                type: String,
                default: "",
            },
            detail: {
                type: String,
                default: '',
            },
        }
    ],
    note: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // TODO: เพิ่ม id ห้องที่เป็นคนเช่า
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory"
    }
}, { timestamps: true });

const renterDetailModel = mongoose.model("RenterDetail", renterDetailSchema)
const vehicleModel = mongoose.model("Vehicle", vehicleSchema)

module.exports = { renterDetailModel, vehicleModel }