import React from 'react';
import FineTable from '../components/FineTable';
import Leaderboard from '../components/Leaderboard';
import type { LeaderboardEntry, Report, User } from '../types';

type DashboardProps = {
  currentUser: User;
  reports: Report[];
  leaderboard: LeaderboardEntry[];
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser, reports, leaderboard }) => {
  const totalFines = reports.reduce((sum, report) => sum + report.fine, 0);
  const yourIncidents = reports.filter((report) => report.responsibleUserId === currentUser.id);
  const yourFineDue = yourIncidents.reduce((sum, report) => sum + report.fine, 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="hero-panel">
            <p className="badge">Dashboard</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-100">Welcome back, {currentUser.name}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Monitor recent misuse reports, see where fines are piling up, and keep the flat’s electricity habits visible.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-card"><span>Total reports</span><strong>{reports.length}</strong></div>
              <div className="metric-card"><span>Total fines</span><strong>Rs. {totalFines}</strong></div>
              <div className="metric-card"><span>Your incidents</span><strong>{yourIncidents.length}</strong></div>
              <div className="metric-card bg-rose-700 dark:bg-rose-600"><span>Fine to be paid by you</span><strong>Rs. {yourFineDue}</strong></div>
            </div>
          </div>
          <FineTable reports={reports.slice(0, 6)} />
        </div>
        <Leaderboard entries={leaderboard} />
      </div>
    </section>
  );
};

export default Dashboard;
