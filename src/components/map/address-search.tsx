'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';

export default function AddressSearch() {
  const t = useTranslations('map');
  const { setCenter, triggerSearch } = useMapStore();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    if (typeof kakao === 'undefined' || !kakao.maps?.services) return;

    const places = new kakao.maps.services.Places();
    places.keywordSearch(query.trim(), (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        setCenter(parseFloat(result[0].y), parseFloat(result[0].x));
        triggerSearch();
      }
    });
  }, [query, setCenter, triggerSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex bg-card border border-border rounded-lg shadow-lg overflow-hidden">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        className="w-72 px-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-muted"
      />
      <button
        onClick={handleSearch}
        className="px-3 text-muted hover:text-foreground transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}
