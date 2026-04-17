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

  return (
    <div className="grid h-[calc(100vh-7.7rem)] gap-3 lg:grid-cols-[220px,minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-0">
          <FilterBar
            filters={filters}
            onChange={(nextFilters) => setFilters(nextFilters)}
          />
        </div>
      </aside>
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-slate-800 bg-slate-900/30">
        <div className="border-b border-slate-800 px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <span>{filters.league ?? 'All leagues'}</span>
            <span className="text-slate-700">/</span>
            <span>{filters.signal_type ?? 'All signals'}</span>
            <span className="text-slate-700">/</span>
            <span>{signals.length} in view</span>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <div className="lg:hidden px-2 pb-3">
            <FilterBar
              filters={filters}
              onChange={(nextFilters) => setFilters(nextFilters)}
            />
          </div>
          {loading ? <LoadingState /> : <SignalFeed signals={signals} />}
        </div>
      </div>
    </div>
  );
}
