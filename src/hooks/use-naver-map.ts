'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseNaverMapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  onCenterChanged?: (lat: number, lng: number) => void;
  onZoomChanged?: (zoom: number) => void;
}

function waitForNaverMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof naver !== 'undefined' && naver.maps) {
      resolve();
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (typeof naver !== 'undefined' && naver.maps) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Naver Maps SDK load timeout'));
      }
    }, 100);
  });
}

export function useNaverMap({ center, zoom, onCenterChanged, onZoomChanged }: UseNaverMapOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const isExternalUpdate = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCenter = useCallback(
    (lat: number, lng: number) => {
      if (mapInstanceRef.current) {
        isExternalUpdate.current = true;
        mapInstanceRef.current.setCenter(new naver.maps.LatLng(lat, lng));
        setTimeout(() => {
          isExternalUpdate.current = false;
        }, 100);
      }
    },
    [],
  );

  const updateZoom = useCallback((z: number) => {
    if (mapInstanceRef.current) {
      isExternalUpdate.current = true;
      mapInstanceRef.current.setZoom(z);
      setTimeout(() => {
        isExternalUpdate.current = false;
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    let destroyed = false;

    waitForNaverMaps()
      .then(() => {
        if (destroyed || !mapRef.current) return;

        console.log('[NaverMap] SDK loaded, creating map...');
        console.log('[NaverMap] Current URL:', window.location.href);

        const map = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(center.lat, center.lng),
          zoom,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
          },
        });

        mapInstanceRef.current = map;
        setReady(true);

        naver.maps.Event.addListener(map, 'center_changed', () => {
          if (isExternalUpdate.current) return;
          const c = map.getCenter();
          onCenterChanged?.(c.lat(), c.lng());
        });

        naver.maps.Event.addListener(map, 'zoom_changed', () => {
          if (isExternalUpdate.current) return;
          onZoomChanged?.(map.getZoom());
        });
      })
      .catch((err) => {
        console.error('[NaverMap] SDK load failed:', err);
        if (!destroyed) setError(err.message || 'SDK 로딩 실패');
      });

    return () => {
      destroyed = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapRef, updateCenter, updateZoom, ready, error };
}
