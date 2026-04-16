import type { PlayerDetail } from '../types';

export function PlayerHeader({ player }: { player: PlayerDetail }) {
  return (
    <div className="rounded-3xl border border-border bg-white/[0.03] p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-accent">{player.league_name}</div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold">{player.name}</h2>
          <p className="mt-2 text-sm text-muted">
            {player.team_name} · {player.position}
          </p>
        </div>
        <div className="rounded-2xl border border-border px-4 py-3 text-sm text-muted">
          {player.signal_count} active feed events
        </div>
      </div>
    </div>
  );
}

