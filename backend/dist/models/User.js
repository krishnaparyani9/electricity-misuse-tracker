"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
