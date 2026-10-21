'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// El formulario (React Hook Form + Zod) se descarga solo cuando la sección se acerca a la pantalla.
const ContactForm = dynamic(() => import('./ContactForm').then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <div className="glass h-[520px] animate-pulse rounded-3xl" aria-hidden="true" />,
});

export function LazyContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- navegadores sin IntersectionObserver
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{visible ? <ContactForm /> : <div className="glass h-[520px] rounded-3xl" aria-hidden="true" />}</div>;
}
