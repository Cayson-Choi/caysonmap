import MapScripts from '@/components/map/map-scripts';
import MapContainer from '@/components/map/map-container';
import MapControlPanel from '@/components/map/map-control-panel';
import AddressSearch from '@/components/map/address-search';
import { MapErrorBoundary } from '@/components/map/map-error-boundary';

export default function MapPage() {
  return (
    <>
      <MapScripts />
      <div className="h-[calc(100vh-64px)] relative">
        {/* Address search - top left */}
        <div className="absolute top-4 left-4 z-10">
          <AddressSearch />
        </div>

        {/* Control panel - top right */}
        <div className="absolute top-4 right-4 z-10">
          <MapControlPanel />
        </div>

        {/* Map */}
        <MapErrorBoundary>
          <MapContainer />
        </MapErrorBoundary>
      </div>
    </>
  );
}
