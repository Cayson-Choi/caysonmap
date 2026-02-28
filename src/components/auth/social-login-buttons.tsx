'use client';

import { useTranslations } from 'next-intl';
import { signInWithOAuth } from '@/lib/supabase/auth';
import { useState } from 'react';

export default function SocialLoginButtons() {
  const t = useTranslations('auth');
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'kakao') => {
    try {
      setLoading(provider);
      await signInWithOAuth(provider);
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => handleOAuth('google')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-border rounded-lg hover:bg-card transition-colors disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span>{t('loginWithGoogle')}</span>
      </button>

      <button
        onClick={() => handleOAuth('kakao')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: '#FEE500', color: '#000000' }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000">
          <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24l-1.12 4.1a.3.3 0 0 0 .45.34l4.78-3.18c.49.06 1 .1 1.51.1 5.52 0 10-3.36 10-7.6C22 6.36 17.52 3 12 3z" />
        </svg>
        <span>{t('loginWithKakao')}</span>
      </button>
    </div>
  );
}
