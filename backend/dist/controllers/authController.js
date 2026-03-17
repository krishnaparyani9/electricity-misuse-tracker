"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const store_1 = require("../data/store");
const toPublicUser = (row) => ({
    id: row.userId,
    username: row.username,
    name: row.name,
    avatar: row.avatar,
});
const fetchAllUsers = async () => {
    const users = await User_1.default.find({}, { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 }).sort({ userId: 1 }).lean();
    return users.map(toPublicUser);
};
const signup = async (req, res) => {
    const { username, name } = req.body;
    if (!username?.trim() || !name?.trim()) {
        return res.status(400).json({ message: 'Name and username are required.' });
    }
    try {
        const normalizedUsername = username.trim().toLowerCase();
        const trimmedName = name.trim();
        const avatar = trimmedName.charAt(0).toUpperCase() || 'U';
        const existingUser = await User_1.default.findOne({ username: normalizedUsername }).lean();
        if (existingUser) {
            return res.status(409).json({ message: 'That username is already taken.' });
        }
        const lastUser = await User_1.default.findOne({}, { userId: 1 }).sort({ userId: -1 }).lean();
        const nextUserId = (lastUser?.userId ?? 0) + 1;
        const user = await User_1.default.create({
            userId: nextUserId,
            username: normalizedUsername,
            name: trimmedName,
            avatar,
            password: '',
        });
        return res.status(201).json({
            user: toPublicUser(user),
            availableUsers: await fetchAllUsers(),
            appliances: store_1.store.getAppliances(),
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error during signup.' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { username } = req.body;
    if (!username?.trim()) {
        return res.status(400).json({ message: 'Username is required.' });
    }
    try {
        const user = await User_1.default.findOne({ username: username.trim().toLowerCase() }).lean();
        if (!user) {
            return res.status(401).json({ message: 'Invalid username.' });
        }
        return res.json({
            user: toPublicUser(user),
            availableUsers: await fetchAllUsers(),
            appliances: store_1.store.getAppliances(),
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error during login.' });
    }
};
exports.login = login;
