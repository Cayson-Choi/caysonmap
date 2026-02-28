import { create } from 'zustand';

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 37.5665, lng: 126.978 }, // 서울 시청
  zoom: 13,
  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setZoom: (zoom) => set({ zoom }),
}));
