import { useEffect } from 'react';

import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useSignalStore } from '../store/useSignalStore';

export function TeamsPage() {
  const { teams, loading, fetchTeams } = useSignalStore();

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  if (loading) return <LoadingState />;
  if (!teams.length) return <EmptyState title="No teams" copy="Seed the backend to populate the league directory." />;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => (
        <div key={team.id} className="rounded-3xl border border-border bg-white/[0.03] p-5">
          <div className="text-lg font-semibold">{team.name}</div>
          <div className="mt-2 text-sm text-muted">{team.league_name}</div>
          <div className="mt-4 text-xs uppercase tracking-[0.25em] text-accent">{team.player_count} tracked players</div>
        </div>
      ))}
    </div>
  );
}

