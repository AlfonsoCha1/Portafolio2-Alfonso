import { setRequestLocale } from 'next-intl/server';
import { IntroSequence } from '@/components/intro/IntroSequence';
import { SectionObserver } from '@/components/layout/SectionObserver';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { ProjectExplorer } from '@/components/sections/ProjectExplorer';
import { CareerTimeline } from '@/components/sections/CareerTimeline';
import { Education } from '@/components/sections/Education';
import { CertificationGallery } from '@/components/sections/CertificationGallery';
import { Labs } from '@/components/sections/Labs';
import { Skills } from '@/components/sections/Skills';
import { CVTeaser } from '@/components/sections/CVTeaser';
import { Contact } from '@/components/sections/Contact';
import { ModulePanel } from '@/components/universe/ModulePanel';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <IntroSequence />
      <SectionObserver />
      <Hero />
      <About />
      <ProjectExplorer />
      <CareerTimeline />
      <Education />
      <CertificationGallery />
      <Labs />
      <Skills />
      <CVTeaser />
      <Contact />
      <ModulePanel />
    </>
  );
}
