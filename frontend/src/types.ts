export type User = {
  id: number;
  username: string;
  name: string;
  avatar: string;
};

export type AuthFormMode = 'login' | 'signup';

export type Appliance = {
  id: number;
  name: string;
  baseFine: number;
  watts: number;
};

export type Report = {
  id: number;
  applianceId: number;
  applianceName: string;
  responsibleUserId: number;
  responsibleUserName: string;
  reporterUserId: number;
  reporterUserName: string;
  fine: number;
  notes: string;
  evidenceImage: string | null;
  createdAt: string;
};

export type LeaderboardEntry = {
  userId: number;
  name: string;
  avatar: string;
  offenseCount: number;
  totalFine: number;
};