'use client';

import { useCallback } from 'react';
import MapScripts from '@/components/map/map-scripts';
import MapContainer from '@/components/map/map-container';
import MapControlPanel from '@/components/map/map-control-panel';
import AddressSearch from '@/components/map/address-search';
import { MapErrorBoundary } from '@/components/map/map-error-boundary';
import { useBookmarks } from '@/hooks/use-bookmarks';

export default function MapPage() {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const handleAddBookmark = useCallback(
    (name: string, lat: number, lng: number, address: string) => {
      addBookmark(name, lat, lng, address);
    },
    [addBookmark],
  );

  return (
    <>
      <MapScripts />
      <div className="h-[calc(100vh-64px)] relative">
        {/* Address search - top left */}
        <div className="absolute top-4 left-4 z-10">
          <AddressSearch
            bookmarks={bookmarks}
            onAddBookmark={handleAddBookmark}
            onRemoveBookmark={removeBookmark}
          />
        </div>

        {/* Control panel - top right */}
        <div className="absolute top-4 right-4 z-10">
          <MapControlPanel />
        </div>

        {/* Map */}
        <MapErrorBoundary>
          <MapContainer
            bookmarks={bookmarks}
            onAddBookmark={handleAddBookmark}
            onRemoveBookmark={removeBookmark}
          />
        </MapErrorBoundary>
      </div>
    </>
  );
}
