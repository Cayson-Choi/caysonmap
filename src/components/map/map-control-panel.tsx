'use client';

import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';

const CATEGORIES = [
  { code: 'FD6', color: '#ef4444' },
  { code: 'CE7', color: '#3b82f6' },
  { code: 'CS2', color: '#6366f1' },
  { code: 'MT1', color: '#0ea5e9' },
  { code: 'HP8', color: '#6b7280' },
  { code: 'PM9', color: '#f43f5e' },
  { code: 'AC5', color: '#ec4899' },
  { code: 'SC4', color: '#22c55e' },
  { code: 'AD5', color: '#0284c7' },
  { code: 'BK9', color: '#10b981' },
  { code: 'PS3', color: '#f472b6' },
  { code: 'PK6', color: '#06b6d4' },
  { code: 'OL7', color: '#9ca3af' },
  { code: 'SW8', color: '#2563eb' },
  { code: 'CT1', color: '#a855f7' },
  { code: 'AG2', color: '#84cc16' },
  { code: 'PO3', color: '#78716c' },
  { code: 'AT4', color: '#f97316' },
] as const;

export default function MapControlPanel() {
  const t = useTranslations('map');
  const { radius, activeCategories, setSelectedLocation, setRadius, toggleCategory, triggerSearch } = useMapStore();

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setSelectedLocation(pos.coords.latitude, pos.coords.longitude);
      triggerSearch();
    });
  };

  const formatRadius = (r: number) => (r >= 1000 ? `${(r / 1000).toFixed(1)}km` : `${r}m`);

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg w-52 max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* My Location */}
      <button
        onClick={handleMyLocation}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium hover:bg-border transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
        {t('currentLocation')}
      </button>

      <div className="border-t border-border" />

      {/* Radius */}
      <div className="px-4 py-3">
        <div className="text-sm font-medium mb-2">{t('radius')}: {formatRadius(radius)}</div>
        <input
          type="range"
          min={100}
          max={3000}
          step={100}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="border-t border-border" />

      {/* Layers */}
      <div className="px-4 py-3">
        <div className="text-sm font-medium mb-3">{t('layers')}</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {CATEGORIES.map(({ code, color }) => {
            const isActive = activeCategories.includes(code);
            return (
              <button
                key={code}
                onClick={() => toggleCategory(code)}
                className={`flex items-center gap-1.5 text-xs py-1 rounded transition-colors ${
                  isActive ? 'font-semibold' : 'text-muted hover:text-foreground'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border-2 shrink-0"
                  style={{
                    borderColor: color,
                    backgroundColor: isActive ? color : 'transparent',
                  }}
                />
                {t(`categories.${code}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
