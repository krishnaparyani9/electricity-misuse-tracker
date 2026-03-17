import React from 'react';
import type { LeaderboardEntry } from '../types';

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => (
  <section className="glass-panel">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Leaderboard</p>
        <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Highest fines this cycle</h2>
      </div>
      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">Auto-ranked</span>
    </div>
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div key={entry.userId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white dark:bg-cyan-500 dark:text-slate-950">{entry.avatar}</div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">#{index + 1} {entry.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{entry.offenseCount} offenses</p>
            </div>
          </div>
          <p className="text-lg font-black text-rose-600 dark:text-rose-300">Rs. {entry.totalFine}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Leaderboard;
