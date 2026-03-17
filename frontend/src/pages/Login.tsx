import React, { useState } from 'react';
import type { AuthFormMode } from '../types';

type LoginProps = {
  onLogin: (username: string) => Promise<void>;
  onSignup: (payload: { username: string; name: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const Login: React.FC<LoginProps> = ({ onLogin, onSignup, loading, error }) => {
  const [mode, setMode] = useState<AuthFormMode>('signup');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'signup') {
      await onSignup({ username, name });
      return;
    }

    await onLogin(username);
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
      <div className="hero-panel">
        <p className="badge">Shared flat accountability</p>
        <h2 className="mt-4 max-w-xl text-5xl font-black tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl">
          Report power misuse before the bill reports all of you.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Track repeat offenders, upload proof, and assign fair fines automatically. Built for shared flats where forgotten appliances keep turning into shared expenses.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="stat-chip"><span>Auto fines</span><strong>Watt-aware</strong></div>
          <div className="stat-chip"><span>Evidence</span><strong>Image uploads</strong></div>
          <div className="stat-chip"><span>Ranking</span><strong>Live leaderboard</strong></div>
        </div>
      </div>
      <div className="glass-panel sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Access</p>
            <h3 className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-100">Create your flat account</h3>
          </div>
          <div className="rounded-full bg-slate-100 p-1 text-sm font-semibold dark:bg-slate-800">
            <button type="button" onClick={() => setMode('signup')} className={mode === 'signup' ? 'rounded-full bg-slate-950 px-4 py-2 text-white dark:bg-cyan-500 dark:text-slate-950' : 'rounded-full px-4 py-2 text-slate-600 dark:text-slate-300'}>Sign up</button>
            <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'rounded-full bg-slate-950 px-4 py-2 text-white dark:bg-cyan-500 dark:text-slate-950' : 'rounded-full px-4 py-2 text-slate-600 dark:text-slate-300'}>Login</button>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {mode === 'signup'
            ? 'Create a new resident profile for the shared flat, then continue directly to the dashboard.'
            : 'Enter your username and continue directly to the dashboard.'}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === 'signup' ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</label>
                <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="e.g. Krish Patel" />
              </div>
            </>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" placeholder="Choose a unique username" />
          </div>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
            {loading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Create account' : 'Continue to dashboard')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
