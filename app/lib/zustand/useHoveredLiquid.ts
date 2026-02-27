import { create } from "zustand"

interface State {
  value: string | null;
  setValue: (
    value: string | null,
    offsetX: number | null,
    width: number | null,
    offsetY: number | null,
    height: number | null,
  ) => void;
  offsetX: number | null;
  width: number | null;
  offsetY: number | null;
  height: number | null;
  fromNote: boolean;
  setFromNote: (fromNote: boolean) => void;
}

export const useHoveredLiquid = create<State>((set) => ({
  value: null,
  setValue: (
    value: string | null,
    offsetX: number | null,
    width: number | null,
    offsetY: number | null,
    height: number | null,
  ) => set({
    value: value,
    offsetX: offsetX,
    width: width,
    offsetY: offsetY,
    height: height,
  }),
  offsetX: null,
  width: null,
  offsetY: null,
  height: null,
  fromNote: false,
  setFromNote: (fromNote: boolean) => set({fromNote: true}),
}));