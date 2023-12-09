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
        required: [true, "Email is required"]
    },
    facebook: {
        type: String,
    },
    line_id: {
        type: String,
    },
    educational_or_office: {
        type: String,
        required: [true, "Education or Office is required"]
    },
    department: {
        type: String,
        required: [true, "Department is required"]
    },
    position: {
        type: String,
    },
    studentId_or_employeeId: {
        type: String,
    },
    urgent_tel: {
        type: String,
        required: [true, "Telephone is required"]
    },
    relationships: {
        type: String,
        required: [true, "Relations is required"],
    },
    tel: {
        type: String,
        required: [true, "Telephone is required"],
    },
    vehicle: [
        {
            vehicleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vehicle",
                default: null,
            },
            carNumber: {
                type: String,
                required: [true, "carNumber is required"],
            },
            detail: {
                type: String,
                required: [true, "Detail is required"]
            },
        }
    ],
    note: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

const renterDetailModel = mongoose.model("RenterDetail", renterDetailSchema)
const vehicleModel = mongoose.model("Vehicle", vehicleSchema)

module.exports = { renterDetailModel, vehicleModel }