import MapScripts from '@/components/map/map-scripts';
import MapContainer from '@/components/map/map-container';
import MapModeToggle from '@/components/map/map-mode-toggle';
import MyLocationButton from '@/components/map/my-location-button';
import { MapErrorBoundary } from '@/components/map/map-error-boundary';

export default function MapPage() {
  return (
    <>
      <MapScripts />
      <div className="h-[calc(100vh-64px)] relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <MapModeToggle />
          <MyLocationButton />
        </div>
        <MapErrorBoundary>
          <MapContainer />
        </MapErrorBoundary>
      </div>
    </>
  );
}
