'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Theme, Language } from '@/types';

type TranslationKey = 'light' | 'dark' | 'system';

interface ProfileFormProps {
  profile: Profile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [theme, setTheme] = useState<Theme>(profile?.theme || 'light');
  const [language, setLanguage] = useState<Language>(profile?.language || 'ko');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        nickname,
        preferred_map: 'kakao',
        theme,
        language,
      })
      .eq('id', profile.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(t('saveSuccess'));
      // 언어가 변경되면 쿠키 업데이트 후 새로고침
      if (language !== profile.language) {
        document.cookie = `locale=${language};path=/;max-age=31536000`;
        window.location.reload();
      }
    }
    setSaving(false);
  };

  if (!profile) {
    return <p className="text-muted">Profile not found</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      <div>
        <label className="block text-sm font-medium mb-1">{t('email')}</label>
        <input
          type="text"
          value={profile.email}
          disabled
          className="w-full px-4 py-3 border border-border rounded-lg bg-card text-muted"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('nickname')}</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('theme')}</label>
        <div className="flex gap-3">
          {(['light', 'dark', 'system'] as Theme[]).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                theme === th
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-card'
              }`}
            >
              {t(th as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('language')}</label>
        <div className="flex gap-3">
          {(['ko', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                language === lang
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-card'
              }`}
            >
              {lang === 'ko' ? t('korean') : t('english')}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message === t('saveSuccess') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? '...' : tCommon('save')}
      </button>
    </div>
  );
}
