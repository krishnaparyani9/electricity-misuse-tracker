import { Schema, model } from 'mongoose';

export type ReportDocument = {
	reportId: number;
	applianceId: number;
	applianceName: string;
	responsibleUserId: number;
	responsibleUserName: string;
	reporterUserId: number;
	reporterUserName: string;
	fine: number;
	notes: string;
	evidenceImage: string | null;
	createdAt: Date;
	updatedAt: Date;
};

const reportSchema = new Schema<ReportDocument>(
	{
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
	},
	{ timestamps: true }
);

const ReportModel = model<ReportDocument>('Report', reportSchema);

export default ReportModel;
