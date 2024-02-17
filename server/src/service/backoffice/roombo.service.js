const { roomsModel, waterModel, electricalModel } = require("../../models/dormitory/dormitory.model");

const GetRoomByID = async (id, res) => {
    try {
        const room = await roomsModel.findOne({ _id: id })
            .populate([ { path: "waterID" }, { path: "electricID" }, { path: "status" } ]);
        res.status(200).json({
            success: true,
            room
        })
    } catch (error) {
        console.log(error);
    }
}

const UpdateRoom = async (roomId, roomCharge, res) => {
    try {
        await roomsModel.findOneAndUpdate({ _id: roomId }, {
            roomCharge: roomCharge
        }, { new: true } )
        res.status(200).json({
            success: true,
            message: "Room charge updated successfully",
        })
    } catch (error) {
        console.log(error);
    }
}

const UpdateWaterMeter = async (roomId, dormitoryId, meterName, res) => {
    try {
        const water = await waterModel.findOne({ dormitoryId: dormitoryId, name: meterName });
        await roomsModel.findOneAndUpdate({ _id: roomId }, {
            waterID: water._id
        }, { new: true } )
        res.status(200).json({
            success: true,
            message: "Water meter updated successfully",
        })
    } catch (error) {
        console.log(error);
    }
}

const UpdateElectricMeter = async (roomId, dormitoryId, meterName, res) => {
    try {
        const electric = await electricalModel.findOne({ dormitoryId: dormitoryId, name: meterName });
        await roomsModel.findOneAndUpdate({ _id: roomId }, {
            electricID: electric._id
        }, { new: true } )
        res.status(200).json({
            success: true,
            message: "Electric meter updated successfully",
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { GetRoomByID, UpdateRoom, UpdateWaterMeter, UpdateElectricMeter } 