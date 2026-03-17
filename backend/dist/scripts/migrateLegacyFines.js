"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const Report_1 = __importDefault(require("../models/Report"));
const baseFineByApplianceId = {
    1: 15,
    2: 5,
    3: 5,
    4: 15,
    5: 25,
    6: 25,
    7: 10,
};
const runMigration = async () => {
    await (0, db_1.connectDatabase)();
    const reports = await Report_1.default.find({}, { _id: 1, reportId: 1, responsibleUserId: 1, applianceId: 1, fine: 1, createdAt: 1 })
        .sort({ createdAt: 1, reportId: 1, _id: 1 })
        .lean();
    const backupDir = path_1.default.join(process.cwd(), 'backups');
    await promises_1.default.mkdir(backupDir, { recursive: true });
    const backupFilePath = path_1.default.join(backupDir, `reports-backup-before-fine-migration-${Date.now()}.json`);
    await promises_1.default.writeFile(backupFilePath, JSON.stringify(reports, null, 2), 'utf-8');
    const counters = new Map();
    const operations = [];
    let updatedCount = 0;
    let skippedUnknownAppliance = 0;
    for (const report of reports) {
        const baseFine = baseFineByApplianceId[report.applianceId];
        if (typeof baseFine !== 'number') {
            skippedUnknownAppliance += 1;
            continue;
        }
        const key = `${report.responsibleUserId}:${report.applianceId}`;
        const previousCount = counters.get(key) ?? 0;
        const escalation = Math.floor(previousCount / 10) * 5;
        const recalculatedFine = baseFine + escalation;
        if (report.fine !== recalculatedFine) {
            operations.push({
                updateOne: {
                    filter: { _id: report._id },
                    update: { $set: { fine: recalculatedFine } },
                },
            });
            updatedCount += 1;
        }
        counters.set(key, previousCount + 1);
    }
    if (operations.length > 0) {
        await Report_1.default.bulkWrite(operations);
    }
    console.log('Fine migration complete.');
    console.log(`Total reports scanned: ${reports.length}`);
    console.log(`Reports updated: ${updatedCount}`);
    console.log(`Reports skipped (unknown appliance): ${skippedUnknownAppliance}`);
    console.log(`Backup file: ${backupFilePath}`);
};
runMigration()
    .catch((error) => {
    console.error('Fine migration failed:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
