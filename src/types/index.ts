export type Theme = 'light' | 'dark' | 'system';
export type Language = 'ko' | 'en';

export interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  provider: string;
  preferred_map: 'kakao';
  theme: Theme;
  language: Language;
  created_at: string;
  updated_at: string;
}
