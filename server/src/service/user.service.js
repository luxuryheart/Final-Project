const { userModel, roleModel } = require("../models/user.model")
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");

const register = async(data, res) => {
    const user = await userModel.create(data)

    const userResponse = await userModel.findById(user._id)
        .populate('role')
        .populate('status');

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

const getUserAll = (users, res) => {
    try {
        res.status(200).json({
            success: true,
            users,
        })
    } catch (error) {
        return next(new ErrorHandler(error,500))    
    }
}

const updateProfile = async (data, user, key, res) => {
    try {
      const roles = await roleModel.findOne({ name: data.role });
      if (!roles) {
        return next(new ErrorHandler("Role not found", 400));
      }
  
      const userProfile = await userModel.findOneAndUpdate(
        { _id: user._id },
        {
          "profile.firstname": data.firstname,
          "profile.lastname": data.lastname,
          "profile.gender": data.gender,
          role: roles._id,
        },
        { new: true }
      );
      if (!userProfile) {
        return next(new ErrorHandler("Update failed"));
      }
  
      const userDetail = await userModel
        .findOne({ _id: user._id })
        .populate("role");
  
      if (userDetail && userDetail.role) {
        const formattedUserDetail = {
            user: {
                ...userDetail.toObject(),
                role: userDetail.role.name,
            }
        };
        const userToken = jwt.sign(
          formattedUserDetail,
          key,
          { expiresIn: "30d" },
          (err, token) => {
            if (err) {
              // เพิ่มบรรทัดด้านล่างเพื่อแสดงข้อมูลข้อผิดพลาด
              console.error(err);
              return res.status(500).json({
                success: false,
                message: "Internal Server Error",
              });
            }
  
            res.status(200).json({
              success: true,
              message: "Profile updated",
              token,
              formattedUserDetail,
            });
          }
        );
      }
    } catch (error) {
      // เพิ่มบรรทัดด้านล่างเพื่อแสดงข้อมูลข้อผิดพลาด
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

const getUserDetail = async(user, res) => {
        const userDetail = await userModel
          .findOne({ _id: user._id })
          .populate("role")
          .populate("status")
          .populate("dormitory")
          .populate("room");
        if (!userDetail) {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        res.status(200).json({
          success: true,
          userDetail,
        });
}

module.exports = { register, login, getUserAll, updateProfile, getUserDetail }