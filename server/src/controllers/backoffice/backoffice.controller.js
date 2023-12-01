const CatchAsyncError = require("../../middleware/catchAsyncErrors")
const { contactModel } = require("../../models/backoffice/contact.model")
const ErrorHandler = require("../../utils/ErrorHandler")

const CreateContact = CatchAsyncError(async(req, res, next) => {
    try {
        
        const { userId } = req.body;

        

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
})

module.exports = { CreateContact }