import { create } from "zustand"

interface State {
  title: string | null;
  id: string | null;
  tooltip?: boolean;
  setId: (title: string | null, id: string | null, tooltip?: boolean) => void;
}

export const useHoveredLink = create<State>((set) => ({
  title: null,
  id: null,
  tooltip: true,
  setId: (title: string | null, id: string | null, tooltip?: boolean) => set({ title: title, id: id, tooltip: tooltip}),
}));