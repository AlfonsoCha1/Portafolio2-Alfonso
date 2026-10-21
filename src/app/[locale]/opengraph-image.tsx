import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { routing } from '@/i18n/routing';

export const alt = 'Alfonso Chavarín — CHAVATRIX UNIVERSE';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const photo = await readFile(join(process.cwd(), 'public', profile.photo.circleTexture));
  const src = `data:image/jpeg;base64,${photo.toString('base64')}`;
  const headline = locale === 'en' ? profile.headline.en : profile.headline.es;
  const roles = (locale === 'en' ? profile.roles.en : profile.roles.es).slice(0, 4).join(' · ');
  const colors = ['#00E5FF', '#9D35FF', '#FF943D', '#FF39C6', '#147DFF', '#19E3B1', '#D946EF'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'radial-gradient(circle at 78% 30%, #2a1170 0%, #0b1033 45%, #060A19 100%)',
          color: 'white',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: '#9aa8d6' }}>CHAVATRIX UNIVERSE</div>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1, marginTop: 18 }}>{profile.firstName}</div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.05,
              backgroundImage: 'linear-gradient(90deg, #c26bff, #6aa6ff, #39f0ff)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {profile.lastName}
          </div>
          <div style={{ fontSize: 32, marginTop: 24 }}>{headline}</div>
          <div style={{ fontSize: 24, marginTop: 10, color: '#a3afd3' }}>{roles}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 34 }}>
            {colors.map((c) => (
              <div key={c} style={{ width: 44, height: 10, borderRadius: 10, background: c, boxShadow: `0 0 16px ${c}` }} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 400 }}>
          <div
            style={{
              display: 'flex',
              width: 340,
              height: 340,
              borderRadius: 340,
              padding: 8,
              background: 'linear-gradient(135deg, #9D35FF, #147DFF, #00E5FF, #FF39C6)',
              boxShadow: '0 0 80px #6a2bd9',
            }}
          >
            <img src={src} width={324} height={324} style={{ borderRadius: 324, objectFit: 'cover' }} alt="" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
