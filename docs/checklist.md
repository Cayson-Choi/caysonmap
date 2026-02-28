# CasyonMap 개발 체크리스트

## Phase 1: 프로젝트 초기 설정
- [x] Next.js + TypeScript 프로젝트 생성 (App Router)
- [x] Tailwind CSS 설정
- [x] pnpm 패키지 매니저 설정
- [x] ESLint + Prettier 설정
- [x] 프로젝트 폴더 구조 생성
- [x] 환경 변수 파일 (.env.local.example) 생성
- [x] Supabase 클라이언트 설정 (브라우저 + 서버)
- [x] next-themes 설정 (다크모드/라이트모드)
- [x] next-intl 설정 (한국어/영어)
- [x] 번역 파일 생성 (messages/ko.json, messages/en.json)

## Phase 2: 인증 시스템
- [x] 로그인 페이지 UI (/login)
- [x] 회원가입 페이지 UI (/signup)
- [x] 이메일 회원가입 기능 구현
- [x] 이메일 로그인 기능 구현
- [x] Google OAuth 로그인 구현
- [x] 카카오 OAuth 로그인 구현
- [x] 네이버 OAuth 로그인 구현
- [x] OAuth 콜백 처리 (/auth/callback)
- [x] 인증 미들웨어 (비로그인 시 리다이렉트)
- [x] 로그아웃 기능
- [x] profiles 테이블 & RLS 정책 (SQL)

## Phase 3: 지도 시스템
- [x] 네이버맵 SDK 로딩 및 기본 표시
- [x] 카카오맵 SDK 로딩 및 기본 표시
- [x] 지도 모드 전환 UI (네이버/카카오/동시보기 토글)
- [x] 동시보기 모드 - 좌우 분할 레이아웃
- [x] 동시보기 모드 - 중심좌표 동기화
- [x] 동시보기 모드 - 줌 레벨 동기화
- [x] 현재 위치 표시 (Geolocation)
- [x] 지도 모드 설정 저장 (preferred_map)

## Phase 4: 레이아웃 & 프로필
- [x] 공통 레이아웃 (헤더, 네비게이션)
- [x] 다크모드/라이트모드 전환 토글 (헤더)
- [x] 언어 전환 토글 (헤더, 한국어/영어)
- [x] 프로필 페이지 UI (/profile)
- [x] 닉네임 수정 기능
- [x] 선호 지도 설정 기능
- [x] 테마/언어 설정 기능 (프로필에서)
- [ ] 반응형 디자인 세부 조정

## Phase 5: 마무리
- [ ] 에러 처리 및 로딩 상태
- [ ] 전체 테스트
- [ ] 배포 준비 (Vercel)
