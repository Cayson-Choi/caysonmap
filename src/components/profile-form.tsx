'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Language } from '@/types';

interface ProfileFormProps {
  profile: Profile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const { setTheme: applyTheme } = useTheme();
  const router = useRouter();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [isDark, setIsDark] = useState(profile?.theme === 'dark');
  const [language, setLanguage] = useState<Language>(profile?.language || 'ko');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage('');

    const theme = isDark ? 'dark' : 'light';

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
      applyTheme(theme);
      if (language !== profile.language) {
        document.cookie = `locale=${language};path=/;max-age=31536000`;
        router.refresh();
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
        <div className="flex items-center gap-3">
          <span className={`text-sm ${!isDark ? 'font-semibold' : 'text-muted'}`}>{t('light')}</span>
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className={`relative inline-flex h-7 w-[52px] items-center rounded-full transition-colors ${
              isDark ? 'bg-primary' : 'bg-border'
            }`}
            aria-label="Toggle theme"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                isDark ? 'translate-x-[26px]' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isDark ? 'font-semibold' : 'text-muted'}`}>{t('dark')}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('language')}</label>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${language === 'ko' ? 'font-semibold' : 'text-muted'}`}>{t('korean')}</span>
          <button
            type="button"
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className={`relative inline-flex h-7 w-[52px] items-center rounded-full transition-colors ${
              language === 'en' ? 'bg-primary' : 'bg-border'
            }`}
            aria-label="Toggle language"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                language === 'en' ? 'translate-x-[26px]' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${language === 'en' ? 'font-semibold' : 'text-muted'}`}>{t('english')}</span>
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
