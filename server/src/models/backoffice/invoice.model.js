const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const invoiceSchema = new mongoose.Schema({
    no: {
        type: String,
        required: [true, "Number order is required"],
        default: () => `APR-${generateNumericUUID()}`, 
        // default: () => `APR-${crypto.randomInt(999999)}`, 
        // default: () => `APR-${uuidv4().split('-').pop()}`, 
        unique: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    renterDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RenterDetail"
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now()
    },
    description: {
        roomDesc: {
            name: {
                type: String,
                required: [true, "Description is required"],
                default: "ค่าเช้าห้อง"
            },
            roomPrice: {
                type: Number,
                required: [true, "Room price is required"],
                default: 0,
            },
        },
        waterDesc: {
            name: {
                type: String,
                required: [true, "Description is required"],
                default: "ค่าน้ำ"
            },
            waterPrice: {
                type: Number,
                required: [true, "Water price is required"],
                default: 0,
            },
        },
        electricalDesc: {
            name: {
                type: String,
                required: [true, "Description is required"],
                default: "ค่าไฟ"
            },
            electricalPrice: {
                type: Number,
                required: [true, "Electrical price is required"],
                default: 0,
            },
        },
        otherService: [
            {
                name: {
                    type: String,
                    // required: [true, "Name is required"]
                },
                price: {
                    type: Number,
                    // required: [true, "Price is required"],
                },
            }
        ]

    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: [true, "grand total price is required"],
        default: 0,
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory"
    }

}, { timestamps: true });

const paymentStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid",
    },
    date: {
        type: Date,
        default: Date.now
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    renterDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RenterDetail"
    },
}, { timestamps: true });

const invoicedSchema = new mongoose.Schema({
    no: {
        type: String,
        required: [true, "Number order is required"],
        default: () => `APR-${generateNumericUUID()}`, 
        unique: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    renterDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RenterDetail"
    },
    // date: {
    //     type: Date,
    //     required: [true, "Date is required"],
    //     default: Date.now()
    // },
    date: {
        day: {
          type: Number,
          required: [true, "Day is required"],
        },
        month: {
          type: Number,
          required: [true, "Month is required"],
        },
        year: {
          type: Number,
          required: [true, "Year is required"],
        },
        date: {
          type: Date,
          required: [true, "Date is required"],
          default: Date.now,
        },
      },
    lists: [
        {
            description: {
                type: String,
                required: [true, "Description is required"],
            },
            // meterNew - meterOld
            meter: {
                type: String,
            },
            amount: {
                type: Number,
                required: [true, "Amount is required"],
            },
            unit: {
                type: String,
                required: [true, "Unit is required"],
            },
            price: {
                type: Number,
                required: [true, "Price is required"],
            },
            total: {
                type: Number,
                required: [true, "Total is required"],
            }
        }
    ],
    total: {
        type: Number,
        required: [true, "Total price is required"],
        default: 0,
    },
    discount: {
        type: Number,
        required: [true, "Discount is required"],
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: [true, "grand total price is required"],
        default: 0,
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory"
    },
    invoiceStatus: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid",
    },
    note: {
        type: String,
        default: null,
    }
}, { timestamps: true });

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    }
}, { timestamps: true });

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
const paymentStatusModel = mongoose.model("PaymentStatus", paymentStatusSchema);
const invoicedModel = mongoose.model("Invoiced", invoicedSchema);
const unitModel = mongoose.model("Unit", unitSchema);

function generateNumericUUID() {
    return Array.from({ length: 1 }, () => uuidv4().replace(/\D/g, '')).join('');
  }  

module.exports = { invoiceModel, paymentStatusModel, invoicedModel, unitModel }