import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { AuthPanel } from './AuthPanel';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { to: '/', label: 'Signals' },
  { to: '/players', label: 'Players' },
  { to: '/teams', label: 'Teams' },
];

export function AppShell() {
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
      <div className="mx-auto max-w-[1640px] overflow-visible">
        <header className="relative z-20 flex h-14 items-center justify-between overflow-visible rounded-[18px] border border-slate-700/50 bg-slate-900 px-3 sm:px-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-blue-400">Shyfty</div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-blue-900/50 text-blue-300'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <AuthPanel />
          </div>
        </header>
        <main className="relative z-0 mt-3 min-h-[calc(100vh-5.5rem)] overflow-hidden rounded-[20px] border border-slate-700/50 bg-[#0F172A] p-2 sm:p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
