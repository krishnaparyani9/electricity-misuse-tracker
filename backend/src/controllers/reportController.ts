import { Request, Response } from 'express';
import UserModel from '../models/User';
import ReportModel from '../models/Report';
import { saveEvidenceImage } from '../config/storage';
import { store } from '../data/store';
import calculateFine from '../utils/fineCalculator';

type PublicUser = {
  id: number;
  username: string;
  name: string;
  avatar: string;
};

const fetchAllUsers = async () => {
  const users = await UserModel.find({}, { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 }).sort({ userId: 1 }).lean();
  return users.map((user) => ({
    id: user.userId,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
  }));
};

const fetchUserById = async (id: number): Promise<PublicUser | null> => {
  const user = await UserModel.findOne(
    { userId: id },
    { _id: 0, userId: 1, username: 1, name: 1, avatar: 1 }
  );

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

const serializeReport = (report: {
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
  createdAt: Date | string;
}) => ({
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

const countPreviousReports = async (responsibleUserId: number, applianceId: number) =>
  ReportModel.countDocuments({ responsibleUserId, applianceId });

const getNextReportId = async () => {
  const lastReport = await ReportModel.findOne({}, { reportId: 1 }).sort({ reportId: -1 }).lean();
  return (lastReport?.reportId ?? 0) + 1;
};

export const createReport = async (req: Request, res: Response) => {
  const { applianceId, responsibleUserId, reporterUserId, notes } = req.body as {
    applianceId?: string;
    responsibleUserId?: string;
    reporterUserId?: string;
    notes?: string;
  };

  try {
    const appliance = store.findApplianceById(Number(applianceId));
    const responsibleUser = await fetchUserById(Number(responsibleUserId));
    const reporterUser = await fetchUserById(Number(reporterUserId));

    if (!appliance || !responsibleUser || !reporterUser) {
      return res.status(400).json({ message: 'Invalid appliance or user selection.' });
    }

    const fine = calculateFine({
      baseFine: appliance.baseFine,
      watts: appliance.watts,
      repeatedOffenseCount: await countPreviousReports(responsibleUser.id, appliance.id),
    });

    const evidenceImage = req.file ? await saveEvidenceImage(req.file) : null;

    const report = await ReportModel.create({
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
  } catch (error) {
    return res.status(500).json({ message: 'Database error while creating report.' });
  }
};

export const getReports = async (_req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    const reports = await ReportModel.find({}, { _id: 0, __v: 0 }).sort({ createdAt: -1 }).lean();

    return res.json({
      reports: reports.map(serializeReport),
      appliances: store.getAppliances(),
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Database error while fetching reports.' });
  }
};

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    const reports = await ReportModel.find({}, { _id: 0, responsibleUserId: 1, fine: 1 }).lean();
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
  } catch (error) {
    return res.status(500).json({ message: 'Database error while fetching leaderboard.' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const reportId = Number(req.params.id);
  const requesterUserId = Number(req.query.requesterUserId);

  if (!Number.isInteger(reportId) || reportId <= 0) {
    return res.status(400).json({ message: 'Invalid report id.' });
  }

  if (!Number.isInteger(requesterUserId) || requesterUserId <= 0) {
    return res.status(400).json({ message: 'Invalid requester user id.' });
  }

  try {
    const report = await ReportModel.findOne({ reportId }, { _id: 0, responsibleUserId: 1, reporterUserId: 1 }).lean();

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    if (report.reporterUserId !== requesterUserId) {
      return res.status(403).json({ message: 'Only the reporting user can delete this report.' });
    }

    await ReportModel.findOneAndDelete({ reportId });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Database error while deleting report.' });
  }
};
