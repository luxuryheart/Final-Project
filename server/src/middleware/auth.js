const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncError = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = CatchAsyncError(async (req, res, next) => {
    const token = req.headers["authtoken"];
    if (!token) {
        return next(new ErrorHandler("Token not found", 400));
    }

    const decoded = jwt.verify(token, process.env.KEY);
    if (!decoded) {
        return next(new ErrorHandler("token is not valid", 400));
    }

    if (!decoded.user) {
        return next(new ErrorHandler("user not found", 400));
    }

    req.user = decoded.user;

    next();
});

const authorizeRoles = (role) => {
    return (req, res, next) => {
        if(!role.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}

// const authorizeRoles = CatchAsyncError(async(req, res, next) => {
//     try {
//         console.log(req.user.email);
//         let userAdmin = await User.findOne({ email: req.user.email })
//         .select('-password').exec();
//         let role = await Role.findOne({ _id: userAdmin.role_id})
    
//         const newData = {
//             userAdmin: {
//                 id: userAdmin._id,
//                 role: role.role,
//                 firstname: userAdmin.firstname,
//                 lastname: userAdmin.lastname,
//                 email: userAdmin.email
//             }
//         }
    
//         if (newData.userAdmin.role !== 'admin'){
//             res.status(403).send('ไม่มีสิทธิ์การเข้าถึง');
//         } else {
//             next();
//         }
//     } catch (error) {
//         return next(new ErrorHandler(error, 500));
//     }
// })

module.exports = { isAuthenticated, authorizeRoles };
