import { create } from "zustand";
import { Track, PlayerState } from "@/types";

interface PlayerStore extends PlayerState {
  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleFavorite: (trackId: string) => void;
  setFavorites: (trackIds: string[]) => void;
  isFavorite: (trackId: string) => boolean;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  favorites: new Set<string>(),

  // Actions
  setCurrentTrack: (track) =>
    set({ currentTrack: track, currentTime: 0, duration: 0 }),

  setQueue: (tracks) => set({ queue: tracks }),

  addToQueue: (track) =>
    set((state) => ({
      queue: [...state.queue, track],
    })),

  removeFromQueue: (trackId) =>
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== trackId),
    })),

  clearQueue: () => set({ queue: [], currentTrack: null, isPlaying: false }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  playNext: () => {
    const state = get();
    if (!state.currentTrack || state.queue.length === 0) return;

    const currentIndex = state.queue.findIndex(
      (t) => t.id === state.currentTrack?.id
    );
    const nextIndex = (currentIndex + 1) % state.queue.length;
    set({ currentTrack: state.queue[nextIndex], currentTime: 0 });
  },

  playPrevious: () => {
    const state = get();
    if (!state.currentTrack || state.queue.length === 0) return;

    const currentIndex = state.queue.findIndex(
      (t) => t.id === state.currentTrack?.id
    );
    const prevIndex = currentIndex === 0 ? state.queue.length - 1 : currentIndex - 1;
    set({ currentTrack: state.queue[prevIndex], currentTime: 0 });
  },

  toggleFavorite: (trackId) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      return { favorites: newFavorites };
    }),

  setFavorites: (trackIds) => set({ favorites: new Set(trackIds) }),

  isFavorite: (trackId) => {
    const state = get();
    return state.favorites.has(trackId);
  },
}));
