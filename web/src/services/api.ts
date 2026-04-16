import type { MetricSeriesPoint, Player, PlayerDetail, Signal, SignalFilters, Team } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getSignals(filters: SignalFilters = {}) {
    const query = new URLSearchParams();
    if (filters.league) query.set('league', filters.league);
    if (filters.signal_type) query.set('signal_type', filters.signal_type);
    query.set('limit', '50');
    return request<Signal[]>(`/signals?${query.toString()}`);
  },
  getPlayers() {
    return request<Player[]>('/players');
  },
  getPlayer(id: string) {
    return request<PlayerDetail>(`/players/${id}`);
  },
  getPlayerSignals(id: string) {
    return request<Signal[]>(`/players/${id}/signals`);
  },
  getPlayerMetrics(id: string) {
    return request<MetricSeriesPoint[]>(`/players/${id}/metrics`);
  },
  getTeams() {
    return request<Team[]>('/teams');
  },
};

