declare namespace naver.maps {
  class Map {
    constructor(el: HTMLElement, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setZoom(zoom: number, effect?: boolean): void;
    getZoom(): number;
    destroy(): void;
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position?: number;
    };
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Event {
    static addListener(target: unknown, type: string, listener: (...args: unknown[]) => void): void;
    static removeListener(listener: unknown): void;
  }

  const Position: {
    TOP_RIGHT: number;
  };
}
