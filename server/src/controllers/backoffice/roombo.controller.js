const CatchAsyncError = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const roomboService = require("../../service/backoffice/roombo.service");

const GetRoomByID = CatchAsyncError(async (req, res, next) => { 
    try {
        const { id } = req.params;
        await roomboService.GetRoomByID(id, res);
    } catch (error) {
        console.log(error);
    }
})

const UpdateRoom = CatchAsyncError(async (req, res, next) => {
    try {
        const { roomId, roomCharge } = req.body;
        await roomboService.UpdateRoom(roomId, roomCharge, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const UpdateWaterMeter = CatchAsyncError(async (req, res, next) => {
    try {
        const { roomId, dormitoryId, meterName } = req.body;
        await roomboService.UpdateWaterMeter(roomId, dormitoryId, meterName, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const UpdateElectricMeter = CatchAsyncError(async (req, res, next) => {
    try {
        const { roomId, dormitoryId, meterName } = req.body;
        await roomboService.UpdateElectricMeter(roomId, dormitoryId, meterName, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

module.exports = { GetRoomByID, UpdateRoom, UpdateWaterMeter, UpdateElectricMeter }