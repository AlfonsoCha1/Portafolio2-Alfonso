import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AcLogo } from '@/components/ui/AcLogo';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pt-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <AcLogo className="h-16 w-24" />
        <p className="font-mono text-sm text-cyan">404</p>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted">{t('text')}</p>
        <Link href="/" className="btn btn-primary">
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
