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
            default: '/img',
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
    isVerified : {
        type: Boolean,
        default: false,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: null,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserStatus',
        default: null,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null,
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema)
const roleModel = mongoose.model('Role', roleSchema)
const userStatusModel = mongoose.model('UserStatus', userStatusSchema)

module.exports = { userModel , roleModel, userStatusModel };