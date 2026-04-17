import type { SignalFilters } from '../types';

interface FilterBarProps {
  filters: SignalFilters;
  onChange: (filters: SignalFilters) => void;
}

const leagues = ['ALL', 'NBA', 'NFL'];
const types = ['ALL', 'SPIKE', 'DROP', 'SHIFT', 'CONSISTENCY', 'OUTLIER'];

const typeTone: Record<string, string> = {
  ALL: 'text-slate-300',
  SPIKE: 'text-green-400',
  DROP: 'text-red-400',
  SHIFT: 'text-amber-400',
  CONSISTENCY: 'text-blue-400',
  OUTLIER: 'text-purple-400',
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="px-2 py-1">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.24em] text-slate-500">League</div>
          <div className="flex flex-col gap-1">
            {leagues.map((league) => (
              <button
                key={league}
                type="button"
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  (filters.league ?? 'ALL') === league
                    ? 'bg-blue-900/40 text-blue-300'
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
                }`}
                onClick={() => onChange({ ...filters, league: league === 'ALL' ? undefined : league })}
              >
                <span>{league}</span>
                {(filters.league ?? 'ALL') === league ? <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> : null}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.24em] text-slate-500">Signal Type</div>
          <div className="flex flex-col gap-1">
            {types.map((signalType) => (
              <button
                key={signalType}
                type="button"
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  (filters.signal_type ?? 'ALL') === signalType
                    ? 'bg-blue-900/40 text-blue-300'
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
                }`}
                onClick={() =>
                  onChange({ ...filters, signal_type: signalType === 'ALL' ? undefined : signalType })
                }
              >
                <span className={(filters.signal_type ?? 'ALL') === signalType ? 'text-blue-300' : typeTone[signalType]}>{signalType}</span>
                {(filters.signal_type ?? 'ALL') === signalType ? <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
