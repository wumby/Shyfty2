import { SignalCard } from './SignalCard';
import { EmptyState } from './EmptyState';
import type { Signal } from '../types';

export function SignalFeed({ signals }: { signals: Signal[] }) {
  if (!signals.length) {
    return <EmptyState title="No live signals match this view" copy="Broaden the league or signal filters to surface more player movement." />;
  }

  return (
    <div className="grid gap-5">
      {signals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
