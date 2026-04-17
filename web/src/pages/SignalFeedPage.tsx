import { useEffect } from 'react';

import { FilterBar } from '../components/FilterBar';
import { LoadingState } from '../components/LoadingState';
import { SignalFeed } from '../components/SignalFeed';
import { useSignalStore } from '../store/useSignalStore';

export function SignalFeedPage() {
  const { filters, signals, loading, setFilters, fetchSignals } = useSignalStore();

  useEffect(() => {
    void fetchSignals();
  }, [fetchSignals, filters]);

  const highImportanceSignals = signals.filter((signal) => (signal.importance ?? 0) >= 85 || Math.abs(signal.z_score) >= 2.5).length;
  const liveLeagues = new Set(signals.map((signal) => signal.league_name)).size;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr),260px]">
        <div className="rounded-[26px] bg-white/[0.035] px-5 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:px-6">
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Signal Tape</div>
          <div className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-ink">Highest-conviction player movement, ordered for scan speed.</div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Filter down the tape, then scan type, player, thesis, delta, and context in one pass. The feed carries the visual weight; everything else stays quiet.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-[22px] bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">In view</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">{signals.length}</div>
            <div className="mt-1 text-sm text-muted">signals in current tape</div>
          </div>
          <div className="rounded-[22px] bg-white/[0.03] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Priority</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">{highImportanceSignals}</div>
            <div className="mt-1 text-sm text-muted">{liveLeagues || 0} leagues active</div>
          </div>
        </div>
      </section>
      <FilterBar
        filters={filters}
        signalCount={signals.length}
        onChange={(nextFilters) => setFilters(nextFilters)}
      />
      {loading ? <LoadingState /> : <SignalFeed signals={signals} />}
    </div>
  );
}
