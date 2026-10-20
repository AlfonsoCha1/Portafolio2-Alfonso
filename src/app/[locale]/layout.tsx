import '@fontsource-variable/unbounded';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { AppProvider } from '@/components/providers/AppProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { NexbotAssistant } from '@/components/nexbot/NexbotAssistant';
import { TerminalDialog } from '@/components/terminal/TerminalDialog';
import { introInitScript } from '@/lib/intro';
import { themeInitScript } from '@/lib/theme';
import { SITE_URL, languageAlternates } from '@/lib/site';
import { profile } from '@/data/profile';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s · ${profile.name}` },
    description: t('description'),
    applicationName: 'CHAVATRIX UNIVERSE',
    authors: [{ name: profile.fullName, url: profile.github }],
    creator: profile.fullName,
    keywords: ['Alfonso Chavarín', 'Ingeniero en Sistemas', 'Systems Engineer', 'Ciberseguridad', 'Cybersecurity', 'IT Support', 'Soporte TI', 'Redes', 'Python', 'IA', 'Portafolio', 'Cuernavaca'],
    alternates: { ...languageAlternates('/'), canonical: `/${locale}` },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'profile',
      siteName: 'CHAVATRIX UNIVERSE',
      locale: locale === 'en' ? 'en_US' : 'es_MX',
      alternateLocale: locale === 'en' ? 'es_MX' : 'en_US',
      title: t('title'),
      description: t('description'),
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060A19' },
    { media: '(prefers-color-scheme: light)', color: '#F4F5FB' },
  ],
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: locale === 'en' ? profile.headline.en : profile.headline.es,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}${profile.photo.circle}`,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Cuernavaca', addressRegion: 'Morelos', addressCountry: 'MX' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Internacional (UNINTER)' },
    knowsLanguage: ['es', 'en'],
    sameAs: [profile.github, profile.linkedin],
  };

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + introInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body id="top">
        <a href="#contenido" className="sr-only z-[200] rounded-xl bg-violet px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {t('skip')}
        </a>
        <div aria-hidden="true" className="page-backdrop" />
        <div aria-hidden="true" className="page-grid" />
        <NextIntlClientProvider>
          <AppProvider>
            <SiteHeader />
            <main id="contenido" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
            <FloatingDock />
            <NexbotAssistant />
            <TerminalDialog />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
