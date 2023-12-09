const mongoose = require('mongoose');

const waterUnitSchema = new mongoose.Schema({
    oldUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    },
    latedUnit: {
        type: Number,
        required: [true, "New unit is required"],
        default: 0,
    },
    totalUnit: {
        type: Number,
        default: () => {oldUnit - latedUnit < 0 ? 0 : oldUnit - latedUnit}
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    }
}, { timestamps: true } );

const waterUnitModel = mongoose.model('WaterUnit', waterUnitSchema)

const electricalUnitSchema = new mongoose.Schema({
    oldUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    },
    latedUnit: {
        type: Number,
        required: [true, "New unit is required"],
        default: 0,
    },
    totalUnit: {
        type: Number,
        default: () => {oldUnit - latedUnit < 0 ? 0 : oldUnit - latedUnit}
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    }
}, { timestamps: true } );

const electricalUnitModel = mongoose.model('ElectricalUnit', electricalUnitSchema)

module.exports = { waterUnitModel, electricalUnitModel }