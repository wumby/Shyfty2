import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useSignalStore } from '../store/useSignalStore';

export function PlayersPage() {
  const { players, loading, fetchPlayers } = useSignalStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    void fetchPlayers();
  }, [fetchPlayers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.team_name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q),
    );
  }, [players, query]);

  if (loading) return <LoadingState />;
  if (!players.length) return <EmptyState title="No players" copy="Seed the backend to populate the player directory." />;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players, teams, positions…"
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matches" copy={`No players match "${query}".`} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="rounded-2xl border border-border bg-white/[0.03] p-5 transition hover:border-accent/40 hover:bg-white/[0.05]"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-accent/70">{player.league_name}</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{player.name}</div>
              <div className="mt-1 text-sm text-muted">{player.team_name}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">{player.position}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
