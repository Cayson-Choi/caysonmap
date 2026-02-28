'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useMapStore } from '@/stores/map-store';
import type { Bookmark } from '@/hooks/use-bookmarks';

interface PlaceResult {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface AddressSearchProps {
  bookmarks?: Bookmark[];
  onAddBookmark?: (name: string, lat: number, lng: number, address: string) => void;
  onRemoveBookmark?: (id: string) => void;
}

export default function AddressSearch({ bookmarks, onAddBookmark, onRemoveBookmark }: AddressSearchProps) {
  const t = useTranslations('map');
  const { setCenter, setSelectedLocation, triggerSearch } = useMapStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findBookmark = useCallback((lat: number, lng: number) => {
    return bookmarks?.find((b) => Math.abs(b.lat - lat) < 0.0001 && Math.abs(b.lng - lng) < 0.0001);
  }, [bookmarks]);

  const searchPlaces = useCallback((keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    if (typeof kakao === 'undefined' || !kakao.maps?.services) return;

    const places = new kakao.maps.services.Places();
    places.keywordSearch(keyword.trim(), (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setSuggestions(result.slice(0, 10) as unknown as PlaceResult[]);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowDropdown(true);
      }
    });
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => searchPlaces(value), 300);
  }, [searchPlaces]);

  const selectPlace = useCallback((place: PlaceResult) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    setSelectedLocation(lat, lng);
    setCenter(lat, lng);
    triggerSearch();
    setQuery(place.place_name);
    setShowDropdown(false);
    setSuggestions([]);
  }, [setSelectedLocation, setCenter, triggerSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        searchPlaces(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectPlace(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }, [showDropdown, suggestions, selectedIndex, selectPlace, searchPlaces, query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className="w-72 px-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-muted"
        />
        <button
          onClick={() => searchPlaces(query)}
          className="px-3 text-muted hover:text-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">{t('noResults')}</div>
          ) : (
            suggestions.map((place, index) => {
              const lat = parseFloat(place.y);
              const lng = parseFloat(place.x);
              const existingBookmark = findBookmark(lat, lng);
              const isBookmarked = !!existingBookmark;

              return (
                <div
                  key={place.id}
                  className={`flex items-center px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                    index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => selectPlace(place)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{place.place_name}</p>
                    <p className="text-xs text-muted truncate">{place.road_address_name || place.address_name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isBookmarked && onRemoveBookmark) {
                        onRemoveBookmark(existingBookmark.id);
                      } else if (onAddBookmark) {
                        onAddBookmark(
                          place.place_name,
                          lat,
                          lng,
                          place.road_address_name || place.address_name,
                        );
                      }
                    }}
                    className={`ml-2 p-1 transition-colors flex-shrink-0 ${
                      isBookmarked ? 'text-yellow-500' : 'text-muted hover:text-yellow-500'
                    }`}
                    title={isBookmarked ? t('removeBookmark') : t('addBookmark')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
