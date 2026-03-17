import React from 'react';
import { NavLink } from 'react-router-dom';
import type { User } from '../types';

type NavbarProps = {
  currentUser: User | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive ? 'bg-slate-950 text-white dark:bg-cyan-500 dark:text-slate-950' : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700/70',
  ].join(' ');

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, theme, onToggleTheme }) => (
  <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Shared Flat Ops</p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Electricity Misuse Tracker</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-full border border-slate-300/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        {currentUser ? (
          <>
            <nav className="hidden items-center gap-2 rounded-full bg-slate-100/90 p-1 dark:bg-slate-800/90 sm:flex">
              <NavLink to="/dashboard" className={linkClassName}>Dashboard</NavLink>
              <NavLink to="/report" className={linkClassName}>Report</NavLink>
              <NavLink to="/history" className={linkClassName}>History</NavLink>
            </nav>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">@{currentUser.username}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 dark:border-slate-600 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 dark:bg-cyan-500/15 dark:text-cyan-200">Login required</p>
        )}
      </div>
    </div>
  </header>
);

export default Navbar;
