'use client';

import { useCallback } from 'react';
import { useMapStore } from '@/stores/map-store';
import KakaoMapView from './kakao-map-view';

export default function MapContainer() {
  const { center, zoom, setCenter, setZoom } = useMapStore();

  const handleCenterChanged = useCallback(
    (lat: number, lng: number) => {
      setCenter(lat, lng);
    },
    [setCenter],
  );

  const handleZoomChanged = useCallback(
    (z: number) => {
      setZoom(z);
    },
    [setZoom],
  );

  return (
    <div className="w-full h-full">
      <KakaoMapView
        center={center}
        zoom={zoom}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
      />
    </div>
  );
}
