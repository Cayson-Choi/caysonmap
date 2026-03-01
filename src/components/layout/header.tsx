'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase/auth';
import ThemeToggle from './theme-toggle';
import LanguageToggle from './language-toggle';

export default function Header() {
  const t = useTranslations();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileMenuOpen]);

  return (
    <header ref={menuRef} className="relative h-16 border-b border-border bg-background flex items-center justify-between px-4 z-50">
      <Link href="/map" className="text-lg font-bold">
        {t('common.appName')}
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4">
        <Link href="/map" className="text-sm hover:text-primary transition-colors">
          {t('nav.map')}
        </Link>
        <Link href="/profile" className="text-sm hover:text-primary transition-colors">
          {t('nav.profile')}
        </Link>
      </nav>

      {/* Desktop controls */}
      <div className="hidden md:flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          {t('common.logout')}
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-foreground"
        aria-label={t('common.menu')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50 md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <Link href="/map" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors py-2">
              {t('nav.map')}
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors py-2">
              {t('nav.profile')}
            </Link>
            <div className="border-t border-border pt-3 flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="text-left text-sm text-muted hover:text-foreground transition-colors py-2"
            >
              {t('common.logout')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
