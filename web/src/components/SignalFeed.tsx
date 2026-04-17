import { useEffect, useMemo, useRef, useState } from 'react';

import { EmptyState } from './EmptyState';
import { SignalCard } from './SignalCard';
import type { Signal } from '../types';

export function SignalFeed({ signals }: { signals: Signal[] }) {
  const [visibleCount, setVisibleCount] = useState(24);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(24);
  }, [signals]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 24, signals.length));
        }
      },
      { root: containerRef.current, rootMargin: '240px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [signals.length]);

  const visibleSignals = useMemo(() => signals.slice(0, visibleCount), [signals, visibleCount]);

  if (!signals.length) {
    return (
      <div className="h-full overflow-y-auto" ref={containerRef}>
        <EmptyState title="No signals in this view" copy="Broaden the league or signal type filter." />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto" ref={containerRef}>
      <div className="overflow-hidden bg-transparent">
        {visibleSignals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
        {visibleCount < signals.length ? <div ref={sentinelRef} className="h-8" /> : null}
      </div>
    </div>
  );
}
