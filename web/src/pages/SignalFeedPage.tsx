import { useEffect, useState } from 'react';

import { FilterBar } from '../components/FilterBar';
import { LoadingState } from '../components/LoadingState';
import { SignalDetailDrawer } from '../components/SignalDetailDrawer';
import { SignalFeed } from '../components/SignalFeed';
import { useSignalStore } from '../store/useSignalStore';

export function SignalFeedPage() {
  const { filters, signals, loadingInitial, hasMore, setFilters, fetchSignals } = useSignalStore();
  const [detailSignalId, setDetailSignalId] = useState<number | null>(null);

  useEffect(() => {
    void fetchSignals();
  }, [fetchSignals, filters]);

  const leagueLabel = filters.league ?? 'All leagues';
  const typeLabel = filters.signal_type ?? 'All signals';
  const countLabel = `${signals.length}${hasMore ? '+' : ''} signals`;

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
            <span>{leagueLabel}</span>
            <span className="text-slate-700">/</span>
            <span>{typeLabel}</span>
            <span className="text-slate-700">/</span>
            <span>{countLabel}</span>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <div className="lg:hidden px-2 pb-3">
            <FilterBar
              filters={filters}
              onChange={(nextFilters) => setFilters(nextFilters)}
            />
          </div>
          {loadingInitial ? (
            <LoadingState />
          ) : (
            <SignalFeed
              signals={signals}
              paginated
              onOpenDetail={(id) => setDetailSignalId(id)}
            />
          )}
        </div>
      </div>

      {detailSignalId != null && (
        <SignalDetailDrawer
          signalId={detailSignalId}
          onClose={() => setDetailSignalId(null)}
        />
      )}
    </div>
  );
}
