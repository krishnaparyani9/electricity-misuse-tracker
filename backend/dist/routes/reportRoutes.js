"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const reportController_1 = require("../controllers/reportController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/report', upload.single('image'), reportController_1.createReport);
router.get('/reports', reportController_1.getReports);
router.get('/leaderboard', reportController_1.getLeaderboard);
exports.default = router;
