'use client';

import Script from 'next/script';

export default function MapScripts() {
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  return (
    <>
      {kakaoAppKey && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&autoload=false`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
