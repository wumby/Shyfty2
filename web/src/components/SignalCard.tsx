import type { Signal } from '../types';
import type { ReactionType } from '../types';
import {
  formatDelta,
  formatEventDate,
  formatRelativeTime,
  formatSignalLabel,
  getImportanceScore,
  getMetricLabel,
  getImportance,
  formatSignalSummary,
  getSignalDirection,
} from '../lib/signalFormat';
import { useAuthStore } from '../store/useAuthStore';
import { useSignalStore } from '../store/useSignalStore';

const toneMap: Record<Signal['signal_type'], string> = {
  SPIKE: 'bg-green-950/60 text-green-400 border border-green-800/50',
  DROP: 'bg-red-950/60 text-red-400 border border-red-800/50',
  SHIFT: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
  CONSISTENCY: 'bg-blue-950/60 text-blue-400 border border-blue-800/50',
  OUTLIER: 'bg-purple-950/60 text-purple-400 border border-purple-800/50',
};

const directionTone: Record<'positive' | 'negative' | 'neutral', {
  rowGlow: string;
  rail: string;
  summary: string;
  delta: string;
  meta: string;
  context: string;
}> = {
  positive: {
    rowGlow: 'hover:bg-slate-800/60',
    rail: 'bg-green-500',
    summary: 'text-slate-100',
    delta: 'text-green-400',
    meta: 'text-slate-400',
    context: 'text-slate-500',
  },
  negative: {
    rowGlow: 'hover:bg-slate-800/60',
    rail: 'bg-red-500',
    summary: 'text-slate-100',
    delta: 'text-red-400',
    meta: 'text-slate-400',
    context: 'text-slate-500',
  },
  neutral: {
    rowGlow: 'hover:bg-slate-800/60',
    rail: 'bg-slate-500',
    summary: 'text-slate-100',
    delta: 'text-slate-300',
    meta: 'text-slate-400',
    context: 'text-slate-500',
  },
};

const importanceBadgeTone: Record<'High' | 'Medium' | 'Watch', string> = {
  High: 'bg-blue-950/60 text-blue-400 border border-blue-800/50',
  Medium: 'bg-slate-800/60 text-slate-400 border border-slate-700/50',
  Watch: 'bg-slate-900/60 text-slate-500 border border-slate-700/30',
};

const reactionMeta: Array<{ type: ReactionType; label: string }> = [
  { type: 'strong', label: 'Strong' },
  { type: 'agree', label: 'Agree' },
  { type: 'risky', label: 'Risky' },
];

export function SignalCard({ signal, onOpenDetail }: { signal: Signal; onOpenDetail?: (id: number) => void }) {
  const importance = getImportance(signal);
  const importanceScore = getImportanceScore(signal);
  const summary = formatSignalSummary(signal);
  const direction = getSignalDirection(signal);
  const directionStyles = directionTone[direction];
  const currentUser = useAuthStore((state) => state.currentUser);
  const openAuth = useAuthStore((state) => state.openAuth);
  const reactToSignal = useSignalStore((state) => state.reactToSignal);

  async function handleReactionClick(reactionType: ReactionType) {
    if (!currentUser) {
      openAuth('signin');
      return;
    }
    try {
      await reactToSignal(signal.id, reactionType);
    } catch {
      // store handles rollback + error state
    }
  }

  return (
    <article
      className={`group relative grid grid-cols-[minmax(0,1fr),112px] gap-3 border-b border-slate-800 bg-transparent px-3 py-3 transition duration-150 sm:grid-cols-[minmax(0,1.75fr),132px] sm:px-4 sm:py-3 ${directionStyles.rowGlow}`}
    >
      <div className={`absolute inset-y-2.5 left-0 w-[3px] rounded-full ${directionStyles.rail} ${importance === 'Watch' ? 'opacity-35' : 'opacity-75'}`} />
      <div className="min-w-0 pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${toneMap[signal.signal_type]}`}>
            {formatSignalLabel(signal.signal_type)}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${importanceBadgeTone[importance]}`}>
            {importance}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="text-[17px] font-semibold tracking-[-0.03em] text-slate-100">{signal.player_name}</h3>
          <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{getMetricLabel(signal)}</span>
        </div>
        <p className={`mt-1 text-[14px] font-medium leading-5 ${directionStyles.summary}`}>{summary}</p>
        <div className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] ${directionStyles.meta}`}>
          <span>{signal.team_name}</span>
          <span className="text-slate-700">•</span>
          <span>{signal.league_name}</span>
          {signal.event_date ? (
            <>
              <span className="text-slate-700">•</span>
              <span>{formatEventDate(signal.event_date)}</span>
            </>
          ) : null}
          <span className="text-slate-700">•</span>
          <span>Z {signal.z_score.toFixed(2)}</span>
          <span className="text-slate-700">•</span>
          <span>{formatRelativeTime(signal.created_at)}</span>
          {importance === 'High' ? (
            <>
              <span className="text-slate-700">•</span>
              <span>{importanceScore.toFixed(0)}</span>
            </>
          ) : null}
        </div>
        <div className={`mt-1 text-[11px] leading-4 ${directionStyles.context}`}>{signal.explanation}</div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {reactionMeta.map(({ type, label }) => {
            const active = signal.user_reaction === type;
            const count = signal.reaction_summary[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => void handleReactionClick(type)}
                className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.14em] transition ${
                  active
                    ? type === 'strong'
                      ? 'bg-transparent text-green-400'
                      : type === 'risky'
                        ? 'bg-transparent text-amber-400'
                        : 'bg-transparent text-blue-400'
                    : 'bg-transparent text-slate-600 hover:text-slate-400'
                }`}
              >
                {label} {count > 0 ? count : ''}
              </button>
            );
          })}
          {onOpenDetail != null && (
            <button
              type="button"
              onClick={() => onOpenDetail(signal.id)}
              className="ml-auto rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-600 transition hover:text-blue-400"
            >
              Why →
            </button>
          )}
        </div>
      </div>
      <div className="self-center justify-self-end text-right">
        <div className={`text-[25px] font-semibold tracking-tight tabular-nums ${directionStyles.delta}`}>{formatDelta(signal)}</div>
        <div className="mt-0.5 text-[11px]">
          <span className="font-medium text-slate-100">{signal.current_value.toFixed(1)}</span>
          <span className="mx-1 text-slate-700">/</span>
          <span className="text-slate-500">{signal.baseline_value.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}
