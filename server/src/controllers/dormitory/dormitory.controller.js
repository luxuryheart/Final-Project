const CatchAsyncError = require('../../middleware/catchAsyncErrors');
const { dormitoryModel, floorsModel, waterModel, electricalModel, bankModel } = require('../../models/dormitory/dormitory.model');
const ErrorHandler = require('../../utils/ErrorHandler');
const dormitoryService = require('../../service/dormitory/dormitory.service');

const DormitoryCreate = CatchAsyncError(async (req, res, next) => {
    try {
        const data = { 
            name: req.body.name, 
            address: req.body.address, 
            contact: req.body.contact,
            amount: req.body.amount, 
            promptpay: req.body.promptpay,
            rooms: req.body.rooms
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
        await dormitoryService.CreateFloorsAndRooms(dormitory._id, data.rooms, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

const EditRoomsAndFloors = CatchAsyncError(async (req, res, next) => {
    try {

        const { flag, dormitoryId, floorId, roomId } = req.body;

        if (flag === "" || flag === undefined || flag === null 
            || dormitoryId === undefined || dormitoryId === null || dormitoryId === "") {
            return next(new ErrorHandler("flag or dormitory is required", 400));
        }

        // เพิ่มชั้น
        if (flag === "0") {
            dormitoryService.InCreaseFloors(dormitoryId, res)
        }
        // เพ่ิมห้องในชั้นนั้นๆ
        if (flag === "1") {
            dormitoryService.IncreaseRoom(floorId, res)
        }
        // ลบห้องในชั้นนั้นๆ
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

        if (!dormitory || dormitory.userID.toString() !== req.user._id) {
            return next(new ErrorHandler("User and Dormitory are not matching"));
        }

        dormitoryService.GetAllRooms(dormitory, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

const GetMeterByDormitoryId = CatchAsyncError(async(req, res, next) => {
    try {
        const dormitoryId = req.params; 
        
        await dormitoryService.GroupMeters(dormitoryId, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetBankByDormitoryId = CatchAsyncError(async(req, res, next) => {
    try {
        const dormitoryId = req.params; 
        const bank = await bankModel.find({ dormitoryId: dormitoryId.id });

        if (!bank) {
            res.status(400).json({
                success: false,
                message: "Bank not found in this dormitory",
                bank
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Get bank information successfully",
            bank
        })
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const BankAccount = CatchAsyncError(async(req, res, next) => {
    try {
        const { dormitoryId, name, account, bank, img, flag, bankId } = req.body;
        if (flag === "0") {
            await dormitoryService.CreateBankAccount(dormitoryId, name, account, bank, img, res);
        } else if (flag === "1") {
            await dormitoryService.DeleteBankAccount(dormitoryId, bankId, res);
        }
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const UpdateMeter = CatchAsyncError(async(req, res, next) => {
    try {
        const { flag, id, price } = req.body;
        if (flag === "1") {
            await dormitoryService.UpdateElectrical(id, price, res);
        } else if (flag === "2") { 
            await dormitoryService.UpdateWater(id, price, res);
        }
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetDormitoryByUser = CatchAsyncError(async(req, res, next) => {
    try {
        const id = req.params;

        await dormitoryService.GetDormitoryByUser(id.id, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetBankByDormitoryIdForUser = CatchAsyncError(async(req, res, next) => {
    try {
        const dormitoryId = req.params; 
        const bank = await bankModel.find({ dormitoryId: dormitoryId.id });

        if (!bank) {
            res.status(400).json({
                success: false,
                message: "Bank not found in this dormitory",
                bank
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Get bank information successfully",
            bank
        })
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetDormitoryByID = CatchAsyncError(async(req, res, next) => {
    try {
        const id = req.params;
        await dormitoryService.GetDormitoryByID(id.id, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const Booking = CatchAsyncError(async(req, res, next) => {
    try {
        const data = req.body;
        const userId = req.user._id;
        await dormitoryService.Booking(userId, data, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const GetDormitory = CatchAsyncError(async(req, res, next) => {
    try {
        await dormitoryService.GetDormitory(res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const Repair = CatchAsyncError(async(req, res, next) => {
    try {
        const data = req.body;
        await dormitoryService.Repair(data, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

module.exports = { Repair, GetDormitory, DormitoryCreate, EditRoomsAndFloors, UpdatePriceForRoom, UpdateWaterAndElectricPrice, GetAllRooms, GetMeterByDormitoryId, GetBankByDormitoryId, UpdateMeter, BankAccount, GetDormitoryByUser, GetBankByDormitoryIdForUser, GetDormitoryByID, Booking }