const mongoose = require('mongoose');

const userInDormitorySchema = new mongoose.Schema({
    userId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory"
    }
}, { timestamps: true });

const userInDormitoryModel = mongoose.model("UserInDormitory", userInDormitorySchema);

module.exports = { userInDormitoryModel };

