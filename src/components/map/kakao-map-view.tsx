'use client';

import { useEffect, useRef } from 'react';
import { useKakaoMap } from '@/hooks/use-kakao-map';
import type { Bookmark } from '@/hooks/use-bookmarks';

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

function createBookmarkMarkerSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16 2 20.09 10.26 29 11.27 22.5 17.14 24.18 26.02 16 21.77 7.82 26.02 9.5 17.14 3 11.27 11.91 10.26 16 2" fill="#f59e0b" stroke="white" stroke-width="1.5"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

interface KakaoMapViewProps {
  center: { lat: number; lng: number };
  selectedLocation: { lat: number; lng: number } | null;
  zoom: number;
  radius: number;
  activeCategories: string[];
  searchVersion: number;
  bookmarks?: Bookmark[];
  onCenterChanged?: (lat: number, lng: number) => void;
  onZoomChanged?: (zoom: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onAddBookmark?: (name: string, lat: number, lng: number, address: string) => void;
  onRemoveBookmark?: (id: string) => void;
}

export default function KakaoMapView({
  center,
  selectedLocation,
  zoom,
  radius,
  activeCategories,
  searchVersion,
  bookmarks,
  onCenterChanged,
  onZoomChanged,
  onMapClick,
  onAddBookmark,
  onRemoveBookmark,
}: KakaoMapViewProps) {
  const { mapRef, mapInstanceRef, updateCenter, updateZoom, ready, error } = useKakaoMap({
    center, zoom, onCenterChanged, onZoomChanged, onMapClick,
  });

  const isInitialCenter = useRef(true);
  const markersRef = useRef<Map<string, kakao.maps.Marker[]>>(new Map());
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);
  const markerImagesRef = useRef<Map<string, kakao.maps.MarkerImage>>(new Map());
  const bookmarkMarkersRef = useRef<kakao.maps.Marker[]>([]);

  // Global callback for bookmark deletion from InfoWindow
  const removeBookmarkRef = useRef(onRemoveBookmark);
  removeBookmarkRef.current = onRemoveBookmark;

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__removeBookmark = (id: string) => {
      removeBookmarkRef.current?.(id);
      infoWindowRef.current?.close();
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__removeBookmark;
    };
  }, []);

  // Sync center from store → map
  useEffect(() => {
    if (isInitialCenter.current) { isInitialCenter.current = false; return; }
    if (ready) updateCenter(center.lat, center.lng);
  }, [center.lat, center.lng, ready, updateCenter]);

  // Sync zoom
  useEffect(() => {
    if (ready) updateZoom(zoom);
  }, [zoom, ready, updateZoom]);

  // Circle overlay — follows selectedLocation, not center
  useEffect(() => {
    if (!ready || !mapInstanceRef.current || !selectedLocation) return;
    const map = mapInstanceRef.current;
    const circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng),
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
  }, [selectedLocation, radius, ready, mapInstanceRef]);

  // Global callback for bookmark add from InfoWindow
  const addBookmarkRef = useRef(onAddBookmark);
  addBookmarkRef.current = onAddBookmark;

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__addBookmark = (name: string, lat: number, lng: number, address: string) => {
      addBookmarkRef.current?.(name, lat, lng, address);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__addBookmark;
    };
  }, []);

  // Category markers
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Cleanup previous markers
    markersRef.current.forEach((markers) => markers.forEach((m) => m.setMap(null)));
    markersRef.current.clear();
    infoWindowRef.current?.close();

    if (activeCategories.length === 0 || !selectedLocation) return;

    const searchCenter = new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng);
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
              const addr = place.road_address_name || place.address_name;
              const escapedName = place.place_name.replace(/'/g, "\\'");
              const escapedAddr = addr.replace(/'/g, "\\'");
              const content = `<div style="padding:8px 12px;min-width:180px;max-width:260px;">
                <a href="${place.place_url}" target="_blank" rel="noopener noreferrer" style="font-size:14px;font-weight:600;color:#2563eb;text-decoration:none;">${place.place_name}</a>
                <p style="font-size:12px;color:#666;margin:4px 0 0;">${addr}</p>
                ${place.phone ? `<p style="font-size:12px;color:#666;margin:2px 0 0;">${place.phone}</p>` : ''}
                ${onAddBookmark ? `<button onclick="window.__addBookmark('${escapedName}',${place.y},${place.x},'${escapedAddr}')" style="margin-top:6px;padding:2px 8px;font-size:12px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;">&#9733; 즐겨찾기</button>` : ''}
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

  // Bookmark markers
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Cleanup previous bookmark markers
    bookmarkMarkersRef.current.forEach((m) => m.setMap(null));
    bookmarkMarkersRef.current = [];

    if (!bookmarks || bookmarks.length === 0) return;

    const bookmarkImage = new kakao.maps.MarkerImage(
      createBookmarkMarkerSvg(),
      new kakao.maps.Size(32, 32),
      { offset: new kakao.maps.Point(16, 16) },
    );

    bookmarks.forEach((bm) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(bm.lat, bm.lng),
        map,
        image: bookmarkImage,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        infoWindowRef.current?.close();
        const content = `<div style="padding:8px 12px;min-width:180px;max-width:260px;">
          <p style="font-size:14px;font-weight:600;color:#f59e0b;margin:0;">&#9733; ${bm.name}</p>
          ${bm.address ? `<p style="font-size:12px;color:#666;margin:4px 0 0;">${bm.address}</p>` : ''}
          <button onclick="window.__removeBookmark('${bm.id}')" style="margin-top:6px;padding:2px 8px;font-size:12px;background:#ef4444;color:white;border:none;border-radius:4px;cursor:pointer;">삭제</button>
        </div>`;
        const iw = new kakao.maps.InfoWindow({ content, removable: true });
        iw.open(map, marker);
        infoWindowRef.current = iw;
      });

      bookmarkMarkersRef.current.push(marker);
    });

    return () => {
      bookmarkMarkersRef.current.forEach((m) => m.setMap(null));
      bookmarkMarkersRef.current = [];
    };
  }, [bookmarks, ready, mapInstanceRef]);

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
