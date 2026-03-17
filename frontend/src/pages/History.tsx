import React from 'react';
import { getApiBaseUrl } from '../services/api';
import type { Report, User } from '../types';

type HistoryProps = {
  reports: Report[];
  currentUser: User;
  onDeleteReport: (reportId: number) => Promise<void>;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const apiBaseUrl = getApiBaseUrl();
const getEvidenceUrl = (value: string) => (value.startsWith('http') ? value : `${apiBaseUrl}${value}`);

const History: React.FC<HistoryProps> = ({ reports, currentUser, onDeleteReport }) => (
  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="mb-6">
      <p className="badge">History</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-slate-100">Every logged misuse event</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
        Review every report, when it was filed, and how each fine was assigned.
      </p>
    </div>
    <div className="grid gap-4">
      {reports.map((report) => (
        <article key={report.id} className="glass-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{formatDate(report.createdAt)}</p>
              <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-slate-100">{report.applianceName}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{report.notes || 'No extra notes attached.'}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">Rs. {report.fine}</p>
              {report.reporterUserId === currentUser.id ? (
                <button
                  type="button"
                  onClick={() => onDeleteReport(report.id)}
                  className="rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 transition hover:border-rose-600 hover:bg-rose-50 dark:border-rose-400/30 dark:bg-slate-900/70 dark:text-rose-200 dark:hover:bg-rose-500/20"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800/80">Responsible: {report.responsibleUserName}</span>
            <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800/80">Reported by: {report.reporterUserName}</span>
            {report.evidenceImage ? (
              <a href={getEvidenceUrl(report.evidenceImage)} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-100 px-3 py-2 font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                View evidence
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default History;
