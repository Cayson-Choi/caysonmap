import { create } from 'zustand';

interface MapState {
  center: { lat: number; lng: number };
  selectedLocation: { lat: number; lng: number } | null;
  zoom: number;
  radius: number;
  activeCategories: string[];
  searchVersion: number;
  setCenter: (lat: number, lng: number) => void;
  setSelectedLocation: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  setRadius: (radius: number) => void;
  toggleCategory: (code: string) => void;
  triggerSearch: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 37.5665, lng: 126.978 }, // 서울 시청
  selectedLocation: null,
  zoom: 13,
  radius: 1000,
  activeCategories: [],
  searchVersion: 0,
  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setSelectedLocation: (lat, lng) => set({ selectedLocation: { lat, lng } }),
  setZoom: (zoom) => set({ zoom }),
  setRadius: (radius) => set((state) => ({ radius, searchVersion: state.searchVersion + 1 })),
  toggleCategory: (code) =>
    set((state) => ({
      activeCategories: state.activeCategories.includes(code)
        ? state.activeCategories.filter((c) => c !== code)
        : [...state.activeCategories, code],
    })),
  triggerSearch: () => set((state) => ({ searchVersion: state.searchVersion + 1 })),
}));
