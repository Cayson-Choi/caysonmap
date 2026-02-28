'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';
import type { Bookmark } from '@/hooks/use-bookmarks';
import KakaoMapView from './kakao-map-view';

interface MapContainerProps {
  bookmarks?: Bookmark[];
  onAddBookmark?: (name: string, lat: number, lng: number, address: string) => void;
  onRemoveBookmark?: (id: string) => void;
}

interface ContextMenu {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export default function MapContainer({ bookmarks, onAddBookmark, onRemoveBookmark }: MapContainerProps) {
  const t = useTranslations('map');
  const { center, selectedLocation, zoom, radius, activeCategories, searchVersion, setCenter, setSelectedLocation, setZoom, triggerSearch } = useMapStore();
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [bookmarkName, setBookmarkName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const pendingPos = useRef<{ lat: number; lng: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      setSelectedLocation(lat, lng);
      triggerSearch();
      setContextMenu(null);
      setShowNameInput(false);
    },
    [setSelectedLocation, triggerSearch],
  );

  const handleRightClick = useCallback((lat: number, lng: number) => {
    // Convert lat/lng to pixel position on screen
    setContextMenu(null);
    setShowNameInput(false);
    // Use a small delay to get proper mouse position via the native event
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // We store lat/lng and will position the menu using a mousedown trick
    pendingPos.current = { lat, lng };
  }, []);

  // Use native contextmenu event to get mouse pixel position
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      e.preventDefault();
      if (pendingPos.current) {
        const rect = el.getBoundingClientRect();
        setContextMenu({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          lat: pendingPos.current.lat,
          lng: pendingPos.current.lng,
        });
        pendingPos.current = null;
      }
    };

    el.addEventListener('contextmenu', handler);
    return () => el.removeEventListener('contextmenu', handler);
  }, []);

  const handleBookmarkFromContext = () => {
    if (!contextMenu) return;
    setShowNameInput(true);
    setBookmarkName('');
  };

  const handleConfirmBookmark = () => {
    if (!contextMenu || !bookmarkName.trim()) return;
    onAddBookmark?.(bookmarkName.trim(), contextMenu.lat, contextMenu.lng, `${contextMenu.lat.toFixed(6)}, ${contextMenu.lng.toFixed(6)}`);
    setContextMenu(null);
    setShowNameInput(false);
    setBookmarkName('');
  };

  // Close context menu on outside click or map interaction
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => { setContextMenu(null); setShowNameInput(false); };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [contextMenu]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <KakaoMapView
        center={center}
        selectedLocation={selectedLocation}
        zoom={zoom}
        radius={radius}
        activeCategories={activeCategories}
        searchVersion={searchVersion}
        bookmarks={bookmarks}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
        onMapClick={handleMapClick}
        onRightClick={handleRightClick}
        onAddBookmark={onAddBookmark}
        onRemoveBookmark={onRemoveBookmark}
      />

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {!showNameInput ? (
            <button
              onClick={handleBookmarkFromContext}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {t('addBookmark')}
            </button>
          ) : (
            <div className="p-3 space-y-2">
              <p className="text-xs font-medium text-muted">{t('bookmarkName')}</p>
              <input
                type="text"
                value={bookmarkName}
                onChange={(e) => setBookmarkName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmBookmark(); }}
                placeholder={t('bookmarkName')}
                className="w-48 px-3 py-1.5 text-sm border border-border rounded bg-background outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmBookmark}
                  disabled={!bookmarkName.trim()}
                  className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded font-medium disabled:opacity-50"
                >
                  {t('addBookmark')}
                </button>
                <button
                  onClick={() => { setContextMenu(null); setShowNameInput(false); }}
                  className="px-3 py-1.5 text-xs border border-border rounded"
                >
                  {t('removeBookmark') === '즐겨찾기 삭제' ? '취소' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
