import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Report from './pages/Report';
import {
  createReportRequest,
  deleteReportRequest,
  getLeaderboardRequest,
  getReportsRequest,
  loginRequest,
  signupRequest,
} from './services/api';
import type { Appliance, LeaderboardEntry, Report as ReportType, User } from './types';

type AppShellProps = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AppShell: React.FC<AppShellProps> = ({ currentUser, setCurrentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [reports, setReports] = useState<ReportType[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const refreshData = async () => {
    const [reportsResponse, leaderboardResponse] = await Promise.all([
      getReportsRequest(),
      getLeaderboardRequest(),
    ]);

    setReports(reportsResponse.reports);
    setUsers(reportsResponse.users);
    setAppliances(reportsResponse.appliances);
    setLeaderboard(leaderboardResponse.leaderboard);
  };

  useEffect(() => {
    refreshData().catch(() => {
      setError('Could not reach the backend. Start the API and refresh the page.');
    });
  }, []);

  const handleAuthSuccess = async (response: { user: User; availableUsers: User[]; appliances: Appliance[] }) => {
    setCurrentUser(response.user);
    setUsers(response.availableUsers);
    setAppliances(response.appliances);
    await refreshData();
    navigate('/dashboard');
  };

  const handleLogin = async (username: string) => {
    setLoginLoading(true);
    setError(null);

    try {
      const response = await loginRequest(username);
      await handleAuthSuccess(response);
    } catch (loginError) {
      setError('Login failed. Check your username and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (payload: { username: string; name: string }) => {
    setLoginLoading(true);
    setError(null);

    try {
      const response = await signupRequest(payload);
      await handleAuthSuccess(response);
    } catch (signupError) {
      setError('Signup failed. Use a unique username and fill in all fields.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const handleReportSubmit = async (payload: {
    applianceId: number;
    responsibleUserId: number;
    reporterUserId: number;
    notes: string;
    image?: File | null;
  }) => {
    await createReportRequest(payload);
    await refreshData();
    navigate('/history');
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!currentUser) {
      return;
    }

    await deleteReportRequest(reportId, currentUser.id);
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-app text-slate-900">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} onSignup={handleSignup} loading={loginLoading} error={error} />} />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard currentUser={currentUser} reports={reports} leaderboard={leaderboard} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/report"
          element={currentUser ? <Report appliances={appliances} users={users} reports={reports} currentUser={currentUser} onSubmit={handleReportSubmit} /> : <Navigate to="/" replace />}
        />
        <Route path="/history" element={currentUser ? <History reports={reports} currentUser={currentUser} onDeleteReport={handleDeleteReport} /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <AppShell currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </BrowserRouter>
  );
};

export default App;
