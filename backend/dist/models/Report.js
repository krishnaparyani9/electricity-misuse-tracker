"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    reportId: { type: Number, required: true, unique: true },
    applianceId: { type: Number, required: true },
    applianceName: { type: String, required: true, trim: true },
    responsibleUserId: { type: Number, required: true },
    responsibleUserName: { type: String, required: true, trim: true },
    reporterUserId: { type: Number, required: true },
    reporterUserName: { type: String, required: true, trim: true },
    fine: { type: Number, required: true },
    notes: { type: String, default: '', trim: true },
    evidenceImage: { type: String, default: null },
}, { timestamps: true });
const ReportModel = (0, mongoose_1.model)('Report', reportSchema);
exports.default = ReportModel;
