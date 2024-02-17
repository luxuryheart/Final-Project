const mongoose = require("mongoose");

// Water
const meterUnitSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    meterType: {
      type: String,
      enum: ["water", "electrical"],
      required: true,
    },
    initialReading: {
      type: Number,
      required: true,
      default: 0,
    },
    finalReading: {
      type: Number,
      required: true,
      default: 0,
    },
    consumption: {
      type: Number,
      required: true,
      default: 0,
    },
    invoiceStatus: {
      type: Boolean,
      default: false,
    }
    // waterId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Water",
    // },
    // electricalId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Electrical",
    // }
  },
  { timestamps: true }
);

const meterPerMonthSchema = new mongoose.Schema(
  {
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
    meterUnitId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "MeterUnit",
    },
    status: {
      type: Boolean,
      default: false,
    },
    // floorId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Floor",
    // },
    dormitoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dormitory",
    },
  },
  { timestamps: true }
);

// electric
const electricalMeterUnitSchema = new mongoose.Schema(
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      meterType: {
        type: String,
        enum: ["water", "electrical"],
        required: true,
      },
      initialReading: {
        type: Number,
        required: true,
        default: 0,
      },
      finalReading: {
        type: Number,
        required: true,
        default: 0,
      },
      consumption: {
        type: Number,
        required: true,
        default: 0,
      },
      invoiceStatus: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );
  
  const electricalMeterPerMonthSchema = new mongoose.Schema(
    {
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
      electricalMeterUnitId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ElectricalMeterUnit",
      },
      status: {
        type: Boolean,
        default: false,
      },
      dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory",
      },
    },
    { timestamps: true }
  );

const meterUnitModel = mongoose.model("MeterUnit", meterUnitSchema);
const meterPerMonthModel = mongoose.model("MeterPerMonth", meterPerMonthSchema);

const electricalMeterUnitModel = mongoose.model("ElectricalMeterUnit", electricalMeterUnitSchema);
const electricalMeterPerMonthModel = mongoose.model("ElectricalMeterPerMonth", electricalMeterPerMonthSchema);

module.exports = { meterUnitModel, meterPerMonthModel, electricalMeterUnitModel, electricalMeterPerMonthModel };
