import { create } from 'zustand';

import { api } from '../services/api';
import type { Player, Signal, SignalFilters, Team } from '../types';

interface SignalStore {
  filters: SignalFilters;
  signals: Signal[];
  players: Player[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  setFilters: (filters: SignalFilters) => void;
  fetchSignals: () => Promise<void>;
  fetchPlayers: () => Promise<void>;
  fetchTeams: () => Promise<void>;
}

export const useSignalStore = create<SignalStore>((set, get) => ({
  filters: {},
  signals: [],
  players: [],
  teams: [],
  loading: false,
  error: null,
  setFilters: (filters) => set({ filters }),
  fetchSignals: async () => {
    set({ loading: true, error: null });
    try {
      const signals = await api.getSignals(get().filters);
      set({ signals, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
  fetchPlayers: async () => {
    set({ loading: true, error: null });
    try {
      const players = await api.getPlayers();
      set({ players, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const teams = await api.getTeams();
      set({ teams, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
}));

