import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SocialLoginButtons from '@/components/auth/social-login-buttons';
import EmailLoginForm from '@/components/auth/email-login-form';

export default function LoginPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">CasyonMap</h1>
          <p className="mt-2 text-muted">{t('login')}</p>
        </div>

        <SocialLoginButtons />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted">{t('orContinueWith')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <EmailLoginForm />

        <p className="text-center text-sm text-muted">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-primary hover:underline">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
