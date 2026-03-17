import axios from 'axios';
import type { Appliance, LeaderboardEntry, Report, User } from '../types';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: apiBaseUrl,
});

export const getApiBaseUrl = () => apiBaseUrl;

export type LoginResponse = {
  user: User;
  availableUsers: User[];
  appliances: Appliance[];
};

export type SignupPayload = {
  username: string;
  name: string;
};

export type ReportsResponse = {
  reports: Report[];
  appliances: Appliance[];
  users: User[];
};

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

export const signupRequest = async (payload: SignupPayload) => {
  const { data } = await api.post<LoginResponse>('/signup', payload);
  return data;
};

export const loginRequest = async (username: string) => {
  const { data } = await api.post<LoginResponse>('/login', { username });
  return data;
};

export const getReportsRequest = async () => {
  const { data } = await api.get<ReportsResponse>('/reports');
  return data;
};

export const getLeaderboardRequest = async () => {
  const { data } = await api.get<LeaderboardResponse>('/leaderboard');
  return data;
};

export const createReportRequest = async (payload: {
  applianceId: number;
  responsibleUserId: number;
  reporterUserId: number;
  notes: string;
  image?: File | null;
}) => {
  const formData = new FormData();
  formData.append('applianceId', String(payload.applianceId));
  formData.append('responsibleUserId', String(payload.responsibleUserId));
  formData.append('reporterUserId', String(payload.reporterUserId));
  formData.append('notes', payload.notes);

  if (payload.image) {
    formData.append('image', payload.image);
  }

  const { data } = await api.post<{ report: Report }>('/report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const deleteReportRequest = async (reportId: number) => {
  await api.delete(`/reports/${reportId}`);
};

export default api;
