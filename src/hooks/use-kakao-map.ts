'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseKakaoMapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  onCenterChanged?: (lat: number, lng: number) => void;
  onZoomChanged?: (zoom: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

function zoomToKakaoLevel(zoom: number): number {
  return Math.max(1, Math.min(14, 21 - zoom));
}

function kakaoLevelToZoom(kakaoLevel: number): number {
  return Math.max(1, Math.min(21, 21 - kakaoLevel));
}

function waitForKakaoMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const tryLoad = () => {
      try {
        kakao.maps.load(() => resolve());
      } catch {
        reject(new Error('Kakao Maps SDK 초기화 실패'));
      }
    };

    if (typeof kakao !== 'undefined' && kakao.maps) {
      tryLoad();
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (typeof kakao !== 'undefined' && kakao.maps) {
        clearInterval(interval);
        tryLoad();
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Kakao Maps SDK 로딩 시간 초과'));
      }
    }, 100);
  });
}

export function useKakaoMap({ center, zoom, onCenterChanged, onZoomChanged, onMapClick }: UseKakaoMapOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const isExternalUpdate = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCenter = useCallback((lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      isExternalUpdate.current = true;
      mapInstanceRef.current.setCenter(new kakao.maps.LatLng(lat, lng));
      setTimeout(() => { isExternalUpdate.current = false; }, 100);
    }
  }, []);

  const updateZoom = useCallback((zoom: number) => {
    if (mapInstanceRef.current) {
      isExternalUpdate.current = true;
      mapInstanceRef.current.setLevel(zoomToKakaoLevel(zoom));
      setTimeout(() => { isExternalUpdate.current = false; }, 100);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    let destroyed = false;

    waitForKakaoMaps()
      .then(() => {
        if (destroyed || !mapRef.current) return;
        try {
          const map = new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(center.lat, center.lng),
            level: zoomToKakaoLevel(zoom),
          });

          mapInstanceRef.current = map;
          setReady(true);

          kakao.maps.event.addListener(map, 'center_changed', () => {
            if (isExternalUpdate.current) return;
            const c = map.getCenter();
            onCenterChanged?.(c.getLat(), c.getLng());
          });

          kakao.maps.event.addListener(map, 'zoom_changed', () => {
            if (isExternalUpdate.current) return;
            onZoomChanged?.(kakaoLevelToZoom(map.getLevel()));
          });

          kakao.maps.event.addListener(map, 'click', (...args: unknown[]) => {
            const mouseEvent = args[0] as kakao.maps.event.MouseEvent;
            onMapClick?.(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());
          });
        } catch (err) {
          if (!destroyed) setError(err instanceof Error ? err.message : '지도 초기화 실패');
        }
      })
      .catch((err) => {
        if (!destroyed) setError(err.message || 'SDK 로딩 실패');
      });

    return () => {
      destroyed = true;
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapRef, mapInstanceRef, updateCenter, updateZoom, ready, error };
}
