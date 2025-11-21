'use client'

import { create } from 'zustand';

type State = {
  toggles: Record<string, boolean>;
  setToggle: (key: string, value: boolean) => void;
  initializeToggles: () => void;
};

export const useToggleStore = create<State>((set) => ({
  toggles: {
    noteInspector: false, // fallback defaults
    toolBox: true,
  },

  setToggle: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
    set((state) => ({
      toggles: {
        ...state.toggles,
        [key]: value,
      },
    }));
  },

  initializeToggles: () => {
    if (typeof window === 'undefined') return;
    set(() => ({
      toggles: {
        noteInspector: JSON.parse(localStorage.getItem('noteInspector') || 'true'),
        toolBox: JSON.parse(localStorage.getItem('toolBox') || 'true'),
      },
    }));
  },
}));