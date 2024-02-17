const mongoose = require('mongoose');

const waterUnitSchema = new mongoose.Schema({
    oldUnit: {
        type: Number,
        default: 0,
    },
    latedUnit: {
        type: Number,
        required: [true, "New unit is required"],
        default: 0,
    },
    totalUnit: {
        type: Number,
        // default: function() {
        //     return (this.oldUnit - this.latedUnit) < 0 ? 0 : (this.oldUnit - this.latedUnit);
        // },
        default: 0
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory",
    },
}, { timestamps: true } );

const waterUnitModel = mongoose.model('WaterUnit', waterUnitSchema)

const electricalUnitSchema = new mongoose.Schema({
    oldUnit: {
        type: Number,
        default: 0,
    },
    latedUnit: {
        type: Number,
        required: [true, "New unit is required"],
        default: 0,
    },
    totalUnit: {
        type: Number,
        // default: function() {
        //     return (this.oldUnit - this.latedUnit) < 0 ? 0 : (this.oldUnit - this.latedUnit);
        // },
        default: 0,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory",
    },
}, { timestamps: true } );

const electricalUnitModel = mongoose.model('ElectricalUnit', electricalUnitSchema)

module.exports = { waterUnitModel, electricalUnitModel }