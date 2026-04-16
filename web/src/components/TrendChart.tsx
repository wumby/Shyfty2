import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { MetricSeriesPoint } from '../types';

interface TrendChartProps {
  data: MetricSeriesPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const normalized = data.map((point) => ({
    game_date: new Date(point.game_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    ...point.metrics,
  }));

  const firstMetric = Object.keys(data[0]?.metrics ?? {})[0];

  if (!firstMetric) {
    return null;
  }

  return (
    <div className="h-72 rounded-3xl border border-border bg-white/[0.03] p-4">
      <div className="mb-4 text-sm text-muted">Recent {firstMetric.replace('_', ' ')} trend</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalized}>
          <CartesianGrid stroke="#18304d" strokeDasharray="4 4" />
          <XAxis dataKey="game_date" stroke="#8aa3c1" />
          <YAxis stroke="#8aa3c1" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d1b2f',
              borderColor: '#18304d',
              borderRadius: '16px',
            }}
          />
          <Line dataKey={firstMetric} type="monotone" stroke="#49a6ff" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

