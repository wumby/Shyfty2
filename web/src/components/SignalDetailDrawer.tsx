import { useEffect, useRef, useState } from 'react';

import { api } from '../services/api';
import type { SignalTrace } from '../types';
import { formatEventDate, formatSignalLabel, getMetricLabel } from '../lib/signalFormat';

interface Props {
  signalId: number;
  onClose: () => void;
}

export function SignalDetailDrawer({ signalId, onClose }: Props) {
  const [trace, setTrace] = useState<SignalTrace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTrace(null);
    api
      .getSignalTrace(signalId)
      .then(setTrace)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [signalId]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const signal = trace?.signal;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-slate-700/50 bg-[#0F172A] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Why this signal?</div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 transition hover:text-slate-200"
          >
            Close ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-40 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800/60" />
              <div className="h-4 w-3/4 rounded bg-slate-800/60" />
              <div className="mt-6 h-4 w-32 rounded bg-slate-800" />
              <div className="h-24 w-full rounded bg-slate-800/40" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {trace && signal && (
            <div className="space-y-6">
              {/* Signal identity */}
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-blue-400">
                  {formatSignalLabel(signal.signal_type as Parameters<typeof formatSignalLabel>[0])} · {signal.league_name}
                </div>
                <h3 className="mt-1 text-xl font-semibold text-slate-100">{signal.player_name}</h3>
                <p className="mt-0.5 text-sm text-slate-400">
                  {signal.team_name} · {getMetricLabel(signal)}
                </p>
              </div>

              {/* Explanation */}
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">Summary</div>
                <p className="text-sm leading-relaxed text-slate-300">{signal.explanation}</p>
              </div>

              {/* What triggered it */}
              {trace.rolling_metric && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">What triggered this</div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">{signal.classification_reason}</div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-slate-500">Z-Score</div>
                        <div className="mt-0.5 font-mono text-base font-semibold text-slate-100">
                          {trace.rolling_metric.z_score.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Avg</div>
                        <div className="mt-0.5 font-mono text-base font-semibold text-slate-100">
                          {trace.rolling_metric.rolling_avg.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Std Dev</div>
                        <div className="mt-0.5 font-mono text-base font-semibold text-slate-100">
                          {trace.rolling_metric.rolling_stddev.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Baseline samples */}
              {trace.baseline_samples.length > 0 && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Baseline — {signal.baseline_window}
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/60">
                          <th className="px-3 py-2 text-left text-[10px] uppercase tracking-[0.16em] text-slate-500">Game</th>
                          <th className="px-3 py-2 text-right text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            {getMetricLabel(signal)}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {trace.baseline_samples.map((sample, i) => (
                          <tr
                            key={sample.stat_id}
                            className={`border-b border-slate-800/50 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30'}`}
                          >
                            <td className="px-3 py-2 text-slate-400">{formatEventDate(sample.game_date)}</td>
                            <td className="px-3 py-2 text-right font-mono font-medium text-slate-200">
                              {sample.value.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Baseline avg</span>
                    <span className="font-mono">{signal.baseline_value.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* This game */}
              {trace.source_stat && (
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">This game</div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                    <div className="mb-2 text-xs text-slate-500">{formatEventDate(trace.source_stat.game_date)}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{getMetricLabel(signal)}</span>
                      <span className="font-mono text-lg font-semibold text-slate-100">
                        {trace.source_stat.current_value.toFixed(1)}
                      </span>
                    </div>
                    {Object.keys(trace.source_stat.raw_stats).length > 1 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3">
                        {Object.entries(trace.source_stat.raw_stats)
                          .filter(([k]) => k !== signal.metric_name)
                          .slice(0, 6)
                          .map(([key, val]) => (
                            <div key={key} className="text-center">
                              <div className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div className="mt-0.5 font-mono text-sm font-medium text-slate-300">
                                {typeof val === 'number' ? val.toFixed(1) : val}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
