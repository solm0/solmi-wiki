import { create } from "zustand";

interface State {
  id: string | null;
  setId: (id: string | null) => void;
}

export const useClickedPlace = create<State>((set) => ({
  id: null,
  setId: (clickedId: string | null) => {
    set({ id: clickedId });
    setTimeout(() => set({ id: null }), 1000);
  },
}))