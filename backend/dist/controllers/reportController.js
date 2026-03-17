"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.getLeaderboard = exports.getReports = exports.createReport = void 0;
const User_1 = __importDefault(require("../models/User"));
const Report_1 = __importDefault(require("../models/Report"));
const storage_1 = require("../config/storage");
const store_1 = require("../data/store");
const fineCalculator_1 = __importDefault(require("../utils/fineCalculator"));
const fetchAllUsers = async () => {
    const users = await User_1.default.find({}, { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 }).sort({ userId: 1 }).lean();
    return users.map((user) => ({
        id: user.userId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
    }));
};
const fetchUserById = async (id) => {
    const user = await User_1.default.findOne({ userId: id }, { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 });
    if (!user) {
        return null;
    }
    return {
        id: user.userId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
    };
};
const serializeReport = (report) => ({
    id: report.reportId,
    applianceId: report.applianceId,
    applianceName: report.applianceName,
    responsibleUserId: report.responsibleUserId,
    responsibleUserName: report.responsibleUserName,
    reporterUserId: report.reporterUserId,
    reporterUserName: report.reporterUserName,
    fine: report.fine,
    notes: report.notes,
    evidenceImage: report.evidenceImage,
    createdAt: new Date(report.createdAt).toISOString(),
});
const countPreviousReports = async (responsibleUserId, applianceId) => Report_1.default.countDocuments({ responsibleUserId, applianceId });
const getNextReportId = async () => {
    const lastReport = await Report_1.default.findOne({}, { reportId: 1 }).sort({ reportId: -1 }).lean();
    return (lastReport?.reportId ?? 0) + 1;
};
const createReport = async (req, res) => {
    const { applianceId, responsibleUserId, reporterUserId, notes } = req.body;
    try {
        const appliance = store_1.store.findApplianceById(Number(applianceId));
        const responsibleUser = await fetchUserById(Number(responsibleUserId));
        const reporterUser = await fetchUserById(Number(reporterUserId));
        if (!appliance || !responsibleUser || !reporterUser) {
            return res.status(400).json({ message: 'Invalid appliance or user selection.' });
        }
        const fine = (0, fineCalculator_1.default)({
            baseFine: appliance.baseFine,
            watts: appliance.watts,
            repeatedOffenseCount: await countPreviousReports(responsibleUser.id, appliance.id),
        });
        const evidenceImage = req.file ? await (0, storage_1.saveEvidenceImage)(req.file) : null;
        const report = await Report_1.default.create({
            reportId: await getNextReportId(),
            applianceId: appliance.id,
            applianceName: appliance.name,
            responsibleUserId: responsibleUser.id,
            responsibleUserName: responsibleUser.name,
            reporterUserId: reporterUser.id,
            reporterUserName: reporterUser.name,
            fine,
            notes: notes?.trim() ?? '',
            evidenceImage,
        });
        return res.status(201).json({ report: serializeReport(report) });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error while creating report.' });
    }
};
exports.createReport = createReport;
const getReports = async (_req, res) => {
    try {
        const users = await fetchAllUsers();
        const reports = await Report_1.default.find({}, { _id: 0, __v: 0 }).sort({ createdAt: -1 }).lean();
        return res.json({
            reports: reports.map(serializeReport),
            appliances: store_1.store.getAppliances(),
            users,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error while fetching reports.' });
    }
};
exports.getReports = getReports;
const getLeaderboard = async (_req, res) => {
    try {
        const users = await fetchAllUsers();
        const reports = await Report_1.default.find({}, { _id: 0, responsibleUserId: 1, fine: 1 }).lean();
        const leaderboard = users
            .map((user) => {
            const userReports = reports.filter((report) => report.responsibleUserId === user.id);
            const totalFine = userReports.reduce((sum, report) => sum + report.fine, 0);
            return {
                userId: user.id,
                name: user.name,
                avatar: user.avatar,
                offenseCount: userReports.length,
                totalFine,
            };
        })
            .sort((left, right) => right.totalFine - left.totalFine);
        return res.json({ leaderboard });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error while fetching leaderboard.' });
    }
};
exports.getLeaderboard = getLeaderboard;
const deleteReport = async (req, res) => {
    const reportId = Number(req.params.id);
    if (!Number.isInteger(reportId) || reportId <= 0) {
        return res.status(400).json({ message: 'Invalid report id.' });
    }
    try {
        const deleted = await Report_1.default.findOneAndDelete({ reportId });
        if (!deleted) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error while deleting report.' });
    }
};
exports.deleteReport = deleteReport;
