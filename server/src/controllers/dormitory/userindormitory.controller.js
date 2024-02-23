const CatchAsyncError = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../utils/ErrorHandler');
const dormitoryUserService = require('../../service/dormitory/userindormitory.service')

const DormitoryConnectionRenter = CatchAsyncError(async (req, res, next) => {
    try {
        const { date } = req.query
        const userId = req.user._id

        const [year, month] = date.split("-")
        const newDate = {
            year: year,
            month: month
        }
        await dormitoryUserService.DormitoryConnectionRenter(userId, newDate, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const DormitorySearchByID = CatchAsyncError(async (req, res, next) => {
    try {
        const { numberId } = req.body
        await dormitoryUserService.DormitorySearchByID(numberId, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const DormitoryConnection = CatchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user._id
        const { dormitoryId } = req.body;
        await dormitoryUserService.DormitoryConnection(userId, dormitoryId, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const DormitoryConnectionUserByID = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        await dormitoryUserService.DormitoryConnectionUserByID(id, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const DormitoryConnectionUser = CatchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user._id
        // await dormitoryUserService.DormitoryConnectionUser("65cef9c2477c2eeafc96aff1", res)
        await dormitoryUserService.DormitoryConnectionUser(userId, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const DisconnectDormitory = CatchAsyncError(async (req, res, next) => {
    try {
        const userId = req.user._id
        const { dormitoryId } = req.body; 
        await dormitoryUserService.DisconnectDormitory(dormitoryId, userId, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

module.exports = { DormitoryConnectionRenter, DormitorySearchByID, DormitoryConnection, DormitoryConnectionUserByID, DormitoryConnectionUser, DisconnectDormitory }