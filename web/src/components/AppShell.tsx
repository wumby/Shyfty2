import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Signals' },
  { to: '/players', label: 'Players' },
  { to: '/teams', label: 'Teams' },
];

export function AppShell() {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[220px,minmax(0,1fr)]">
        <aside className="glass-panel rounded-[28px] p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
          <div className="mb-9">
            <div className="text-[11px] uppercase tracking-[0.34em] text-accent/90">Shyfty</div>
            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-ink">Signal Engine</h1>
            <p className="mt-3 max-w-[15rem] text-sm leading-6 text-muted/90">
              Cross-league volatility surfaced as a clean intelligence feed.
            </p>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-accent/12 text-ink shadow-[inset_0_0_0_1px_rgba(73,166,255,0.18)]'
                      : 'text-muted/90 hover:bg-white/[0.03] hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 border-t border-white/6 pt-5">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Scope</div>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-muted">Leagues</span>
                <span className="text-ink">NBA + NFL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Mode</span>
                <span className="text-ink">Live feed</span>
              </div>
            </div>
          </div>
        </aside>
        <main className="glass-panel rounded-[32px] p-5 sm:p-7 lg:p-8">
          <div className="mb-7 flex flex-col gap-4 border-b border-white/6 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Live Signal Feed</div>
              <div className="mt-2 max-w-3xl text-[26px] font-semibold tracking-[-0.03em] text-ink">
                Player volatility surfaced with a cleaner market-tape hierarchy.
              </div>
            </div>
            <div className="rounded-full bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-muted">
              rolling baselines • premium dark mode
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
