# Cómo agregar o cambiar contenido

Todo el contenido está en `src/data/` y es bilingüe: cada texto se escribe como `{ es: '...', en: '...' }`.
Después de editar, ejecuta `npm test` (revisa que no falte nada) y `npm run build`.

## Proyecto nuevo — `src/data/projects.ts`

Copia un objeto de la lista y cambia:

| Campo | Qué poner |
| --- | --- |
| `slug` | Identificador único en minúsculas con guiones (será la URL `/projects/slug`). |
| `category` | Isla principal: `cyber`, `ai`, `drones`, `web`, `automation`, `hardware`, `content` o `practice`. |
| `alsoIn` | (Opcional) otras islas donde también aparece. |
| `status` | Estado **real**: `live`, `beta`, `demo`, `lab`, `development`, `archive`, `personal`. No uses `live` si sigue en desarrollo. |
| `statusDetail` | Detalle corto, por ejemplo "v0.2 · módulo de reportes". |
| `visibility` | `public` o `private`. Si es privado **no** pongas `repo`. |
| `repo` / `demo` | Solo enlaces que existan. Los botones se generan solos: código + demo → "Ver código" y "Abrir proyecto"; solo código → "Ver en GitHub"; solo demo → "Visitar proyecto". |
| `summary`, `description`, `features`, `role`, `tech` | Texto no confidencial. |
| `gallery` | (Opcional) capturas reales aprobadas en `public/images/proyectos/...`. Mientras no haya, se muestra una portada conceptual generada en código y etiquetada como tal. |
| `cover` | Motivo de la portada conceptual: `shield`, `logs`, `ai`, `voice`, `store`, `loyalty`, `web`, `terminal`, `video`, `chip`, `academy`, `code`, `nfc`. |
| `featured`, `order` | Destacado y orden (menor = primero). |

Para proyectos de drones: al agregar el primero con `category: 'drones'` puedes quitar el campo `pending` de la isla en `src/data/categories.ts`.

## Certificación — `src/data/certifications.ts`

Agrega `id`, `name`, `issuer`, `date`, `sortDate` (`AAAA-MM`), `kind`, `group`, `skills`, `icon` (ícono de la tarjeta, ver `CertIcon` en `src/data/types.ts`), `color` (hex) y, si existe, `hours`.
**Las certificaciones se muestran solo como texto, cada una en su cuadro. No subas fotos ni PDF de certificados o diplomas, ni enlaces de verificación (abren el certificado completo): suelen incluir CURP, folios, firmas o códigos QR personales. Los comprobantes se envían directamente a los reclutadores a solicitud.** Una prueba automática lo revisa.

## Experiencia — `src/data/experience.ts`

Mantén el orden de la más reciente a la más antigua. Usa los mismos datos del CV. La prueba `data.test.ts` verifica que las empresas coincidan con el CV; si agregas un empleo nuevo, actualiza también esa lista en la prueba.

## CV en PDF

Reemplaza `public/cv/CV_Alfonso_Chavarin_ES.pdf` y `public/cv/CV_Alfonso_Chavarin_EN.pdf` conservando los nombres.

## Fotografía

`public/images/alfonso/`: `alfonso-circle.webp` (círculo del universo y CV), `alfonso-circle-512.jpg` (textura 3D, 512×512) y `alfonso-portrait.webp` (Sobre mí, 4:5).

## Textos de la interfaz

`messages/es.json` y `messages/en.json` deben tener las mismas claves (lo revisa `messages.test.ts`).
