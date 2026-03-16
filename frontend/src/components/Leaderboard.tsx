import React from 'react';
import type { LeaderboardEntry } from '../types';

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => (
  <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Leaderboard</p>
        <h2 className="text-2xl font-black text-slate-950">Highest fines this cycle</h2>
      </div>
      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Auto-ranked</span>
    </div>
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div key={entry.userId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{entry.avatar}</div>
            <div>
              <p className="font-semibold text-slate-900">#{index + 1} {entry.name}</p>
              <p className="text-sm text-slate-500">{entry.offenseCount} offenses</p>
            </div>
          </div>
          <p className="text-lg font-black text-rose-600">Rs. {entry.totalFine}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Leaderboard;
