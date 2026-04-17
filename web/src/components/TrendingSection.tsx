import { useEffect, useState } from 'react';

import { api } from '../services/api';
import type { Signal } from '../types';
import {
  formatDelta,
  formatSignalLabel,
  getImportance,
  getSignalDirection,
} from '../lib/signalFormat';

const typeTone: Record<Signal['signal_type'], string> = {
  SPIKE: 'text-green-400',
  DROP: 'text-red-400',
  SHIFT: 'text-amber-400',
  CONSISTENCY: 'text-blue-400',
  OUTLIER: 'text-purple-400',
};

interface Props {
  onOpenDetail: (id: number) => void;
}

export function TrendingSection({ onOpenDetail }: Props) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTrendingSignals(12)
      .then(setSignals)
      .catch(() => setSignals([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-4 space-y-1">
        <div className="px-1 pb-1 text-[10px] uppercase tracking-[0.24em] text-slate-600">Trending</div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] w-48 flex-none animate-pulse rounded-xl bg-slate-800/60" />
          ))}
        </div>
      </div>
    );
  }

  if (signals.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="mb-2 px-1 text-[10px] uppercase tracking-[0.24em] text-slate-600">Trending Now</div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {signals.map((signal) => {
          const direction = getSignalDirection(signal);
          const importance = getImportance(signal);
          const toneClass = typeTone[signal.signal_type];

          return (
            <button
              key={signal.id}
              type="button"
              onClick={() => onOpenDetail(signal.id)}
              className="group flex w-44 flex-none flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800/60"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${toneClass}`}>
                  {formatSignalLabel(signal.signal_type)}
                </span>
                {importance === 'High' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
              </div>
              <div className="mt-1.5">
                <div className="truncate text-[13px] font-semibold text-slate-100">{signal.player_name}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{signal.metric_label ?? signal.metric_name.replace(/_/g, ' ')}</div>
              </div>
              <div className={`mt-1.5 text-[18px] font-semibold tabular-nums leading-none ${
                direction === 'positive' ? 'text-green-400' : direction === 'negative' ? 'text-red-400' : 'text-slate-300'
              }`}>
                {formatDelta(signal)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
