'use client';

import { useKakaoMap } from '@/hooks/use-kakao-map';

interface KakaoMapViewProps {
  center: { lat: number; lng: number };
  zoom: number;
  onCenterChanged?: (lat: number, lng: number) => void;
  onZoomChanged?: (zoom: number) => void;
  className?: string;
}

export default function KakaoMapView({
  center,
  zoom,
  onCenterChanged,
  onZoomChanged,
  className = '',
}: KakaoMapViewProps) {
  const { mapRef, ready, error } = useKakaoMap({ center, zoom, onCenterChanged, onZoomChanged });

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div className="text-center p-4">
            <p className="text-red-500 font-medium mb-1">카카오 지도 로딩 실패</p>
            <p className="text-muted text-sm">{error}</p>
          </div>
        </div>
      )}
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <p className="text-muted text-sm">카카오 지도 로딩 중...</p>
        </div>
      )}
    </div>
  );
}
