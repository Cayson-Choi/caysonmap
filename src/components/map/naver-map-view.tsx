'use client';

interface NaverMapViewProps {
  center: { lat: number; lng: number };
  zoom: number;
}

export default function NaverMapView({ center, zoom }: NaverMapViewProps) {
  const naverMapUrl = `https://map.naver.com/v5/?c=${center.lng},${center.lat},${zoom},0,0,0,dh`;

  return (
    <div className="w-full h-full relative">
      <iframe
        src={naverMapUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="네이버 지도"
      />
    </div>
  );
}
