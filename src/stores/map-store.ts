import { create } from 'zustand';
import type { MapMode } from '@/types';

interface MapState {
  mode: MapMode;
  center: { lat: number; lng: number };
  zoom: number;
  setMode: (mode: MapMode) => void;
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  mode: 'naver',
  center: { lat: 37.5665, lng: 126.978 }, // 서울 시청
  zoom: 13,
  setMode: (mode) => set({ mode }),
  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setZoom: (zoom) => set({ zoom }),
}));
