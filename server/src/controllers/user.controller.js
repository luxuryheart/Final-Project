const { userModel, roleModel, userStatusModel } = require("../models/user.model");
const CatchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userService = require('../service/user.service');

// register
const Register = CatchAsyncError(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (username === undefined || username === null || username === "" || 
            password === undefined || password === null || password === "") {
            return next(new ErrorHandler("Username or password is required"));
        }
      
        const emailExist = await userModel.findOne({ email: email });
        if (emailExist) {
          return next(new ErrorHandler(`Email ${email} already exists`, 400));
        }

        const role = await roleModel.findOne({ name: "user" });
        const status = await userStatusModel.findOne({ status: "active" });

        if (!role || !status) {
            return next(new ErrorHandler('Role or status not found', 500));
        }

        newPassword = await hashFunction(password);

        const data = {
            username,
            email,
            password: newPassword,
            role: role._id,
            status: status._id,
            tel: "",
            personalId: "",

        }

        userService.register(data, res);
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

const hashFunction = (password) => {
    hashPassword = bcrypt.hash(password, 10);
    return hashPassword;
}

// Login 
const Login = CatchAsyncError(async(req, res, next) => {
    try {
        const { userlogin, password } = req.body;

        if (userlogin === undefined || userlogin === null || userlogin === "" || 
            password === undefined || password === null || password === "") {
            return next(new ErrorHandler("Username or password is required"));
        }

        let user = await userModel.findOneAndUpdate({ username: userlogin}, { new: true })
        if (!user) {
            user = await userModel.findOne({ email: userlogin }, { new: true })
            if (!user) return next(new ErrorHandler("username or email not found"));
        }
        
        const role = await roleModel.findOne({ _id: user.role})
        const comparePassword = bcrypt.compare(user.password, password)

        if (!comparePassword) {
            res.status(401).json({
                message: "Password is incorrect"
            })
        }

        let payload = {
            user: {
                _id: user.id,
                profile: user.profile,
                email: user.email,
                tel: user.tel,
                role: role.name,
                dormitory: user.dormitory,
            }
        }

        userService.login(payload, process.env.KEY, res)

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

const getAllUser = CatchAsyncError(async(req, res, next) => {
    try {
        const user = await userModel.find()
            .populate('role')
            .populate('status');

        if (user) {
            await userService.getUserAll(user, res)
        }

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

const updateProfileUser = CatchAsyncError(async(req, res, next) => {
    try {
        const data = { firstname, lastname, gender, img, role, tel, personalId, address } = req.body;
        
        if (data.firstname === undefined || data.firstname === null || data.firstname === ""
            || data.lastname === undefined || data.lastname === null || data.lastname === ""
            || data.gender === undefined || data.gender === null || data.gender === ""
            || data.role === undefined || data.role === null || data.role === "") {
            return next(new ErrorHandler("Data is required", 400))
        }
        const updateProfile = await userModel.findOne({ _id: req.user._id });
        if (!updateProfile) {
            return next(new ErrorHandler("User not found", 400));
        }
        
        userService.updateProfile(data, updateProfile, process.env.KEY, res)

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
});

const getUserDetail = CatchAsyncError(async(req, res, next) => {
    try {
        await userService.getUserDetail(req.user, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
})

const GetInvoicedByID = CatchAsyncError(async(req, res, next) => {
    try {
        const { id } = req.params;
        await userService.GetInvoicedByID(id, res);
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }
})

const GetUser = CatchAsyncError(async(req, res, next) => {
    try {
        const userId = req.user._id;
        await userService.GetUser(userId, res);
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }
})

const UpdateUser = CatchAsyncError(async(req, res, next) => {
    try {
        const data = req.body;
        await userService.UpdateUser(data, req.user._id, res);
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }
})

module.exports = { Register, UpdateUser,  Login, getAllUser, updateProfileUser, getUserDetail, GetInvoicedByID, GetUser };
