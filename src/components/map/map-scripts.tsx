'use client';

import Script from 'next/script';

export default function MapScripts() {
  const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  return (
    <>
      {naverClientId && (
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverClientId}`}
          strategy="afterInteractive"
        />
      )}
      {kakaoAppKey && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&autoload=false`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
