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

- **Formulario completo** (§7): 11 pasos con lógica condicional, salud (§9),
  consentimientos separados (§11), resumen editable y confirmación con
  código único, añadir al calendario, comprobante y compartir.
- Conectado a Supabase (`POST /api/registrations`) con cifrado del documento
  (AES-256-GCM) y persistencia local del borrador.
- **Panel admin con Supabase Auth** (`@supabase/ssr`, gate en `proxy.ts`):
  dashboard con KPIs, tabla, **detalle de inscripción** con documento
  enmascarado, **cambio de estados con historial**, notas internas y
  **vista imprimible / PDF** de la lista.
- SEO completo: Open Graph con portada, Twitter Card, favicon (logo), JSON-LD.
- **Búsqueda y filtros** en la tabla (estado, mascota, tamaño, atención) +
  **exportación CSV** con documento enmascarado (§11.3, §20).
- **Detección de duplicados** por teléfono con opción de continuar (§8).
- **Row Level Security** activo en todas las tablas: la clave anónima no
  puede leer datos; el acceso es solo vía service-role en servidor (§17).

## Acceso admin

`/admin/login` con Supabase Auth (correo + contraseña). El usuario admin se
crea desde el dashboard de Supabase (Authentication → Users) o vía Admin API.

## Pendiente (siguientes fases, §25)

- Roles diferenciados por usuario admin (§11.1) — hoy hay un único rol.
- Políticas RLS granulares por rol (hoy RLS niega todo al anon; el acceso
  es solo por service-role en servidor).
- Exportación XLSX nativa (hoy CSV, que Excel abre bien).
- Correo de confirmación (Resend) — pospuesto por ahora.
