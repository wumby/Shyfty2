import type { Signal } from '../types';
import {
  formatDelta,
  formatEventDate,
  formatMovementLabel,
  formatRelativeTime,
  formatSignalLabel,
  getImportanceScore,
  getMetricLabel,
  getImportance,
} from '../lib/signalFormat';

const toneMap: Record<Signal['signal_type'], string> = {
  SPIKE: 'border-emerald-400/40 bg-emerald-400/12 text-emerald-200',
  DROP: 'border-rose-400/40 bg-rose-400/12 text-rose-200',
  SHIFT: 'border-amber-400/40 bg-amber-400/12 text-amber-200',
  CONSISTENCY: 'border-cyan-400/40 bg-cyan-400/12 text-cyan-200',
  OUTLIER: 'border-fuchsia-400/40 bg-fuchsia-400/12 text-fuchsia-200',
};

const importanceTone: Record<'High' | 'Medium' | 'Watch', string> = {
  High: 'text-rose-200',
  Medium: 'text-amber-200',
  Watch: 'text-slate-300',
};

export function SignalCard({ signal }: { signal: Signal }) {
  const importance = getImportance(signal);
  const importanceScore = getImportanceScore(signal);

  return (
    <article className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-white/15">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${toneMap[signal.signal_type]}`}>
                {formatSignalLabel(signal.signal_type)}
              </span>
              <span className={`text-[11px] font-medium uppercase tracking-[0.22em] ${importanceTone[importance]}`}>
                {importance} importance
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">{signal.player_name}</h3>
              <div className="mt-1 text-sm text-slate-400">
                {signal.team_name} · {signal.league_name}
              </div>
            </div>
          </div>
          <div className="min-w-[180px] rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-left sm:text-right">
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{getMetricLabel(signal)}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatDelta(signal)}</div>
            <div className="mt-1 text-sm text-slate-400">{formatMovementLabel(signal)}</div>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/8 bg-black/15 p-4 sm:grid-cols-[1.2fr,0.9fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Signal Insight</div>
            <p className="mt-2 text-sm leading-6 text-slate-100">{signal.explanation}</p>
          </div>
          <div className="grid gap-3 sm:justify-items-end">
            <div className="grid w-full gap-2 sm:max-w-[220px]">
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Current</span>
                <span className="text-base font-semibold text-white">{signal.current_value.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Baseline</span>
                <span className="text-base font-semibold text-slate-200">{signal.baseline_value.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span>{signal.baseline_window ?? 'Recent baseline'}</span>
          {signal.event_date ? <span>Game {formatEventDate(signal.event_date)}</span> : null}
          <span>Importance {importanceScore.toFixed(0)}</span>
          <span>Z-score {signal.z_score.toFixed(2)}</span>
          <span>{formatRelativeTime(signal.created_at)}</span>
          <span>{new Date(signal.created_at).toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}
