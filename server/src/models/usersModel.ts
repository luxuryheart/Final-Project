import mongoose, { Document, Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    profile: {
        firstname: string;
        lastname: string;
        avatar: string;
    },
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    roomId: string;
}

// const usersSchema = new mongoose.Schema({
//     profile: {
//         firstname: { type: String, required: true },
//         lastname: { type: String, required: true },
//         img: { type: String, required: true },
//     },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// });