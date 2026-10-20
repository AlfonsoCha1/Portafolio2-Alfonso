import type { L } from './types';

/**
 * Aviso de privacidad ajustado a lo que el sitio realmente recopila.
 * Revisarlo si se agrega analítica, un CMS u otros servicios.
 */
export const privacyUpdated: L = { es: '20 de octubre de 2026', en: 'October 20, 2026' };

export const privacySections: { title: L; body: L[] }[] = [
  {
    title: { es: 'Responsable', en: 'Data controller' },
    body: [
      {
        es: 'José Alfonso Chavarín Montoya, con domicilio en Cuernavaca, Morelos, México, es responsable del tratamiento de los datos personales que se recaban en este portafolio. Contacto: alfonso.chavarin@hotmail.com.',
        en: 'José Alfonso Chavarín Montoya, based in Cuernavaca, Morelos, Mexico, is responsible for the personal data collected on this portfolio. Contact: alfonso.chavarin@hotmail.com.',
      },
    ],
  },
  {
    title: { es: 'Datos que se recaban', en: 'Data collected' },
    body: [
      {
        es: 'Formulario de contacto: nombre, correo electrónico, asunto (opcional) y mensaje. Solo se recaban cuando decides enviarlos.',
        en: 'Contact form: name, email address, subject (optional) and message. They are collected only when you choose to send them.',
      },
      {
        es: 'Dirección IP: se usa de forma temporal, en memoria, para limitar el número de envíos y prevenir abusos. No se guarda en una base de datos.',
        en: 'IP address: used temporarily, in memory, to limit the number of submissions and prevent abuse. It is not stored in a database.',
      },
      {
        es: 'El proveedor de alojamiento (Vercel) puede registrar datos técnicos de las visitas, como la IP y el navegador, para operar y proteger el servicio conforme a sus propias políticas.',
        en: 'The hosting provider (Vercel) may log technical visit data, such as IP and browser, to operate and protect the service under its own policies.',
      },
      {
        es: 'Vista en vivo de proyectos: solo si pulsas "Ver en vivo" o "Cargar vista en vivo", se carga dentro del portafolio la página pública de ese proyecto (alojada en Vercel o Render), que puede recibir los mismos datos técnicos de la visita.',
        en: 'Live project view: only if you press "Live view" or "Load live view", the public page of that project (hosted on Vercel or Render) is loaded inside the portfolio and may receive the same technical visit data.',
      },
    ],
  },
  {
    title: { es: 'Para qué se usan', en: 'How data is used' },
    body: [
      {
        es: 'Los datos del formulario se usan únicamente para leer y responder tu mensaje. No se venden, no se comparten con fines comerciales y no se usan para publicidad.',
        en: 'Form data is used only to read and reply to your message. It is not sold, not shared for commercial purposes and not used for advertising.',
      },
      {
        es: 'Cuando el envío está activado, el mensaje se entrega al correo del responsable mediante un servicio de envío de correo electrónico (Resend). Se conserva en ese buzón solo el tiempo necesario para atender la conversación.',
        en: 'When delivery is enabled, the message is delivered to the controller’s inbox through an email delivery service (Resend). It is kept in that inbox only as long as needed for the conversation.',
      },
    ],
  },
  {
    title: { es: 'Cookies y almacenamiento local', en: 'Cookies and local storage' },
    body: [
      {
        es: 'El sitio no usa cookies de analítica, publicidad ni rastreo de terceros.',
        en: 'The site does not use analytics, advertising or third-party tracking cookies.',
      },
      {
        es: 'Usa una cookie funcional (CHAVATRIX_LOCALE) para recordar el idioma elegido durante un año.',
        en: 'It uses one functional cookie (CHAVATRIX_LOCALE) to remember the chosen language for one year.',
      },
      {
        es: 'En tu navegador se guardan preferencias de interfaz: tema, modo 3D/2D, pausa de animaciones, visibilidad de NEXBOT y si ya viste la introducción en la sesión. Estos datos no salen de tu dispositivo y puedes borrarlos desde la configuración del navegador.',
        en: 'Your browser stores interface preferences: theme, 3D/2D mode, paused animations, NEXBOT visibility and whether you already saw the intro this session. This data does not leave your device and you can clear it from your browser settings.',
      },
    ],
  },
  {
    title: { es: 'Tus derechos', en: 'Your rights' },
    body: [
      {
        es: 'Puedes solicitar el acceso, la rectificación o la eliminación de los datos que hayas enviado, u oponerte a su uso (derechos ARCO conforme a la legislación mexicana de protección de datos personales), escribiendo a alfonso.chavarin@hotmail.com.',
        en: 'You can request access to, correction or deletion of the data you sent, or object to its use (ARCO rights under Mexican personal data protection law), by writing to alfonso.chavarin@hotmail.com.',
      },
    ],
  },
  {
    title: { es: 'Seguridad', en: 'Security' },
    body: [
      {
        es: 'El sitio se sirve por HTTPS, valida los datos en el servidor, limita la frecuencia de envíos, incluye protección contra spam y aplica encabezados de seguridad. Las claves de los servicios se guardan como variables de entorno del servidor y nunca se envían al navegador.',
        en: 'The site is served over HTTPS, validates data on the server, rate-limits submissions, includes spam protection and applies security headers. Service keys are stored as server environment variables and are never sent to the browser.',
      },
    ],
  },
  {
    title: { es: 'Cambios a este aviso', en: 'Changes to this notice' },
    body: [
      {
        es: 'Si el sitio empieza a recabar otros datos (por ejemplo, analítica), este aviso se actualizará antes de hacerlo.',
        en: 'If the site starts collecting other data (for example, analytics), this notice will be updated before doing so.',
      },
    ],
  },
];
