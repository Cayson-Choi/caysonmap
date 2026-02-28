'use client';

import { useEffect, useRef } from 'react';
import { useKakaoMap } from '@/hooks/use-kakao-map';

const CATEGORY_COLORS: Record<string, string> = {
  FD6: '#ef4444', CE7: '#3b82f6', CS2: '#6366f1', MT1: '#0ea5e9',
  HP8: '#6b7280', PM9: '#f43f5e', AC5: '#ec4899', SC4: '#22c55e',
  AD5: '#0284c7', BK9: '#10b981', PS3: '#f472b6', PK6: '#06b6d4',
  OL7: '#9ca3af', SW8: '#2563eb', CT1: '#a855f7', AG2: '#84cc16',
  PO3: '#78716c', AT4: '#f97316',
};

function createMarkerSvg(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/><circle cx="14" cy="14" r="5" fill="white"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

interface KakaoMapViewProps {
  center: { lat: number; lng: number };
  zoom: number;
  radius: number;
  activeCategories: string[];
  searchVersion: number;
  onCenterChanged?: (lat: number, lng: number) => void;
  onZoomChanged?: (zoom: number) => void;
}

export default function KakaoMapView({
  center,
  zoom,
  radius,
  activeCategories,
  searchVersion,
  onCenterChanged,
  onZoomChanged,
}: KakaoMapViewProps) {
  const { mapRef, mapInstanceRef, updateCenter, updateZoom, ready, error } = useKakaoMap({
    center, zoom, onCenterChanged, onZoomChanged,
  });

  const isInitialCenter = useRef(true);
  const markersRef = useRef<Map<string, kakao.maps.Marker[]>>(new Map());
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const markerImagesRef = useRef<Map<string, kakao.maps.MarkerImage>>(new Map());

  // Sync center from store → map
  useEffect(() => {
    if (isInitialCenter.current) { isInitialCenter.current = false; return; }
    if (ready) updateCenter(center.lat, center.lng);
  }, [center.lat, center.lng, ready, updateCenter]);

  // Sync zoom
  useEffect(() => {
    if (ready) updateZoom(zoom);
  }, [zoom, ready, updateZoom]);

  // Circle overlay
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(center.lat, center.lng),
      radius,
      strokeWeight: 2,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.6,
      strokeStyle: 'solid',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
    });
    circle.setMap(map);
    return () => { circle.setMap(null); };
  }, [center.lat, center.lng, radius, ready, mapInstanceRef]);

  // Category markers
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Cleanup previous markers
    markersRef.current.forEach((markers) => markers.forEach((m) => m.setMap(null)));
    markersRef.current.clear();
    infoWindowRef.current?.close();

    if (activeCategories.length === 0) return;

    const searchCenter = map.getCenter();
    const places = new kakao.maps.services.Places();

    activeCategories.forEach((code) => {
      // Get or create marker image for this category
      if (!markerImagesRef.current.has(code)) {
        const color = CATEGORY_COLORS[code] || '#6b7280';
        markerImagesRef.current.set(
          code,
          new kakao.maps.MarkerImage(
            createMarkerSvg(color),
            new kakao.maps.Size(28, 40),
            { offset: new kakao.maps.Point(14, 40) },
          ),
        );
      }
      const markerImage = markerImagesRef.current.get(code)!;

      places.categorySearch(
        code,
        (result, status) => {
          if (status !== kakao.maps.services.Status.OK) return;
          const markers = result.map((place) => {
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
              map,
              image: markerImage,
            });
            kakao.maps.event.addListener(marker, 'click', () => {
              infoWindowRef.current?.close();
              const content = `<div style="padding:8px 12px;min-width:180px;max-width:260px;">
                <a href="${place.place_url}" target="_blank" rel="noopener noreferrer" style="font-size:14px;font-weight:600;color:#2563eb;text-decoration:none;">${place.place_name}</a>
                <p style="font-size:12px;color:#666;margin:4px 0 0;">${place.road_address_name || place.address_name}</p>
                ${place.phone ? `<p style="font-size:12px;color:#666;margin:2px 0 0;">${place.phone}</p>` : ''}
              </div>`;
              const iw = new kakao.maps.InfoWindow({ content, removable: true });
              iw.open(map, marker);
              infoWindowRef.current = iw;
            });
            return marker;
          });
          markersRef.current.set(code, markers);
        },
        { location: searchCenter, radius, sort: kakao.maps.services.SortBy.DISTANCE },
      );
    });

    return () => {
      markersRef.current.forEach((markers) => markers.forEach((m) => m.setMap(null)));
      markersRef.current.clear();
      infoWindowRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategories, radius, searchVersion, ready]);

  return (
    <div className="w-full h-full relative">
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
          <p className="text-muted text-sm">지도 로딩 중...</p>
        </div>
      )}
    </div>
  );
}
