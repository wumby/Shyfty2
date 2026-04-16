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
    <div>
      <FilterBar
        filters={filters}
        signalCount={signals.length}
        onChange={(nextFilters) => setFilters(nextFilters)}
      />
      {loading ? <LoadingState /> : <SignalFeed signals={signals} />}
    </div>
  );
}
