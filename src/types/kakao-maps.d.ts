declare namespace kakao.maps {
  class Map {
    constructor(el: HTMLElement, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
    getLevel(): number;
    relayout(): void;
  }

  interface MapOptions {
    center?: LatLng;
    level?: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  namespace event {
    function addListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
    function removeListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
  }

  function load(callback: () => void): void;
}
