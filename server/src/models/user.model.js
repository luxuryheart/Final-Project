const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'user',
    }
}, {timestamps: true});

const userStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'active',
    }
}, {timestamps: true});

const userSchema = new mongoose.Schema({
    profile : {
        firstname: {
            type: String,
            default: '',
        },
        lastname: {
            type: String,
            default: '',
        },
        gender: {
            type: String,
            // required: [true, 'gender is required'],
            default: ''
        },
        img: {
            type: String,
            default: '',
        }
    },
    username : {
        type: String,
        required: [true, "username is required"],   
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        min: 6,
    },
    personalId: {
        type: String,
        // required: [true, "personalId is required"],
        min: 13,
        max: 13,
        default: null,
    },
    tel: {
        type: String,
        // required: [true, "tel is required"],
        min: 10,
        max: 10,
    },
    isVerified : {
        type: Boolean,
        default: false,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: null,
    },
    status:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserStatus',
            default: null,
        }
    ,
    dormitory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dormitory',
        default: null,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null,
    },
    address: {
        address: {
            type: String,
        },
        province: {
            type: String,
            // required: [true, "Province is required"],
        },
        district: {
            type: String,
            // required: [true, "District is required"],
        },
        sub_district: {
            type: String,
            // required: [true, "Sub-District is required"],
        },
        zipcode: {
            type: String,
            // required: [true, "Zipcode is required"],
        },
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema)
const roleModel = mongoose.model('Role', roleSchema)
const userStatusModel = mongoose.model('UserStatus', userStatusSchema)

module.exports = { userModel , roleModel, userStatusModel };