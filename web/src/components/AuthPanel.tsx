import { useState } from 'react';

import { useAuthStore } from '../store/useAuthStore';

export function AuthPanel() {
  const {
    currentUser,
    authLoading,
    authPanelOpen,
    authMode,
    authError,
    signIn,
    signUp,
    signOut,
    openAuth,
    closeAuth,
  } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (authMode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
    setPassword('');
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-400">{currentUser.email}</div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-slate-100"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openAuth('signin')}
          className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-700 hover:text-white"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => openAuth('signup')}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white transition hover:bg-blue-500"
        >
          Create Account
        </button>
      </div>
      {authPanelOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[280px] rounded-2xl border border-slate-700/50 bg-slate-900 p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </div>
            <button type="button" onClick={closeAuth} className="text-xs text-slate-500 hover:text-slate-200">
              Close
            </button>
          </div>
          <form className="space-y-2.5" onSubmit={(event) => void handleSubmit(event)}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-800"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-800"
            />
            {authError ? <div className="text-xs text-red-400">{authError}</div> : null}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {authLoading ? 'Working...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
