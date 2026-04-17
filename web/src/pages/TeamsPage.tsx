import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useSignalStore } from '../store/useSignalStore';

const LEAGUES = ['All', 'NBA', 'NFL'];

export function TeamsPage() {
  const { teams, loading, fetchTeams } = useSignalStore();
  const [leagueFilter, setLeagueFilter] = useState('All');

  useEffect(() => {
    void fetchTeams();
  }, [fetchTeams]);

  if (loading) return <LoadingState />;
  if (!teams.length) return <EmptyState title="No teams" copy="Seed the backend to populate the league directory." />;

  const filtered = leagueFilter === 'All' ? teams : teams.filter((t) => t.league_name === leagueFilter);

  return (
    <div className="space-y-4">
      {/* League filter */}
      <div className="flex items-center gap-2">
        {LEAGUES.map((league) => (
          <button
            key={league}
            type="button"
            onClick={() => setLeagueFilter(league)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
              leagueFilter === league
                ? 'bg-blue-900/40 text-blue-300'
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {league}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${leagueFilter} teams`} copy="Try a different league filter." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="rounded-2xl border border-border bg-white/[0.03] p-5 transition hover:border-accent/40 hover:bg-white/[0.05]"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-accent/70">{team.league_name}</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">{team.name}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                {team.player_count} tracked {team.player_count === 1 ? 'player' : 'players'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
