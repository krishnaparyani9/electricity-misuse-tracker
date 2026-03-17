import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db';
import ReportModel from '../models/Report';

const baseFineByApplianceId: Record<number, number> = {
  1: 15,
  2: 5,
  3: 5,
  4: 15,
  5: 25,
  6: 25,
  7: 10,
};

const runMigration = async () => {
  await connectDatabase();

  const reports = await ReportModel.find(
    {},
    { _id: 1, reportId: 1, responsibleUserId: 1, applianceId: 1, fine: 1, createdAt: 1 }
  )
    .sort({ createdAt: 1, reportId: 1, _id: 1 })
    .lean();

  const backupDir = path.join(process.cwd(), 'backups');
  await fs.mkdir(backupDir, { recursive: true });
  const backupFilePath = path.join(backupDir, `reports-backup-before-fine-migration-${Date.now()}.json`);
  await fs.writeFile(backupFilePath, JSON.stringify(reports, null, 2), 'utf-8');

  const counters = new Map<string, number>();
  const operations: Array<{
    updateOne: {
      filter: { _id: unknown };
      update: { $set: { fine: number } };
    };
  }> = [];

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
    await ReportModel.bulkWrite(operations);
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
    await mongoose.disconnect();
  });
