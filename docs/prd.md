# CasyonMap PRD (Product Requirements Document)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | CasyonMap |
| 플랫폼 | 웹 애플리케이션 |
| 기술 스택 | Next.js (App Router) + TypeScript + Supabase |
| 목표 | 네이버맵과 카카오맵을 동시에 지원하는 지도 기반 웹 서비스 |

---

## 2. 기술 스택

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Theme**: next-themes (다크모드/라이트모드)
- **i18n**: next-intl (한국어/영어)
- **State Management**: Zustand
- **Map APIs**: Naver Maps JavaScript API v3, Kakao Maps JavaScript API

### Backend (BaaS)
- **Supabase**
  - Authentication (OAuth + Email)
  - PostgreSQL Database
  - Row Level Security (RLS)

### DevOps
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Deployment**: Vercel (예정)

---

## 3. 핵심 기능

### 3.1 인증 시스템 (Authentication)

3가지 로그인 방식을 지원한다.

| 방식 | Provider | 설명 |
|------|----------|------|
| Google 로그인 | Supabase OAuth (Google) | Google 계정으로 소셜 로그인 |
| 카카오 로그인 | Supabase OAuth (Kakao) | 카카오 계정으로 소셜 로그인 |
| 이메일 로그인 | Supabase Email Auth | 이메일 + 비밀번호 회원가입/로그인 |

#### 인증 흐름
1. 비로그인 사용자 → 로그인 페이지로 리다이렉트
2. 소셜 로그인 → OAuth 제공자 → 콜백 → 세션 생성
3. 이메일 로그인 → 회원가입 시 이메일 인증 → 로그인
4. 로그인 후 → 메인 지도 페이지로 이동

#### 사용자 프로필
- `id`, `email`, `nickname`, `avatar_url`, `provider`, `created_at`
- 소셜 로그인 시 프로필 정보 자동 채움

### 3.2 지도 시스템 (Map)

사용자가 3가지 지도 모드 중 하나를 선택할 수 있다.

| 모드 | 설명 |
|------|------|
| 네이버맵 | 네이버 지도만 전체 화면으로 표시 |
| 카카오맵 | 카카오 지도만 전체 화면으로 표시 |
| 동시 보기 | 네이버맵 + 카카오맵을 좌우 분할로 동시에 표시 |

#### 지도 공통 기능
- 현재 위치 표시 (Geolocation API)
- 확대/축소 컨트롤
- 지도 모드 전환 토글 (상단 또는 사이드바)

#### 동시 보기 모드
- 좌우 50:50 분할 레이아웃
- 두 지도의 중심 좌표 동기화 (한쪽 이동 시 다른 쪽도 따라감)
- 두 지도의 줌 레벨 동기화

### 3.3 테마 시스템 (Dark/Light Mode)

사용자가 라이트모드와 다크모드를 선택할 수 있다.

| 항목 | 설명 |
|------|------|
| 라이트모드 | **기본값**. 밝은 테마 |
| 다크모드 | 어두운 테마 |
| 시스템 설정 | OS 설정에 따라 자동 전환 |

- `next-themes` 라이브러리 사용
- Tailwind CSS `dark:` 클래스로 스타일링
- 사용자 선택 값은 localStorage에 저장
- 헤더 또는 설정에서 토글 가능

### 3.4 다국어 지원 (i18n)

한국어와 영어를 지원한다.

| 언어 | 코드 | 설명 |
|------|------|------|
| 한국어 | `ko` | **기본값**. 기본 언어 |
| English | `en` | 영어 |

- `next-intl` 라이브러리 사용
- `/messages/ko.json`, `/messages/en.json` 번역 파일 관리
- 헤더 또는 설정에서 언어 전환 가능
- 사용자 선택 값은 프로필(DB) 또는 localStorage에 저장

---

## 4. 페이지 구조

```
/ (랜딩 or 리다이렉트)
├── /login          — 로그인 페이지
├── /signup         — 이메일 회원가입 페이지
├── /auth/callback  — OAuth 콜백 처리
├── /map            — 메인 지도 페이지 (인증 필요)
└── /profile        — 사용자 프로필 페이지 (인증 필요)
```

---

## 5. 데이터베이스 스키마

### profiles 테이블
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'email',
  preferred_map TEXT NOT NULL DEFAULT 'naver' CHECK (preferred_map IN ('naver', 'kakao', 'both')),
  theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT NOT NULL DEFAULT 'ko' CHECK (language IN ('ko', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 본인만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 6. 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Naver Maps
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=

# Kakao Maps
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=
```

---

## 7. 비기능 요구사항

- **반응형 디자인**: 모바일/태블릿/데스크톱 대응
- **성능**: 지도 SDK 지연 로딩 (dynamic import)
- **보안**: Supabase RLS 적용, API 키 환경 변수 관리
- **접근성**: 키보드 네비게이션, 스크린리더 기본 대응

---

## 8. Phase 1 범위 (현재)

> 인증 + 지도 표시까지만 구현. 이후 기능은 Phase 2에서 진행.

- [x] 프로젝트 초기 설정 (Next.js + TypeScript + Tailwind + Supabase)
- [ ] 인증 시스템 (Google, 카카오, 네이버, 이메일)
- [ ] 메인 지도 페이지 (네이버맵, 카카오맵, 동시보기)
- [ ] 다크모드/라이트모드 전환
- [ ] 한국어/영어 다국어 지원
- [ ] 사용자 프로필 페이지
- [ ] 반응형 레이아웃

---

## 9. Phase 2 (예정)

> Phase 1 완료 후 추가 기능 논의 예정

- 장소 검색
- 마커/핀 기능
- 즐겨찾기
- 공유 기능
- 기타 (추후 결정)
