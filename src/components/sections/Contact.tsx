import { Mail, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { profile } from '@/data/profile';
import { tx } from '@/lib/i18n';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LazyContactForm } from '@/components/contact/LazyContactForm';

export function Contact() {
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const locale = useLocale();
  const channels = [
    { href: `mailto:${profile.email}`, label: t('email'), value: profile.email, icon: <Mail className="h-5 w-5" aria-hidden="true" />, color: '#FF39C6', external: false },
    { href: profile.linkedin, label: 'LinkedIn', value: 'in/alfonso-chavarin', icon: <LinkedinIcon className="h-5 w-5" />, color: '#147DFF', external: true },
    { href: profile.github, label: 'GitHub', value: profile.githubUser, icon: <GithubIcon className="h-5 w-5" />, color: '#9D35FF', external: true },
  ];
  return (
    <section id="contacto" aria-labelledby="contact-title" className="section">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#FF39C6" id="contact-title" />
          <ul className="flex flex-col gap-3">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="neon-card flex items-center gap-4 p-4"
                  style={{ '--accent': c.color } as React.CSSProperties}
                  aria-label={`${c.label}: ${c.value}${c.external ? ` ${tc('newTab')}` : ''}`}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-accent" style={{ background: `${c.color}1f`, boxShadow: `0 0 20px -8px ${c.color}` }}>
                    {c.icon}
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-dim">{c.label}</span>
                    <span className="block break-all text-sm font-semibold">{c.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
            <li className="flex items-center gap-2 px-1 pt-2 text-sm text-muted">
              <MapPin className="h-4 w-4 text-pink" aria-hidden="true" />
              {tx(profile.location, locale)}
            </li>
            {profile.availability ? <li className="px-1 text-sm text-muted">{tx(profile.availability, locale)}</li> : null}
          </ul>
        </div>
        <Reveal delay={0.1}>
          <LazyContactForm />
        </Reveal>
      </div>
    </section>
  );
}
