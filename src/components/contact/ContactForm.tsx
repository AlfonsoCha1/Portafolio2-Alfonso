'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Mail, Send, TriangleAlert } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@/i18n/navigation';
import { contactSchema, type ContactData, type ContactInput } from '@/lib/contact-schema';
import { profile } from '@/data/profile';

/** Marca de tiempo actual (fuera del render). */
const nowMs = () => Date.now();

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; message: string; mail?: boolean };

export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale() as 'es' | 'en';
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', website: '', startedAt: 1, locale },
  });

  useEffect(() => {
    setValue('startedAt', nowMs());
    setValue('locale', locale);
  }, [locale, setValue]);

  const errText = (key?: string) => (key ? t(`errors.${key}` as 'errors.nameMin') : undefined);

  const onSubmit = async (data: ContactData) => {
    setStatus({ kind: 'idle' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; retryAfter?: number };
      if (res.ok && body.ok) {
        setStatus({ kind: 'success' });
        reset({ name: '', email: '', subject: '', message: '', website: '', startedAt: nowMs(), locale });
        return;
      }
      if (body.error === 'not_configured') setStatus({ kind: 'error', message: t('notConfigured', { email: profile.email }), mail: true });
      else if (body.error === 'rate_limited') setStatus({ kind: 'error', message: t('rateLimited', { seconds: body.retryAfter ?? 60 }) });
      else if (body.error === 'spam') setStatus({ kind: 'error', message: t('spam') });
      else setStatus({ kind: 'error', message: t('serverError', { email: profile.email }), mail: true });
    } catch {
      setStatus({ kind: 'error', message: t('serverError', { email: profile.email }), mail: true });
    }
  };

  const field = 'w-full rounded-xl border border-line bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-dim focus:border-cyan focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--cyan)_25%,transparent)] aria-[invalid=true]:border-pink';

  const mailto = `mailto:${profile.email}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="glass flex flex-col gap-4 rounded-3xl p-6 md:p-8" data-testid="contact-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            {t('name')}
          </label>
          <input id="cf-name" autoComplete="name" className={field} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'cf-name-err' : undefined} {...register('name')} />
          {errors.name ? (
            <p id="cf-name-err" className="mt-1 text-xs text-pink" role="alert">
              {errText(errors.name.message)}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            {t('emailField')}
          </label>
          <input id="cf-email" type="email" autoComplete="email" inputMode="email" className={field} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'cf-email-err' : undefined} {...register('email')} />
          {errors.email ? (
            <p id="cf-email-err" className="mt-1 text-xs text-pink" role="alert">
              {errText(errors.email.message)}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
          {t('subject')}
        </label>
        <input id="cf-subject" className={field} aria-invalid={Boolean(errors.subject)} {...register('subject')} />
        {errors.subject ? (
          <p className="mt-1 text-xs text-pink" role="alert">
            {errText(errors.subject.message)}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
          {t('message')}
        </label>
        <textarea id="cf-message" rows={5} className={`${field} resize-y`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'cf-message-err' : undefined} {...register('message')} />
        {errors.message ? (
          <p id="cf-message-err" className="mt-1 text-xs text-pink" role="alert">
            {errText(errors.message.message)}
          </p>
        ) : null}
      </div>
      {/* Campo trampa para bots: oculto para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">{t('honeypot')}</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-dim">
          {t('privacyNote').split(t('privacyLink'))[0]}
          <Link href="/privacy" className="underline hover:text-fg">
            {t('privacyLink')}
          </Link>
          {t('privacyNote').split(t('privacyLink'))[1] ?? ''}
        </p>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting} data-testid="contact-submit">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {isSubmitting ? t('sending') : t('send')}
        </button>
      </div>

      <div aria-live="polite" data-testid="contact-status">
        {status.kind === 'success' ? (
          <p className="flex items-start gap-2 rounded-xl border border-teal/50 bg-teal/10 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
            {t('success')}
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <div className="flex flex-col gap-3 rounded-xl border border-orange/50 bg-orange/10 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
              {status.message}
            </p>
            {status.mail ? (
              <a href={mailto} className="btn btn-ghost h-10 min-h-0 shrink-0 px-3 text-xs">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t('openMail')}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
