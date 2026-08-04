# HEIM · Caminata por los animales

Formulario inteligente de inscripción (tipo modal, por microdecisiones) + base para el panel administrativo.
Especificación completa en [`DOCUMENTO-MAESTRO.md`](./DOCUMENTO-MAESTRO.md).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — sistema de marca HEIM en `src/app/globals.css` (`@theme`)
- **React Hook Form** + **Zod** — validación cliente/servidor
- **Framer Motion** — transiciones entre pasos (§5.5)
- **libphonenumber-js** — normalización de teléfono a E.164
- **Supabase** (pendiente de conectar) — PostgreSQL, Auth, RLS, Storage

## Arranque

```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint     # ESLint
```

Copia `.env.example` a `.env.local` y completa las credenciales de Supabase cuando estén disponibles.
La app arranca en modo demostración sin backend (el envío simula el código de inscripción).

## Estructura

```
src/
├── app/
│   ├── page.tsx              Landing (Paso 0) + abre el modal
│   ├── layout.tsx            Fuente Manrope + metadatos
│   └── globals.css           Sistema de marca HEIM (@theme)
├── components/
│   ├── brand/Logo.tsx
│   └── form/
│       ├── FormModal.tsx     Modal + motor de pasos + resumen + confirmación
│       ├── steps.tsx         Definición declarativa de los pasos (§7)
│       ├── ChoiceCard.tsx  ProgressIndicator.tsx  StepHeader.tsx
│       ├── TextField.tsx   NavigationControls.tsx
├── config/event.ts           Contenido editable del evento (§26)
├── lib/
│   ├── form/useRegistrationForm.ts   Estado + persistencia localStorage (§10)
│   ├── validation/registration.ts    Esquemas Zod (§9)
│   └── supabase/client.ts            Cliente Supabase
└── types/registration.ts     Estado global del formulario (§16)

supabase/schema.sql           Modelo de datos completo (§12)
```

## Cómo agregar o modificar un paso

Los pasos son declarativos. Edita `src/components/form/steps.tsx` y agrega un objeto al arreglo `steps`:

```ts
{
  id: "health",
  section: "Tu perro",
  isActive: (s) => s.attendsWithPet === true,   // lógica condicional (§8)
  isValid: (s) => Boolean(s.pet?.healthStatus),  // gating de avance (§6.1)
  render: ({ state, updatePet }) => ( /* ... */ ),
}
```

El motor filtra por `isActive`, recalcula el total de pasos y el progreso automáticamente.

## Producción

- **Formulario:** https://heim-caminata.vercel.app
- **Panel admin:** https://heim-caminata.vercel.app/admin (contraseña en `ADMIN_PASSWORD`)
- **Repo:** https://github.com/IEOUA8/HEIM — cada push a `main` despliega en Vercel.
- **Supabase:** proyecto `HEIM` (`qxqfassgaccuoofivybp`), 7 tablas + evento `caminata-heim`.

## Funcionando

- Formulario tipo modal conectado a Supabase (`POST /api/registrations`).
- Cifrado del documento (AES-256-GCM) y código único de inscripción.
- Panel admin protegido (`proxy.ts` + cookie firmada): dashboard con KPIs,
  distribución por tamaño y tabla de inscripciones con datos reales.
- SEO completo: Open Graph con portada, Twitter Card, favicon (logo), JSON-LD.

## Pendiente (siguientes fases, §25)

- Pasos 9 (salud) y consentimiento de imagen separado; "Editar" en el resumen;
  confirmación con descargar/calendario/compartir.
- Migrar el acceso admin a Supabase Auth con roles (§11.1) y habilitar RLS (§17).
- Detalle de inscripción, cambio de estados con historial, notas, filtros y
  exportación CSV/XLSX (§11.3–§11.5, §20).
- Correo de confirmación (Resend) y flujo de duplicados (§8).
