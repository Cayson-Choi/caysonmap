'use client';

import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';

export default function MyLocationButton() {
  const t = useTranslations('map');
  const setCenter = useMapStore((s) => s.setCenter);

  const handleClick = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // 위치 권한 거부 시 무시
      },
    );
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors"
      title={t('myLocation')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    </button>
  );
}
