import type { SignalFilters } from '../types';

interface FilterBarProps {
  filters: SignalFilters;
  onChange: (filters: SignalFilters) => void;
  signalCount?: number;
}

const leagues = ['ALL', 'NBA', 'NFL'];
const types = ['ALL', 'SPIKE', 'DROP', 'SHIFT', 'CONSISTENCY', 'OUTLIER'];

const typeTone: Record<string, string> = {
  ALL: 'text-slate-300',
  SPIKE: 'text-emerald-200',
  DROP: 'text-rose-200',
  SHIFT: 'text-amber-200',
  CONSISTENCY: 'text-cyan-200',
  OUTLIER: 'text-fuchsia-200',
};

export function FilterBar({ filters, onChange, signalCount }: FilterBarProps) {
  return (
    <div className="rounded-[24px] bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:px-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Feed Filters</div>
          <div className="mt-1 text-base font-semibold tracking-[-0.02em] text-ink">Refine the tape without overpowering it</div>
        </div>
        <div className="rounded-full bg-white/[0.045] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-slate-300">
          {signalCount ?? 0} signals in view
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.7fr,1.3fr]">
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">League</div>
          <div className="flex flex-wrap gap-2">
            {leagues.map((league) => (
              <button
                key={league}
                type="button"
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  (filters.league ?? 'ALL') === league
                    ? 'bg-accent/18 text-accent shadow-[inset_0_0_0_1px_rgba(73,166,255,0.22)]'
                    : 'bg-white/[0.045] text-slate-300 hover:bg-white/[0.08] hover:text-ink'
                }`}
                onClick={() => onChange({ ...filters, league: league === 'ALL' ? undefined : league })}
              >
                {league}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">Signal Type</div>
          <div className="flex flex-wrap gap-2">
            {types.map((signalType) => (
              <button
                key={signalType}
                type="button"
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  (filters.signal_type ?? 'ALL') === signalType
                    ? 'bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]'
                    : 'bg-white/[0.045] hover:bg-white/[0.08]'
                }`}
                onClick={() =>
                  onChange({ ...filters, signal_type: signalType === 'ALL' ? undefined : signalType })
                }
              >
                <span className={typeTone[signalType]}>{signalType}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
