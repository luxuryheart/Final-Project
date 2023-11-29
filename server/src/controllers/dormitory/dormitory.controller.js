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

        const dormitory = await dormitoryService.dormitoryCreate(data, req.user, res);

        const floors = await dormitoryService.addfloor(dormitory._id, data.amount, res);

        await dormitoryService.addrooms(floors, res);

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

module.exports = { DormitoryCreate }