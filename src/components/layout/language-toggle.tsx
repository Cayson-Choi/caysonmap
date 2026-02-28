'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  const isEn = locale === 'en';

  const toggleLanguage = () => {
    const newLocale = isEn ? 'ko' : 'en';
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`relative inline-flex h-7 w-[52px] items-center rounded-full transition-colors ${
        isEn ? 'bg-primary' : 'bg-border'
      }`}
      aria-label="Toggle language"
    >
      <span className={`absolute left-1 text-[10px] font-bold ${isEn ? 'text-primary-foreground' : 'text-muted'}`}>
        한
      </span>
      <span className={`absolute right-1 text-[10px] font-bold ${isEn ? 'text-muted' : 'text-foreground'}`}>
        EN
      </span>
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          isEn ? 'translate-x-[26px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
