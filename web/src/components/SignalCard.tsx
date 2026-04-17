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
  formatSignalSummary,
  getSignalDirection,
} from '../lib/signalFormat';

const toneMap: Record<Signal['signal_type'], string> = {
  SPIKE: 'bg-emerald-400/14 text-emerald-100 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]',
  DROP: 'bg-rose-400/14 text-rose-100 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.2)]',
  SHIFT: 'bg-amber-300/14 text-amber-100 shadow-[inset_0_0_0_1px_rgba(252,211,77,0.2)]',
  CONSISTENCY: 'bg-cyan-400/14 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]',
  OUTLIER: 'bg-fuchsia-400/14 text-fuchsia-100 shadow-[inset_0_0_0_1px_rgba(232,121,249,0.2)]',
};

const importanceTone: Record<'High' | 'Medium' | 'Watch', string> = {
  High: 'bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
  Medium: 'bg-white/[0.06] text-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
  Watch: 'bg-white/[0.045] text-slate-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
};

const cardTone: Record<'High' | 'Medium' | 'Watch', string> = {
  High: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_22px_60px_rgba(0,0,0,0.24)]',
  Medium: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_44px_rgba(0,0,0,0.2)]',
  Watch: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.024))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_40px_rgba(0,0,0,0.18)]',
};

const directionTone: Record<'positive' | 'negative' | 'neutral', {
  accent: string;
  cardGlow: string;
  rail: string;
  summary: string;
  delta: string;
  statBox: string;
}> = {
  positive: {
    accent: 'bg-emerald-300/7',
    cardGlow: 'hover:shadow-[0_22px_56px_rgba(7,23,33,0.32),0_0_0_1px_rgba(94,234,212,0.08)]',
    rail: 'from-emerald-300/55 to-teal-300/15',
    summary: 'text-emerald-50',
    delta: 'text-emerald-200',
    statBox: 'bg-emerald-300/[0.045] shadow-[inset_0_0_0_1px_rgba(110,231,183,0.08)]',
  },
  negative: {
    accent: 'bg-orange-300/7',
    cardGlow: 'hover:shadow-[0_22px_56px_rgba(24,14,14,0.34),0_0_0_1px_rgba(251,146,60,0.08)]',
    rail: 'from-rose-300/55 to-orange-300/16',
    summary: 'text-rose-50',
    delta: 'text-orange-200',
    statBox: 'bg-orange-300/[0.045] shadow-[inset_0_0_0_1px_rgba(251,146,60,0.08)]',
  },
  neutral: {
    accent: 'bg-slate-200/5',
    cardGlow: 'hover:shadow-[0_20px_52px_rgba(6,11,20,0.32),0_0_0_1px_rgba(148,163,184,0.06)]',
    rail: 'from-sky-200/38 to-slate-300/14',
    summary: 'text-sky-50',
    delta: 'text-sky-200',
    statBox: 'bg-sky-200/[0.04] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.07)]',
  },
};

const importanceBadgeTone: Record<'High' | 'Medium' | 'Watch', string> = {
  High: 'bg-white/[0.12] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),0_0_24px_rgba(73,166,255,0.08)]',
  Medium: 'bg-white/[0.07] text-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
  Watch: 'bg-white/[0.045] text-slate-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
};

export function SignalCard({ signal }: { signal: Signal }) {
  const importance = getImportance(signal);
  const importanceScore = getImportanceScore(signal);
  const summary = formatSignalSummary(signal);
  const direction = getSignalDirection(signal);
  const directionStyles = directionTone[direction];

  return (
    <article className={`group rounded-[28px] p-[1px] transition duration-200 hover:-translate-y-1 ${importance === 'High' ? 'bg-[linear-gradient(180deg,rgba(73,166,255,0.28),rgba(255,255,255,0.05))]' : 'bg-white/[0.06]'}`}>
      <div className={`relative overflow-hidden rounded-[27px] px-5 py-6 sm:px-6 ${cardTone[importance]} ${directionStyles.cardGlow}`}>
        <div className={`pointer-events-none absolute inset-y-5 left-0 w-1 rounded-r-full bg-gradient-to-b ${directionStyles.rail} ${importance === 'Watch' ? 'opacity-55' : 'opacity-100'}`} />
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 ${directionStyles.accent} blur-2xl`} />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${toneMap[signal.signal_type]}`}>
                  {formatSignalLabel(signal.signal_type)}
                </span>
                <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${importanceBadgeTone[importance]}`}>
                  {importance}
                </span>
              </div>
              <div>
                <h3 className="text-[28px] font-semibold tracking-[-0.04em] text-ink">{signal.player_name}</h3>
                <div className="mt-1 text-sm text-slate-300">
                  {signal.team_name} <span className="text-slate-500">•</span> {signal.league_name}
                </div>
              </div>
              <div className="max-w-3xl space-y-2.5">
                <p className={`text-[18px] font-medium leading-7 ${directionStyles.summary}`}>{summary}</p>
                <p className="text-sm leading-6 text-slate-400">{signal.explanation}</p>
              </div>
            </div>
            <div className={`grid min-w-[240px] gap-4 rounded-[22px] px-4 py-4 lg:max-w-[290px] lg:justify-items-end lg:text-right ${directionStyles.statBox}`}>
              <div className="w-full">
                <div className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{getMetricLabel(signal)}</div>
                <div className={`mt-1.5 text-[40px] font-semibold tracking-[-0.06em] ${directionStyles.delta}`}>{formatDelta(signal)}</div>
                <div className="mt-1 text-sm text-slate-300">{formatMovementLabel(signal)}</div>
              </div>
              <div className="grid w-full grid-cols-2 gap-3 text-left lg:text-right">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Current</div>
                  <div className="mt-1 text-base font-semibold text-ink">{signal.current_value.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Baseline</div>
                  <div className="mt-1 text-sm font-medium text-slate-300">{signal.baseline_value.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/6 pt-4 text-xs text-slate-500">
            <span>{signal.baseline_window ?? 'Recent baseline'}</span>
            {signal.event_date ? <span>Game {formatEventDate(signal.event_date)}</span> : null}
            <span>Importance {importanceScore.toFixed(0)}</span>
            <span>Z-score {signal.z_score.toFixed(2)}</span>
            <span>{formatRelativeTime(signal.created_at)}</span>
            <span>{new Date(signal.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
