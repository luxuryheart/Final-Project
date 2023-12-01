const { userModel, roleModel } = require("../models/user.model")
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");

const register = async(data, res) => {
    const user = await (await userModel.create(data))

    const userResponse = await userModel.findById(user._id)
        .populate('role')
        .populate('status');

    console.log(userResponse);

    return res.status(201).json({
        success: true,
        userResponse,
    })
}

const login = (payload, key, res) => {
    jwt.sign(payload, key, { expiresIn: '30d' }, (err, token) => {
        if (err) throw next(new ErrorHandler(err, 400));
        res.status(200).json({
            success: true,
            token
        })
    })
}

const getUserAll = (user, res) => {
    try {
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error,500))    
    }
}

const updateProfile = async(data, user, res) => {
    try {

        const roles = await roleModel.findOne({ name: data.role });
        if (!roles) {
            return next(new ErrorHandler("Role not found", 400));
        }

        const userProfile = await userModel.findByIdAndUpdate({ _id: user._id }, {
            "profile.firstname": data.firstname,
            "profile.lastname": data.lastname,
            "profile.gender": data.gender,
            role: roles._id
        }, { new: true });

        if (!userProfile) { 
            return next(new ErrorHandler("Update failed"))
        }

        res.status(201).json({
            success: true,
            message: "Profile updated",
            userProfile,
        })

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

module.exports = { register, login, getUserAll, updateProfile }