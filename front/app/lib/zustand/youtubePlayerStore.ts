import { create } from "zustand";
import { Lyric, LyricsMode, Playlist, TrackMeta } from "../type";

type PlayerState = {
  playlist: Playlist | null;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  seeking: boolean;
  playlistVideoIds: string[];
  currentPlaylistIndex: number;
  requestedPlaylistIndex: number | null;
  currentTrack: TrackMeta | null;
  lyrics: Lyric[];
  plainLyrics: string;
  lyricsMode: LyricsMode;

  setPlaylist: (playlist: Playlist) => void;
  setReady: (ready: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setSeeking: (seeking: boolean) => void;
  setPlaylistVideoIds: (videoIds: string[]) => void;
  setCurrentPlaylistIndex: (index: number) => void;
  requestPlaylistIndex: (index: number) => void;
  clearRequestedPlaylistIndex: () => void;
  setCurrentTrack: (track: TrackMeta | null) => void;
  setLyricsLoading: () => void;
  setLyrics: (payload: {
    lyrics: Lyric[];
    plainLyrics: string;
    mode: LyricsMode;
  }) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  playlist: null,
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  seeking: false,
  playlistVideoIds: [],
  currentPlaylistIndex: 0,
  requestedPlaylistIndex: null,
  currentTrack: null,
  lyrics: [],
  plainLyrics: "",
  lyricsMode: "none",

  setPlaylist: (playlist) =>
    set({
      playlist,
      isReady: false,
      currentTime: 0,
      duration: 0,
      seeking: false,
      playlistVideoIds: [],
      currentPlaylistIndex: 0,
      requestedPlaylistIndex: null,
      currentTrack: null,
      lyrics: [],
      plainLyrics: "",
      lyricsMode: "none",
    }),
  setReady: (ready) => set({ isReady: ready }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setSeeking: (seeking) => set({ seeking }),
  setPlaylistVideoIds: (videoIds) => set({ playlistVideoIds: videoIds }),
  setCurrentPlaylistIndex: (index) => set({ currentPlaylistIndex: index }),
  requestPlaylistIndex: (index) => set({ requestedPlaylistIndex: index }),
  clearRequestedPlaylistIndex: () => set({ requestedPlaylistIndex: null }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setLyricsLoading: () => set({ lyrics: [], plainLyrics: "", lyricsMode: "loading" }),
  setLyrics: ({ lyrics, plainLyrics, mode }) =>
    set({
      lyrics,
      plainLyrics,
      lyricsMode: mode,
    }),
}));
