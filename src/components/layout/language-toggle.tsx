'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg hover:bg-card border border-border text-sm font-medium transition-colors"
    >
      {locale === 'ko' ? 'EN' : '한'}
    </button>
  );
}
