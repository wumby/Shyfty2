import { create } from 'zustand';

import { api } from '../services/api';
import type { Player, ReactionType, Signal, SignalFilters, Team } from '../types';

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
  reactToSignal: (signalId: number, reactionType: ReactionType) => Promise<void>;
}

function applyReactionChange(signal: Signal, reactionType: ReactionType) {
  const nextSummary = { ...signal.reaction_summary };
  if (signal.user_reaction) {
    nextSummary[signal.user_reaction] = Math.max(0, nextSummary[signal.user_reaction] - 1);
  }
  const nextReaction = signal.user_reaction === reactionType ? null : reactionType;
  if (nextReaction) {
    nextSummary[nextReaction] += 1;
  }
  return {
    ...signal,
    user_reaction: nextReaction,
    reaction_summary: nextSummary,
  };
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
  reactToSignal: async (signalId, reactionType) => {
    const previousSignals = get().signals;
    const target = previousSignals.find((signal) => signal.id === signalId);
    if (!target) return;

    const optimisticSignals = previousSignals.map((signal) =>
      signal.id === signalId ? applyReactionChange(signal, reactionType) : signal,
    );
    set({ signals: optimisticSignals });

    try {
      if (target.user_reaction === reactionType) {
        await api.clearSignalReaction(signalId);
      } else {
        await api.setSignalReaction(signalId, reactionType);
      }
    } catch (error) {
      set({
        signals: previousSignals,
        error: error instanceof Error ? error.message : 'Reaction update failed.',
      });
      throw error;
    }
  },
}));
