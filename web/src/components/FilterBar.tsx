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
    <div className="mb-6 rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Feed Filters</div>
          <div className="mt-2 text-lg font-semibold text-white">Refine the signal tape</div>
        </div>
        <div className="rounded-full border border-white/8 bg-black/20 px-4 py-2 text-xs text-slate-300">
          {signalCount ?? 0} signals in view
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">League</div>
        <div className="flex flex-wrap gap-2">
          {leagues.map((league) => (
            <button
              key={league}
              type="button"
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                (filters.league ?? 'ALL') === league
                  ? 'border-accent/40 bg-accent/20 text-accent'
                  : 'border-white/8 bg-white/[0.04] text-slate-400 hover:border-white/15 hover:text-white'
              }`}
              onClick={() => onChange({ ...filters, league: league === 'ALL' ? undefined : league })}
            >
              {league}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">Signal Type</div>
        <div className="flex flex-wrap gap-2">
          {types.map((signalType) => (
            <button
              key={signalType}
              type="button"
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                (filters.signal_type ?? 'ALL') === signalType
                  ? 'border-white/20 bg-white/10'
                  : 'border-white/8 bg-white/[0.04] hover:border-white/15'
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
