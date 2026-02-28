'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase/auth';
import ThemeToggle from './theme-toggle';
import LanguageToggle from './language-toggle';

export default function Header() {
  const t = useTranslations();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <Link href="/map" className="text-lg font-bold">
          {t('common.appName')}
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/map" className="text-sm hover:text-primary transition-colors">
            {t('nav.map')}
          </Link>
          <Link href="/profile" className="text-sm hover:text-primary transition-colors">
            {t('nav.profile')}
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          {t('common.logout')}
        </button>
      </div>
    </header>
  );
}
