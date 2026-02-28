'use client';

import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';

export default function NaverMapLink() {
  const t = useTranslations('map');
  const { center, zoom } = useMapStore();

  const naverMapUrl = `https://map.naver.com/v5/?c=${center.lng},${center.lat},${zoom},0,0,0,dh`;

  return (
    <a
      href={naverMapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors"
    >
      {t('openInNaver')}
    </a>
  );
}
