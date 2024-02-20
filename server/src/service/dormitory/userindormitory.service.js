const { invoicedModel } = require("../../models/backoffice/invoice.model");
const { renterDetailModel } = require("../../models/backoffice/renter.model");
const { dormitoryModel } = require("../../models/dormitory/dormitory.model");
const { userInDormitoryModel } = require("../../models/dormitory/userindormitory.model");
const { userModel } = require("../../models/user.model");

const DormitoryConnectionRenter = async (userId, newdate, res) => {
    try {
        const renter = await renterDetailModel.find({ userId: userId })
            .populate({
                path: "roomId",
                populate: [
                    { path: "waterID" },
                    { path: "electricID" },
                    { path: "status" },
                ],
            })
            .populate({
                path: "dormitoryId",
            });
        const renterArray = [];
        for (const renterDetail of renter) {
            const invoice = await invoicedModel.findOne({ renterDetailId: renterDetail._id, "date.year": newdate.year, "date.month": newdate.month });
            renterArray.push({ renter: renterDetail, invoice: invoice || null });
        }
        
        if (!renterArray.length) {
            return res.status(404).json({
                success: false,
                message: "Renter not found",
                renterArray: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Renter detail",
            renterArray,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


const DormitorySearchByID = async (numberId, res) => {
    try {
        const dormitory = await dormitoryModel.findOne({ numberId: numberId })
            // .populate({
            //     path: "roomId",
            //     populate: [
            //         { path: "waterID" },
            //         { path: "electricID" },
            //         { path: "status" },
            //     ],
            // })

        if (!dormitory) {
            return res.status(404).json({
                success: false,
                message: "Renter not found",
                dormitory: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Renter detail",
            dormitory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const DormitoryConnection = async (userId, dormitoryId, res) => {
    try {
        const dormitoryConnect = await userInDormitoryModel.findOne({ dormitoryId: dormitoryId })
        if (!dormitoryConnect) {
            const newDormitoryConnect = await userInDormitoryModel.create({
                userId: [userId],
                dormitoryId: dormitoryId
            })
            return res.status(200).json({
                success: true,
                message: "Dormitory connection successfully",
                newDormitoryConnect
            });
        }
        // เช็คว่ามี user เชื่อมต่ออยู่ก่อนแล้วมั้ย
        if (dormitoryConnect.userId.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User already connected to this dormitory",
            });
        }
        const newDormitoryConnect = await userInDormitoryModel.findOneAndUpdate({ dormitoryId: dormitoryId } ,{
            userId: [userId, ...dormitoryConnect.userId],
            dormitoryId: dormitoryId
        })
        return res.status(200).json({
            success: true,
            message: "Dormitory connection successfully",
            newDormitoryConnect
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const DormitoryConnectionUserByID = async (dormitoryId, res) => {
    try {
        const userInDormitory = await userInDormitoryModel.findOne({ dormitoryId: dormitoryId });

        if (!userInDormitory) {
            return res.status(404).json({
                success: false,
                message: "User in dormitory not found",
                dormitory: null,
            });
        }

        const populatedUsers = await Promise.all(userInDormitory.userId.map(async (userId) => {
            return await userModel.findOne({_id: userId })
        }));

        if (!populatedUsers) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                users: null,
            });
        }
        console.log(populatedUsers);
        return res.status(200).json({
            success: true,
            message: "User in dormitory details",
            users: populatedUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


module.exports = {
    DormitoryConnectionRenter,
    DormitorySearchByID, 
    DormitoryConnection,
    DormitoryConnectionUserByID
}