import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Signals' },
  { to: '/players', label: 'Players' },
  { to: '/teams', label: 'Teams' },
];

export function AppShell() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="glass-panel rounded-3xl p-5">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.35em] text-accent">Shyfty</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Signal Engine</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Real-time NBA and NFL performance shifts surfaced as a feed.
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-white/5 hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="glass-panel rounded-3xl p-5 sm:p-7">
          <div className="mb-8 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted">Live Feed</div>
              <div className="mt-2 text-2xl font-semibold">Bloomberg terminal, but for player volatility.</div>
            </div>
            <div className="rounded-2xl border border-border bg-white/5 px-4 py-2 text-xs text-muted">
              NBA + NFL signals from rolling performance baselines
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

