const CatchAsyncError = require('../../middleware/catchAsyncErrors');
const { dormitoryModel } = require('../../models/dormitory/dormitory.model');
const ErrorHandler = require('../../utils/ErrorHandler');
const dormitoryService = require('../../service/dormitory/dormitory.service')

// dormitory create
const DormitoryCreate = CatchAsyncError(async (req, res, next) => {
    try {
        const data = { 
            name: req.body.name, 
            address: req.body.address, 
            contact: req.body.contact,
            amount: req.body.amount, 
        };

        if (data.name === undefined || data.name === null || data.name === ""
            || data.address === undefined || data.address === null || data.address ===""
            || data.contact === undefined || data.contact === null || data.contact === ""
            || data.amount === undefined || data.amount === null || data.amount === ""){
            return next(new ErrorHandler("name or address or contact is required", 400));
        }

        const dormitory = await dormitoryService.DormitoryCreate(data, req.user, res);

        const floors = await dormitoryService.Addfloor(dormitory._id, data.amount, res);

        await dormitoryService.Addrooms(floors, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

const EditRoomsAndFloors = CatchAsyncError(async (req, res, next) => {
    try {

        const { flag, dormitoryId, floorId, roomId } = req.body;

        if (flag === "" || flag === undefined || flag === null 
            || dormitoryId === undefined || dormitoryId === null || dormitoryId === "") {
            return next(new ErrorHandler("flag is required", 400));
        }

        // Add floor
        if (flag === "0") {
            dormitoryService.InCreaseFloors(dormitoryId, res)
        }
        // Add rooms on floor
        if (flag === "1") {
            dormitoryService.IncreaseRoom(floorId, res)
        }
        // Delete rooms on floor
        if (flag === "2") {
            dormitoryService.DeleteRoom(floorId, roomId, res)
        }
        if (flag === "3") {
            dormitoryService.DeleteFloor(dormitoryId, floorId, res)
        }

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

module.exports = { DormitoryCreate, EditRoomsAndFloors }