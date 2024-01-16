const CatchAsyncError = require('../../middleware/catchAsyncErrors');
const { dormitoryModel, floorsModel, waterModel, electricalModel } = require('../../models/dormitory/dormitory.model');
const ErrorHandler = require('../../utils/ErrorHandler');
const dormitoryService = require('../../service/dormitory/dormitory.service');
const { userModel } = require('../../models/user.model');

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
        
        const value = [ "คิดตามหน่วยจริง", "เหมาจ่ายรายเดือน" ]
        await dormitoryService.createWaterPrice(value, dormitory);
        await dormitoryService.createElectricalPrice(value, dormitory);

        const floors = await dormitoryService.Addfloor(dormitory._id, data.amount, res);

        const room = await dormitoryService.Addrooms(floors, dormitory._id, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

// edit rooms
const EditRoomsAndFloors = CatchAsyncError(async (req, res, next) => {
    try {

        const { flag, dormitoryId, floorId, roomId } = req.body;

        if (flag === "" || flag === undefined || flag === null 
            || dormitoryId === undefined || dormitoryId === null || dormitoryId === "") {
            return next(new ErrorHandler("flag or dormitory is required", 400));
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
        // ลบชั้น
        if (flag === "3") {
            dormitoryService.DeleteFloor(dormitoryId, floorId, res)
        }

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

// price for rooms
const UpdatePriceForRoom = CatchAsyncError(async(req, res, next) => {
    try {

        const { roomIds, floorId, dormitoryId, price } = req.body
        if (roomIds === undefined || roomIds.length === 0 || floorId === null
            || floorId === undefined || floorId === null || floorId === ""
            || dormitoryId === undefined || dormitoryId === null || dormitoryId === "") {
                return next(new ErrorHandler("data is required", 400))
        }
        
        const floor = await floorsModel.findById({ _id: floorId });
        const dormitory = await dormitoryModel.findById({ _id: dormitoryId });

        dormitoryService.UpdatePriceForRoom(floor, roomIds, price, res)
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

// water and electrical price 
const UpdateWaterAndElectricPrice = CatchAsyncError(async(req, res, next) => {
    try {

        const { flag, dormitoryId, floorId, roomIds, waterId, electricalId } = req.body;

        if (flag === "" || flag === undefined || flag === null 
        || dormitoryId === undefined || dormitoryId === null || dormitoryId === "") {
            return next(new ErrorHandler("flag is required", 400));
        }

        const water = await waterModel.findOne({ dormitoryId: dormitoryId });
        const electrical = await electricalModel.findOne({ dormitoryId: dormitoryId });
        const floorById = await floorsModel.findById({ _id: floorId });
        const dormitoryById = await dormitoryModel.findById({ _id: dormitoryId });
        
        if (!water) {
            return next(new ErrorHandler("water price not found in dormitory"))
        }

        if (!electrical) {
            return next(new ErrorHandler("electrical price not found in dormitory"))
        }

        if (!floorById) {
            return next(new ErrorHandler("floor id not found in dormitory"))
        }

        if (!dormitoryById) {
            return next(new ErrorHandler("dormitory id not found"))
        }

        // update water
        if (flag === "0") {
            await dormitoryService.UpdateWaterPrice(floorById, roomIds, waterId, res);
        }

        if (flag === "1") {
            await dormitoryService.UpdateElectricalPrice(floorById, roomIds, electricalId, res);
        }

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetAllRooms = CatchAsyncError(async(req, res, next) => {
    try {
        const dormitoryId = req.params;

        const dormitory = await dormitoryModel.findOne({ _id: dormitoryId.id });

        if (!dormitory || dormitory.userID.toString() !== req.user.id) {
            return next(new ErrorHandler("User and Dormitory are not matching"));
        }

        dormitoryService.GetAllRooms(dormitory, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

module.exports = { DormitoryCreate, EditRoomsAndFloors, UpdatePriceForRoom, UpdateWaterAndElectricPrice, GetAllRooms }