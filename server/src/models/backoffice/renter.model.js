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
        // required: [true, "Email is required"],
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
        // required: [true, "Education or Office is required"],
        default: "",
    },
    department: {
        type: String,
        // required: [true, "Department is required"],
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
        // required: [true, "Telephone is required"],
        default: "",
    },
    relationships: {
        type: String,
        // required: [true, "Relations is required"],
        default: "",
    },
    tel: {
        type: String,
        // required: [true, "Telephone is required"],
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
                // required: [true, "carNumber is required"],
                default: "",
            },
            detail: {
                type: String,
                // required: [true, "Detail is required"],
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
    }
}, { timestamps: true });

const renterDetailModel = mongoose.model("RenterDetail", renterDetailSchema)
const vehicleModel = mongoose.model("Vehicle", vehicleSchema)

module.exports = { renterDetailModel, vehicleModel }