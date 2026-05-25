import { create } from 'zustand'
import { Place } from '@/app/lib/type'

interface PlaceListStore {
  places: Place[];
  setPlaces: (list: Place[]) => void;
  clearPlaces: () => void;
}

export const usePlaceList = create<PlaceListStore>((set) => ({
  places: [],
  setPlaces: (list) => set({ places: list }),
  clearPlaces: () => set({ places: [] }),
}));