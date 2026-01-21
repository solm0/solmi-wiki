import { create } from "zustand";
import { Playlist } from "../type";

type PlayerState = {
  playlist: Playlist | null;
  songIdx: number | null;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  seeking: boolean;

  setPlaylist: (p: Playlist) => void;
  setSongIdx: (s: number) => void;
  setReady: () => void;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setSeeking: (s: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  playlist: null, 
  songIdx: null,
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  seeking: false,

  setPlaylist: (p) => set({ playlist: p }),
  setSongIdx: (s) => set({ songIdx: s }),
  setReady: () => set({ isReady: true }),
  setPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setSeeking: (s) => set({ seeking: s }),
}))