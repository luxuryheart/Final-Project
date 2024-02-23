const { userModel, roleModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { invoicedModel } = require("../models/backoffice/invoice.model");

const register = async (data, res) => {
  const user = await userModel.create(data);

  const userResponse = await userModel
    .findById(user._id)
    .populate("role")
    .populate("status");

  return res.status(201).json({
    success: true,
    userResponse,
  });
};

const login = (payload, key, res) => {
  jwt.sign(payload, key, { expiresIn: "30d" }, (err, token) => {
    if (err) throw next(new ErrorHandler(err, 400));
    res.status(200).json({
      success: true,
      token,
    });
  });
};

const getUserAll = (users, res) => {
  try {
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

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
        "profile.img": data.img,
        personalId: data.personalId,
        address: data.address,
        tel: data.tel,
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
        },
      };
      const userToken = jwt.sign(
        formattedUserDetail,
        key,
        { expiresIn: "30d" },
        (err, token) => {
          if (err) {
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserDetail = async (user, res) => {
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
};

const GetInvoicedByID = async (invoicedId, res) => {
  try {
    const invoice = await invoicedModel
      .findOne({ _id: invoicedId })
      .populate({
        path: "dormitoryId",
        populate: {
          path: "floors",
          populate: { path: "rooms" },
        },
      })
      .populate({
        path: "roomId",
        populate: [
          { path: "waterID" },
          { path: "electricID" },
          { path: "status" },
        ],
      })
      .populate({
        path: "renterDetailId",
        populate: { path: "userId" },
      });
    return res.status(200).json({
      success: true,
      message: "Get invoice list success",
      invoice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const GetUser = async (userId, res) => {
  try {
    const user = await userModel
      .findOne({ _id: userId })
      .populate("role")
      .populate("status")
      .populate("dormitory")
      .populate("room");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const UpdateUser = async (data, userId, res) => {
  try {
    const userUpdate = await userModel.findOneAndUpdate(
      { _id: userId },
      {
        "profile.firstname": data.firstname,
        "profile.lastname": data.lastname,
        "profile.img": data.img,
        address: data.address,
        tel: data.tel,
      },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      userUpdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  UpdateUser,
  register,
  login,
  getUserAll,
  updateProfile,
  getUserDetail,
  GetInvoicedByID,
  GetUser,
};
