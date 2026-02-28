'use client';

import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';
import type { MapMode } from '@/types';

export default function MapModeToggle() {
  const t = useTranslations('map');
  const { mode, setMode } = useMapStore();

  const modes: { value: MapMode; label: string }[] = [
    { value: 'naver', label: t('naver') },
    { value: 'kakao', label: t('kakao') },
    { value: 'both', label: t('both') },
  ];

  return (
    <div className="flex bg-card border border-border rounded-lg overflow-hidden">
      {modes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === value
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-border'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
