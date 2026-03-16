import React from 'react';
import { NavLink } from 'react-router-dom';
import type { User } from '../types';

type NavbarProps = {
  currentUser: User | null;
  onLogout: () => void;
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-white',
  ].join(' ');

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => (
  <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Shared Flat Ops</p>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">Electricity Misuse Tracker</h1>
      </div>
      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <nav className="hidden items-center gap-2 rounded-full bg-slate-100 p-1 sm:flex">
              <NavLink to="/dashboard" className={linkClassName}>Dashboard</NavLink>
              <NavLink to="/report" className={linkClassName}>Report</NavLink>
              <NavLink to="/history" className={linkClassName}>History</NavLink>
            </nav>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500">@{currentUser.username}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">Login required</p>
        )}
      </div>
    </div>
  </header>
);

export default Navbar;
