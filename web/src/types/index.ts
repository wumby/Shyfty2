export type SignalType = 'SPIKE' | 'DROP' | 'SHIFT' | 'CONSISTENCY' | 'OUTLIER';

export interface Signal {
  id: number;
  player_id: number;
  player_name: string;
  team_name: string;
  league_name: string;
  signal_type: SignalType;
  metric_name: string;
  current_value: number;
  baseline_value: number;
  z_score: number;
  explanation: string;
  importance?: number;
  baseline_window?: string;
  event_date?: string;
  movement_pct: number | null;
  metric_label?: string;
  trend_direction?: 'up' | 'down' | 'flat';
  summary_template?: string;
  summary_template_inputs?: {
    current_value: number;
    baseline_value: number;
    movement_pct: number | null;
    baseline_window: string;
    trend_direction: 'up' | 'down' | 'flat';
  };
  created_at: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  team_name: string;
  league_name: string;
}

export interface PlayerDetail extends Player {
  signal_count: number;
}

export interface Team {
  id: number;
  name: string;
  league_name: string;
  player_count: number;
}

export interface MetricSeriesPoint {
  game_date: string;
  metrics: Record<string, number>;
}

export interface SignalFilters {
  league?: string;
  signal_type?: string;
}
