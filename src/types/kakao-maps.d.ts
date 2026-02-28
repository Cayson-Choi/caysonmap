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

  class Circle {
    constructor(options: CircleOptions);
    setMap(map: Map | null): void;
    setPosition(latlng: LatLng): void;
    setRadius(radius: number): void;
  }

  interface CircleOptions {
    center: LatLng;
    radius: number;
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    fillColor?: string;
    fillOpacity?: number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    image?: MarkerImage;
    title?: string;
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: { offset?: Point });
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  interface InfoWindowOptions {
    content: string;
    removable?: boolean;
  }

  namespace event {
    function addListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
    function removeListener(target: unknown, type: string, handler: (...args: unknown[]) => void): void;
  }

  function load(callback: () => void): void;

  namespace services {
    class Places {
      constructor(map?: Map);
      categorySearch(
        code: string,
        callback: (result: PlaceResult[], status: string, pagination: Pagination) => void,
        options?: CategorySearchOptions,
      ): void;
      keywordSearch(
        keyword: string,
        callback: (result: PlaceResult[], status: string, pagination: Pagination) => void,
        options?: KeywordSearchOptions,
      ): void;
    }

    class Geocoder {
      addressSearch(
        query: string,
        callback: (result: GeocoderResult[], status: string) => void,
      ): void;
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      category_name: string;
      category_group_code: string;
      phone: string;
      address_name: string;
      road_address_name: string;
      x: string;
      y: string;
      place_url: string;
      distance: string;
    }

    interface GeocoderResult {
      address_name: string;
      x: string;
      y: string;
    }

    interface CategorySearchOptions {
      location?: LatLng;
      radius?: number;
      page?: number;
      size?: number;
      sort?: string;
      useMapBounds?: boolean;
      useMapCenter?: boolean;
    }

    interface KeywordSearchOptions {
      location?: LatLng;
      radius?: number;
      page?: number;
      size?: number;
      sort?: string;
    }

    interface Pagination {
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      current: number;
      gotoPage(page: number): void;
      nextPage(): void;
      prevPage(): void;
    }

    const Status: {
      OK: string;
      ZERO_RESULT: string;
      ERROR: string;
    };

    const SortBy: {
      ACCURACY: string;
      DISTANCE: string;
    };
  }
}
