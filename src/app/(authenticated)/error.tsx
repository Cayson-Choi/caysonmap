'use client';

import { useTranslations } from 'next-intl';

export default function AuthenticatedError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-xl font-bold mb-2">{t('errorTitle')}</h2>
        <p className="text-sm text-muted mb-4">{t('errorDescription')}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
