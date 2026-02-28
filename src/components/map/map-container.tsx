'use client';

import { useCallback } from 'react';
import { useMapStore } from '@/stores/map-store';
import type { Bookmark } from '@/hooks/use-bookmarks';
import KakaoMapView from './kakao-map-view';

interface MapContainerProps {
  bookmarks?: Bookmark[];
  onAddBookmark?: (name: string, lat: number, lng: number, address: string) => void;
  onRemoveBookmark?: (id: string) => void;
}

export default function MapContainer({ bookmarks, onAddBookmark, onRemoveBookmark }: MapContainerProps) {
  const { center, zoom, radius, activeCategories, searchVersion, setCenter, setZoom, triggerSearch } = useMapStore();

  const handleCenterChanged = useCallback(
    (lat: number, lng: number) => setCenter(lat, lng),
    [setCenter],
  );

  const handleZoomChanged = useCallback(
    (z: number) => setZoom(z),
    [setZoom],
  );

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setCenter(lat, lng);
      triggerSearch();
    },
    [setCenter, triggerSearch],
  );

  return (
    <div className="w-full h-full">
      <KakaoMapView
        center={center}
        zoom={zoom}
        radius={radius}
        activeCategories={activeCategories}
        searchVersion={searchVersion}
        bookmarks={bookmarks}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
        onMapClick={handleMapClick}
        onAddBookmark={onAddBookmark}
        onRemoveBookmark={onRemoveBookmark}
      />
    </div>
  );
}
