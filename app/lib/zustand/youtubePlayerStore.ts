import { create } from "zustand";

type PlayerState = {
  videoId: string;

  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  setReady: () => void;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  videoId: '',
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  setReady: () => set({ isReady: true }),
  setPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
}))