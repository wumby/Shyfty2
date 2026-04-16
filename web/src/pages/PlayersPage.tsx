import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useSignalStore } from '../store/useSignalStore';

export function PlayersPage() {
  const { players, loading, fetchPlayers } = useSignalStore();

  useEffect(() => {
    void fetchPlayers();
  }, [fetchPlayers]);

  if (loading) return <LoadingState />;
  if (!players.length) return <EmptyState title="No players" copy="Seed the backend to populate the player directory." />;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {players.map((player) => (
        <Link
          key={player.id}
          to={`/players/${player.id}`}
          className="rounded-3xl border border-border bg-white/[0.03] p-5 transition hover:border-accent/40 hover:bg-white/[0.05]"
        >
          <div className="text-lg font-semibold">{player.name}</div>
          <div className="mt-2 text-sm text-muted">
            {player.team_name} · {player.league_name}
          </div>
          <div className="mt-4 text-xs uppercase tracking-[0.25em] text-accent">{player.position}</div>
        </Link>
      ))}
    </div>
  );
}

