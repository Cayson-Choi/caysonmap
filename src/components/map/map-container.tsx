'use client';

import { useCallback } from 'react';
import { useMapStore } from '@/stores/map-store';
import NaverMapView from './naver-map-view';
import KakaoMapView from './kakao-map-view';

export default function MapContainer() {
  const { mode, center, zoom, setCenter, setZoom } = useMapStore();

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

  if (mode === 'naver') {
    return (
      <div className="w-full h-full">
        <NaverMapView center={center} zoom={zoom} />
      </div>
    );
  }

  if (mode === 'kakao') {
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

  // both 모드: 좌우 분할
  return (
    <div className="w-full h-full flex">
      <div className="w-1/2 h-full border-r border-border">
        <NaverMapView center={center} zoom={zoom} />
      </div>
      <div className="w-1/2 h-full">
        <KakaoMapView
          center={center}
          zoom={zoom}
          onCenterChanged={handleCenterChanged}
          onZoomChanged={handleZoomChanged}
        />
      </div>
    </div>
  );
}
