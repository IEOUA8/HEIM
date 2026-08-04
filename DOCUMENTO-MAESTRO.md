# Documento maestro — Formulario inteligente de inscripción

## HEIM · Caminata por los animales

**Versión:** 1.0  
**Tipo de producto:** Aplicación web responsive con formulario conversacional y panel administrativo  
**Objetivo principal:** Captar, organizar y consultar los datos de las personas y mascotas inscritas a la caminata, mediante una experiencia clara, moderna, confiable y tecnológicamente sólida.

---

## 1. Contexto del proyecto

HEIM realizará una caminata en beneficio de animales rescatados. La inscripción debe comunicar que la actividad tiene una finalidad social concreta y que la organización se toma en serio la seguridad, el bienestar de los asistentes y el tratamiento ordenado de la información.

El formulario original solicita:

- Nombre completo del participante.
- Teléfono o WhatsApp.
- Número de cédula.
- Nombre del perro.
- Raza o tamaño.
- Comportamiento del perro con otros perros y personas.
- Aceptación de recomendaciones y compromisos de seguridad.

La inscripción también informa que cada aporte recibido durante la actividad será destinado a esterilizar animales rescatados por el hogar de paso Ángeles de la Calle, en Circasia. La experiencia incluye póliza de seguro para el evento y un snack para el participante y su perro.

> La fecha, ubicación, cupos, valor del aporte, textos legales y datos específicos del evento deben administrarse como contenido configurable y no quedar escritos directamente en el código.

---

## 2. Visión del producto

El producto no debe sentirse como un formulario tradicional largo. Debe funcionar como una secuencia guiada de microdecisiones, donde el usuario responde una pregunta por vez, recibe orientación clara y avanza con un botón **Siguiente**.

La percepción esperada de la marca es:

- Organizada.
- Moderna.
- Empática.
- Tecnológica.
- Confiable.
- Responsable con el bienestar animal.

### Principio rector

> Cada pantalla debe pedir una sola decisión principal, reducir la carga cognitiva y mostrar al usuario por qué la información solicitada es importante.

---

## 3. Objetivos funcionales

### 3.1 Para el participante

- Comprender rápidamente el propósito de la caminata.
- Saber qué incluye su inscripción.
- Completar el registro desde un teléfono móvil en pocos minutos.
- Recibir mensajes de validación claros y humanos.
- Confirmar que su información fue registrada correctamente.
- Conocer las recomendaciones de seguridad antes de finalizar.
- Recibir un código o número único de inscripción.

### 3.2 Para el equipo HEIM

- Consultar todas las inscripciones desde un panel privado.
- Filtrar participantes y mascotas por características relevantes.
- Identificar perros que requieren atención especial, espacio o bozal.
- Visualizar métricas generales del evento.
- Exportar la base de datos en CSV o Excel.
- Actualizar el estado de cada inscripción.
- Registrar notas internas sin modificar la información original enviada.
- Configurar datos básicos del evento sin editar código.

---

## 4. Arquitectura general

El sistema se divide en dos productos conectados:

1. **Formulario público de inscripción.**
2. **Panel administrativo privado.**

### Rutas sugeridas

```text
/                         Landing breve del evento
/inscripcion              Formulario inteligente
/inscripcion/confirmacion Confirmación final
/admin/login               Acceso administrativo
/admin                     Dashboard general
/admin/inscripciones       Listado de registros
/admin/inscripciones/:id   Detalle de una inscripción
/admin/configuracion       Configuración del evento
/admin/exportaciones       Exportación de datos
```

---

## 5. Sistema visual de marca

### 5.1 Paleta cromática

| Token | Hex | Uso recomendado |
|---|---:|---|
| `brand-sky` | `#88B6C6` | Fondos suaves, indicadores de progreso, información secundaria |
| `brand-forest` | `#233F35` | Color principal, encabezados, botones primarios, navegación |
| `brand-lilac` | `#9187B8` | Acentos tecnológicos, estados seleccionados, ilustraciones |
| `brand-orange` | `#CC621B` | Llamados a la acción, alertas moderadas, énfasis emocional |
| `brand-lime` | `#D8DE6F` | Confirmaciones, badges, detalles positivos, progreso completado |
| `brand-ivory` | `#F2F1E7` | Fondo general claro y superficies cálidas |

### 5.2 Jerarquía de color

- **Fondo principal:** `#F2F1E7`.
- **Texto principal:** `#233F35`.
- **Botón primario:** fondo `#233F35`, texto blanco o marfil.
- **Botón secundario:** borde `#233F35`, fondo transparente.
- **Selección activa:** borde o relleno suave `#9187B8`.
- **Progreso:** combinación `#88B6C6` y `#D8DE6F`.
- **CTA emocional o donación:** `#CC621B`, usado con moderación.

### 5.3 Reglas de accesibilidad visual

- Mantener contraste mínimo WCAG AA.
- No depender únicamente del color para comunicar estados.
- Acompañar errores, alertas y confirmaciones con iconos y texto.
- Tamaño mínimo recomendado para controles táctiles: `44 × 44 px`.
- Tamaño base de texto móvil: `16 px`.

### 5.4 Tipografía sugerida

- **Principal:** Manrope, Inter, Plus Jakarta Sans o Geist.
- **Titulares:** peso 600–700.
- **Texto:** peso 400–500.
- **Etiquetas y metadatos:** peso 500, tamaño reducido y alto contraste.

### 5.5 Estilo de interfaz

- Tarjetas amplias con esquinas redondeadas entre `20 px` y `28 px`.
- Sombras suaves, sin efecto pesado.
- Uso moderado de glassmorphism únicamente en barras flotantes o tarjetas de resumen.
- Espaciado generoso y composición mobile-first.
- Ilustraciones o iconografía lineal relacionada con huellas, caminata, cuidado y comunidad.
- Animaciones cortas entre pasos: `180–280 ms`.

---

## 6. Experiencia del formulario

### 6.1 Estructura de navegación

- Una pregunta o decisión principal por pantalla.
- Botón fijo o claramente visible: **Siguiente**.
- Acción secundaria: **Volver**.
- Indicador de progreso visible.
- Guardado temporal local para evitar pérdida de datos.
- Avance permitido únicamente cuando la respuesta actual es válida.
- Transiciones suaves sin recargar la página.

### 6.2 Componentes persistentes

Cada paso debe mostrar:

- Logo HEIM.
- Nombre corto del evento.
- Indicador de progreso.
- Número del paso o nombre de la sección.
- Pregunta principal.
- Texto de ayuda cuando sea necesario.
- Área de respuesta.
- Botón **Siguiente**.
- Enlace **Volver** a partir del segundo paso.

### 6.3 Comportamiento mobile-first

- Tarjeta del formulario ocupando casi todo el ancho disponible.
- Botón principal de ancho completo.
- Campos con teclado adecuado según el tipo de dato.
- Evitar modales innecesarios.
- Mantener visible la acción principal cuando aparece el teclado.
- No usar tablas en el formulario público.

---

## 7. Flujo completo del formulario

## Paso 0 — Pantalla de bienvenida

### Objetivo

Explicar el propósito de la caminata y motivar al usuario a iniciar.

### Contenido sugerido

**Título:**  
`Camina con nosotros por quienes aún esperan un hogar`

**Texto:**  
`Tu participación ayuda a impulsar jornadas de esterilización para animales rescatados. Completar la inscripción toma aproximadamente 3 minutos.`

**Bloque informativo:**

- Póliza de seguro para el evento.
- Snack para el participante y su perro.
- Actividad con propósito social.

**CTA:**  
`Comenzar inscripción`

**Acción secundaria:**  
`Ver recomendaciones del evento`

---

## Paso 1 — Confirmación de participación

### Pregunta

`¿Participarás en la caminata con tu perro?`

### Opciones

- `Sí, asistiré con mi perro.`
- `Asistiré sin mascota.`

### Regla condicional

- Si elige asistir con mascota, activar el bloque completo de datos del perro.
- Si elige asistir sin mascota, omitir los pasos relacionados con la mascota y adaptar los compromisos de seguridad.

> Esta opción amplía el formulario original y debe poder desactivarse desde la configuración si el evento acepta únicamente participantes con perro.

---

## Paso 2 — Nombre del participante

### Pregunta

`¿Cuál es tu nombre completo?`

### Campo

- Tipo: texto.
- Autocompletado: `name`.
- Obligatorio: sí.
- Longitud recomendada: 3–100 caracteres.

### Ayuda

`Usaremos este nombre para identificar tu inscripción.`

### Validación

- No aceptar únicamente números.
- Eliminar espacios dobles.
- Capitalizar visualmente sin alterar agresivamente el valor original.

---

## Paso 3 — Teléfono o WhatsApp

### Pregunta

`¿A qué número podemos enviarte información importante del evento?`

### Campo

- Tipo: teléfono.
- Código de país visible.
- País predeterminado configurable; para Colombia: `+57`.
- Obligatorio: sí.

### Ayuda

`Solo lo utilizaremos para comunicaciones relacionadas con la caminata y tu inscripción.`

### Validación

- Normalizar el número en formato internacional E.164.
- Evitar duplicados cuando ya existe una inscripción activa con el mismo número.
- No bloquear automáticamente: mostrar una opción para recuperar o actualizar la inscripción.

---

## Paso 4 — Documento de identidad

### Pregunta

`¿Cuál es tu número de identificación?`

### Campos

- Tipo de documento.
- Número de documento.

### Opciones sugeridas

- Cédula de ciudadanía.
- Cédula de extranjería.
- Pasaporte.
- Otro.

### Reglas

- Campo obligatorio.
- Almacenar el valor cifrado o protegido.
- Mostrar parcialmente en el panel: `••••••1234`.
- Permitir que únicamente administradores autorizados vean el valor completo.

### Ayuda

`Este dato puede ser requerido para la póliza y la validación de tu participación.`

---

## Paso 5 — Correo electrónico

### Pregunta

`¿A qué correo deseas recibir la confirmación?`

### Campo

- Tipo: correo electrónico.
- Obligatorio: recomendado, configurable.
- Autocompletado: `email`.

### Ayuda

`Te enviaremos el resumen y el código de inscripción.`

> El correo no aparece en el formulario original; se recomienda incorporarlo para confirmación, recuperación y trazabilidad.

---

## Paso 6 — Nombre del perro

Visible únicamente para participantes con mascota.

### Pregunta

`¿Cómo se llama tu compañero de caminata?`

### Campo

- Tipo: texto.
- Obligatorio: sí.
- Longitud: 1–60 caracteres.

### Microcopy

`Queremos recibirlo por su nombre.`

---

## Paso 7 — Raza y tamaño

### Pregunta principal

`Cuéntanos un poco sobre {{pet_name}}`

### Campos

1. Raza o mezcla.
2. Tamaño.

### Opciones de tamaño

- Pequeño.
- Mediano.
- Grande.
- Gigante.
- No estoy seguro.

### Interacción

Usar tarjetas seleccionables con iconos o siluetas. La raza puede ser un campo de búsqueda con opción `Mestizo / mezcla`.

---

## Paso 8 — Comportamiento social

### Pregunta

`¿Cómo suele comportarse {{pet_name}} con otros perros y personas?`

### Opciones base

- `Es amigable y sociable.`
- `Puede ponerse nervioso y necesita espacio.`
- `Usará bozal durante el recorrido.`

### Mejora recomendada

Permitir selección múltiple y agregar:

- `Puede reaccionar ante perros desconocidos.`
- `Puede reaccionar ante grupos de personas.`
- `Prefiero conversar con el equipo antes del evento.`

### Campo condicional

Si el usuario selecciona una opción de atención especial, mostrar:

`¿Hay algo más que debamos saber para acompañarlos mejor?`

Campo de texto opcional, máximo 300 caracteres.

---

## Paso 9 — Estado de salud y capacidad física

### Pregunta

`¿Confirmas que {{pet_name}} se encuentra en condiciones de realizar actividad física moderada?`

### Opciones

- `Sí, se encuentra en buen estado de salud.`
- `Tengo una observación que deseo informar.`

### Campo condicional

Si elige la segunda opción, mostrar un campo breve para observaciones.

### Nota

No convertir el formulario en una evaluación veterinaria. La información es declarativa y preventiva.

---

## Paso 10 — Recomendaciones de seguridad

Presentar las recomendaciones en tarjetas o una lista progresiva, no como un bloque de texto denso.

### Compromisos

- Llevar al perro siempre con correa durante el recorrido.
- Llevar bolsas para recoger sus desechos.
- Usar bozal y traílla adecuados cuando corresponda.
- Confirmar que el perro puede realizar actividad física moderada.
- Asumir responsabilidad por el comportamiento y bienestar de la mascota durante la caminata.

### Interacción recomendada

Mostrar cada compromiso con icono y texto breve. Al final incluir un único control:

`He leído y acepto las recomendaciones y compromisos de seguridad.`

### Regla

La aceptación es obligatoria para continuar.

---

## Paso 11 — Tratamiento de datos y comunicaciones

### Controles separados

1. **Obligatorio:** autorización para recolectar y tratar los datos necesarios para gestionar la inscripción y la operación del evento.
2. **Opcional:** autorización para recibir información de futuras actividades de HEIM.
3. **Opcional:** autorización para uso de imágenes o material audiovisual, únicamente si la organización lo requiere y cuenta con un texto legal aprobado.

### Regla crítica

No agrupar consentimiento operativo y marketing en una sola casilla.

---

## Paso 12 — Resumen antes de enviar

### Contenido

Mostrar una tarjeta editable con:

- Nombre del participante.
- Teléfono.
- Correo.
- Tipo y número de documento parcialmente oculto.
- Participación con o sin mascota.
- Datos de la mascota.
- Observaciones de comportamiento o salud.
- Compromisos aceptados.

### Acciones

- `Editar datos`.
- `Confirmar inscripción`.

---

## Paso 13 — Confirmación

### Estado exitoso

**Título:**  
`¡Tu inscripción está confirmada!`

**Contenido:**

- Código único de inscripción.
- Nombre del participante.
- Nombre de la mascota, cuando aplique.
- Fecha y lugar del evento.
- Recomendaciones esenciales.
- Botón para descargar o guardar el comprobante.
- Botón para agregar el evento al calendario.
- Botón para compartir la caminata.

### Código sugerido

```text
HEIM-2026-000184
```

### Comunicación automática

Enviar confirmación por correo y, cuando exista integración autorizada, por WhatsApp.

---

## 8. Lógica condicional e inteligencia del formulario

El formulario debe adaptar textos y preguntas según las respuestas previas.

### Reglas principales

```text
SI participa_con_mascota = false
  OMITIR datos de mascota
  ADAPTAR recomendaciones

SI comportamiento incluye "necesita espacio"
  MARCAR nivel_atencion = medio
  MOSTRAR campo de observaciones

SI comportamiento incluye "reactivo" o "bozal"
  MARCAR nivel_atencion = alto
  MOSTRAR recomendación especial
  DESTACAR registro en el panel admin

SI estado_salud = "observación"
  MOSTRAR campo de observación
  MARCAR revisión_recomendada = true

SI teléfono o documento ya existe
  MOSTRAR flujo para recuperar o actualizar inscripción
  NO crear duplicado silencioso
```

### Personalización del lenguaje

A partir del nombre de la mascota, usar mensajes como:

- `Ahora cuéntanos sobre Luna.`
- `¿Cómo se relaciona Luna con otros perros?`
- `Gracias. Esta información nos ayuda a cuidar mejor la experiencia de Luna y de los demás asistentes.`

---

## 9. Mensajes de validación

Los errores deben explicar cómo resolver el problema.

| Caso | Mensaje recomendado |
|---|---|
| Nombre vacío | `Escribe tu nombre completo para continuar.` |
| Teléfono inválido | `Revisa el número e incluye todos los dígitos.` |
| Documento inválido | `Verifica que el número de identificación esté completo.` |
| Correo inválido | `Escribe un correo válido, por ejemplo nombre@correo.com.` |
| Campo obligatorio | `Necesitamos esta información para completar tu inscripción.` |
| Consentimiento pendiente | `Debes aceptar este compromiso para finalizar la inscripción.` |
| Error de red | `No pudimos guardar tu respuesta. Tus datos siguen aquí; intenta nuevamente.` |
| Registro duplicado | `Encontramos una inscripción asociada a estos datos. Puedes revisarla o actualizarla.` |

---

## 10. Estados especiales

### Guardando

- Deshabilitar temporalmente el botón.
- Mostrar spinner y texto: `Guardando tu inscripción…`.

### Éxito

- Animación discreta.
- Código de confirmación visible.
- Acciones posteriores claras.

### Error de servidor

- Mantener los datos en el navegador.
- Permitir reintento.
- Registrar el error técnico.
- No mostrar mensajes internos del servidor.

### Sesión abandonada

- Guardar temporalmente el progreso en `localStorage` o almacenamiento seguro.
- Ofrecer continuar desde el último paso.
- Eliminar automáticamente el borrador después del tiempo configurado.

---

## 11. Panel administrativo

## 11.1 Acceso

- Inicio de sesión privado.
- Autenticación con correo y contraseña.
- Recuperación de contraseña.
- Sesiones seguras.
- Opción futura de autenticación de dos factores.
- No permitir registro público de administradores.

### Roles sugeridos

| Rol | Permisos |
|---|---|
| Superadministrador | Acceso completo, usuarios, configuración y exportaciones |
| Coordinador | Consultar, editar estados, agregar notas y exportar |
| Operador | Consultar registros y registrar asistencia |
| Solo lectura | Consultar métricas y registros sin editar |

---

## 11.2 Dashboard principal

### Métricas

- Total de inscripciones.
- Participantes con mascota.
- Participantes sin mascota.
- Total de perros registrados.
- Perros pequeños, medianos, grandes y gigantes.
- Registros con atención especial.
- Registros pendientes, confirmados, cancelados y asistieron.
- Inscripciones por día.
- Tasa de finalización del formulario.
- Paso con mayor abandono.

### Visualizaciones

- Tarjetas KPI.
- Gráfico de inscripciones por fecha.
- Distribución por tamaño de mascota.
- Distribución por comportamiento.
- Embudo de finalización del formulario.

---

## 11.3 Tabla de inscripciones

### Columnas recomendadas

- Código.
- Fecha de registro.
- Participante.
- Teléfono.
- Mascota.
- Tamaño.
- Nivel de atención.
- Estado.
- Consentimiento operativo.
- Acciones.

### Filtros

- Texto libre.
- Fecha de registro.
- Estado de inscripción.
- Participación con o sin mascota.
- Tamaño de mascota.
- Comportamiento.
- Uso de bozal.
- Nivel de atención.
- Asistencia.

### Acciones rápidas

- Ver detalle.
- Marcar como confirmada.
- Marcar asistencia.
- Cancelar inscripción.
- Copiar teléfono.
- Enviar mensaje desde una integración aprobada.
- Exportar selección.

---

## 11.4 Vista de detalle

### Secciones

1. Datos del participante.
2. Datos de la mascota.
3. Comportamiento y salud declarada.
4. Compromisos y consentimientos.
5. Estado de la inscripción.
6. Historial de cambios.
7. Notas internas.

### Seguridad visual

- Ocultar parcialmente el documento de identidad.
- Botón para revelar únicamente con permiso especial.
- Registrar en auditoría quién consultó datos sensibles.

---

## 11.5 Estados de inscripción

```text
BORRADOR
ENVIADA
CONFIRMADA
PENDIENTE_REVISION
CANCELADA
ASISTIO
NO_ASISTIO
```

### Reglas

- El formulario público crea una inscripción en estado `ENVIADA`.
- Puede pasar automáticamente a `CONFIRMADA` cuando no requiere revisión.
- Los casos con alertas pueden pasar a `PENDIENTE_REVISION`.
- Todo cambio manual debe quedar en el historial.

---

## 11.6 Configuración del evento

El panel debe permitir editar:

- Nombre del evento.
- Fecha y hora.
- Lugar y enlace de ubicación.
- Descripción.
- Beneficiario de la actividad.
- Qué incluye la inscripción.
- Cupo máximo.
- Estado de inscripciones: abiertas o cerradas.
- Fecha límite de inscripción.
- Permitir participantes sin mascota.
- Solicitar correo obligatorio u opcional.
- Textos de compromisos.
- Textos de privacidad.
- Plantilla del correo de confirmación.
- Logo e imagen principal.
- Redes sociales y datos de contacto.

---

## 12. Modelo de datos

### 12.1 Tabla `events`

```sql
id uuid primary key
name text not null
slug text unique not null
description text
beneficiary text
starts_at timestamptz
ends_at timestamptz
location_name text
location_url text
registration_deadline timestamptz
capacity integer
registration_status text
allow_without_pet boolean default false
settings jsonb
created_at timestamptz
updated_at timestamptz
```

### 12.2 Tabla `registrations`

```sql
id uuid primary key
event_id uuid references events(id)
registration_code text unique not null
status text not null
full_name text not null
phone_e164 text not null
email text
document_type text
document_number_encrypted text
attends_with_pet boolean not null
safety_accepted boolean not null
privacy_accepted boolean not null
marketing_accepted boolean default false
image_consent_accepted boolean default false
internal_attention_level text default 'normal'
submitted_at timestamptz
created_at timestamptz
updated_at timestamptz
```

### 12.3 Tabla `pets`

```sql
id uuid primary key
registration_id uuid references registrations(id)
name text not null
breed text
size text
behavior_tags text[]
behavior_notes text
health_status text
health_notes text
requires_muzzle boolean default false
requires_review boolean default false
created_at timestamptz
updated_at timestamptz
```

### 12.4 Tabla `registration_notes`

```sql
id uuid primary key
registration_id uuid references registrations(id)
author_user_id uuid not null
note text not null
created_at timestamptz
```

### 12.5 Tabla `registration_status_history`

```sql
id uuid primary key
registration_id uuid references registrations(id)
previous_status text
new_status text not null
changed_by uuid
reason text
created_at timestamptz
```

### 12.6 Tabla `admin_users`

```sql
id uuid primary key
email text unique not null
full_name text
role text not null
active boolean default true
created_at timestamptz
updated_at timestamptz
```

### 12.7 Tabla `audit_logs`

```sql
id uuid primary key
admin_user_id uuid
action text not null
entity_type text
entity_id uuid
metadata jsonb
ip_hash text
created_at timestamptz
```

---

## 13. API y servicios

### Endpoints sugeridos

```text
POST   /api/registrations
GET    /api/registrations/:code
PATCH  /api/registrations/:id
POST   /api/registrations/:id/confirm
POST   /api/registrations/:id/cancel
POST   /api/registrations/:id/check-in
GET    /api/admin/registrations
GET    /api/admin/registrations/:id
POST   /api/admin/registrations/:id/notes
GET    /api/admin/dashboard
GET    /api/admin/exports/registrations.csv
GET    /api/admin/events/:id
PATCH  /api/admin/events/:id
```

### Reglas técnicas

- Validar datos en cliente y servidor.
- Aplicar rate limiting al endpoint público.
- Utilizar idempotencia para evitar registros duplicados por doble clic.
- No devolver documentos completos en listados.
- Sanitizar entradas de texto.
- Registrar errores sin exponer información sensible.

---

## 14. Stack tecnológico recomendado

### Frontend

- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui o sistema de componentes propio.
- React Hook Form.
- Zod para esquemas y validación.
- Framer Motion para transiciones controladas.

### Backend y datos

- Supabase:
  - PostgreSQL.
  - Auth.
  - Row Level Security.
  - Storage para logos o imágenes.
  - Edge Functions cuando se requiera lógica aislada.

### Servicios complementarios

- Resend o proveedor transaccional para correos.
- Integración oficial con WhatsApp únicamente mediante proveedor autorizado.
- Vercel para despliegue.
- Sentry para errores.
- Plausible, PostHog o analítica respetuosa para medir abandono del formulario.

---

## 15. Estructura de componentes

```text
src/
├── app/
│   ├── page.tsx
│   ├── inscripcion/
│   │   ├── page.tsx
│   │   └── confirmacion/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── inscripciones/page.tsx
│   │   ├── inscripciones/[id]/page.tsx
│   │   └── configuracion/page.tsx
│   └── api/
├── components/
│   ├── form/
│   │   ├── FormShell.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── StepHeader.tsx
│   │   ├── ChoiceCard.tsx
│   │   ├── TextField.tsx
│   │   ├── PhoneField.tsx
│   │   ├── ConsentCard.tsx
│   │   ├── ReviewCard.tsx
│   │   └── NavigationControls.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── MetricsGrid.tsx
│   │   ├── RegistrationTable.tsx
│   │   ├── FiltersBar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── RegistrationDetail.tsx
│   └── ui/
├── lib/
│   ├── validation/
│   ├── supabase/
│   ├── security/
│   ├── analytics/
│   └── formatting/
└── types/
```

---

## 16. Estado global del formulario

### Estructura sugerida

```ts
type RegistrationFormState = {
  eventId: string;
  currentStep: number;
  attendsWithPet: boolean | null;
  participant: {
    fullName: string;
    phone: string;
    email?: string;
    documentType: string;
    documentNumber: string;
  };
  pet?: {
    name: string;
    breed?: string;
    size: 'small' | 'medium' | 'large' | 'giant' | 'unknown';
    behaviorTags: string[];
    behaviorNotes?: string;
    healthStatus: 'healthy' | 'observation';
    healthNotes?: string;
  };
  consents: {
    safety: boolean;
    privacy: boolean;
    marketing: boolean;
    imageUse: boolean;
  };
};
```

---

## 17. Seguridad y privacidad

- Implementar HTTPS obligatorio.
- Proteger el panel con autenticación y roles.
- Aplicar Row Level Security en todas las tablas administrativas.
- Cifrar o tokenizar el número de documento.
- Evitar incluir información sensible en URLs, logs o analytics.
- Registrar accesos administrativos a datos sensibles.
- Definir política de retención y eliminación de datos.
- Solicitar únicamente la información necesaria.
- Mantener separados los consentimientos obligatorios y promocionales.
- Preparar textos de privacidad para revisión jurídica antes de publicar.

---

## 18. Accesibilidad

- Navegación completa por teclado.
- Labels asociados a todos los campos.
- Mensajes de error vinculados mediante `aria-describedby`.
- Estados seleccionados anunciados por lectores de pantalla.
- Foco visible.
- Respeto por `prefers-reduced-motion`.
- Contraste suficiente en botones, textos y bordes.
- Lenguaje simple y comprensible.

---

## 19. Analítica del formulario

Registrar eventos sin almacenar información sensible:

```text
form_started
step_viewed
step_completed
validation_error
form_abandoned
form_resumed
registration_submitted
registration_success
registration_failed
```

### Métricas clave

- Porcentaje de inicio.
- Porcentaje de finalización.
- Tiempo promedio de inscripción.
- Tasa de abandono por paso.
- Errores más frecuentes.
- Dispositivo utilizado.
- Fuente de tráfico mediante parámetros UTM.

---

## 20. Exportaciones

### Formatos

- CSV.
- XLSX.
- PDF individual de inscripción, opcional.

### Campos de exportación

- Código.
- Fecha de envío.
- Estado.
- Nombre.
- Teléfono.
- Correo.
- Tipo de documento.
- Documento parcialmente oculto o completo según permiso.
- Participa con mascota.
- Nombre de la mascota.
- Raza.
- Tamaño.
- Comportamiento.
- Requiere bozal.
- Observaciones.
- Estado de salud declarado.
- Compromisos aceptados.
- Consentimientos.
- Asistencia.

---

## 21. Diseño del panel administrativo

### Layout

- Sidebar fija en escritorio y drawer en móvil.
- Encabezado con nombre del evento y usuario activo.
- Fondo marfil.
- Tarjetas blancas o marfil claro.
- Navegación principal en verde oscuro.
- Estados y alertas con badges semánticos.

### Navegación

```text
Resumen
Inscripciones
Atención especial
Asistencia
Exportaciones
Configuración
Usuarios
```

### Experiencia

- Búsqueda instantánea con debounce.
- Filtros persistentes durante la sesión.
- Paginación del lado del servidor.
- Columnas configurables.
- Confirmación antes de acciones destructivas.
- Toasts claros para éxito o error.

---

## 22. Reglas de negocio

1. Cada inscripción debe pertenecer a un evento.
2. Cada inscripción debe tener un código único.
3. Un participante no debe crear duplicados involuntarios.
4. Una inscripción con mascota debe tener al menos un registro de mascota.
5. Los compromisos de seguridad y privacidad operativa son obligatorios.
6. Los consentimientos de marketing e imagen son independientes y opcionales.
7. Casos de comportamiento reactivo, uso de bozal u observaciones de salud deben poder marcarse para revisión.
8. Los administradores no deben modificar silenciosamente la respuesta original del usuario.
9. Los cambios de estado deben almacenarse en un historial.
10. Las exportaciones con información sensible requieren permisos elevados.

---

## 23. Criterios de aceptación

### Formulario público

- [ ] Funciona correctamente en móvil, tableta y escritorio.
- [ ] Presenta una microdecisión principal por paso.
- [ ] Conserva el progreso al retroceder.
- [ ] Adapta el flujo según participación con o sin mascota.
- [ ] Valida campos en cliente y servidor.
- [ ] Evita envíos duplicados.
- [ ] Genera un código único.
- [ ] Muestra confirmación final.
- [ ] Envía correo de confirmación.
- [ ] Mantiene los datos si ocurre un error temporal.

### Panel administrativo

- [ ] Requiere autenticación.
- [ ] Permite consultar, filtrar y ordenar inscripciones.
- [ ] Permite visualizar casos de atención especial.
- [ ] Permite cambiar estados con historial.
- [ ] Permite agregar notas internas.
- [ ] Permite exportar CSV o XLSX.
- [ ] Oculta documentos por defecto.
- [ ] Respeta permisos por rol.
- [ ] Permite configurar los datos principales del evento.

### Calidad

- [ ] Cumple accesibilidad WCAG AA en elementos esenciales.
- [ ] No expone información sensible en logs o URLs.
- [ ] Tiene manejo de errores y estados de carga.
- [ ] Incluye pruebas de validación y flujo principal.
- [ ] Mantiene un rendimiento adecuado en conexiones móviles.

---

## 24. Pruebas mínimas

### Unitarias

- Validación de teléfono.
- Validación de correo.
- Generación de código.
- Reglas condicionales.
- Normalización de datos.

### Integración

- Creación de inscripción.
- Prevención de duplicados.
- Envío de confirmación.
- Cambio de estado.
- Exportación.

### End-to-end

1. Usuario con mascota sociable.
2. Usuario con mascota que requiere bozal.
3. Usuario sin mascota.
4. Usuario que abandona y retoma.
5. Usuario con datos duplicados.
6. Error de red durante el envío.
7. Administrador que filtra y exporta.

---

## 25. Fases de desarrollo

### Fase 1 — Fundamentos

- Diseño UI.
- Sistema de componentes.
- Modelo de datos.
- Autenticación administrativa.
- Configuración inicial del evento.

### Fase 2 — Formulario público

- Flujo por pasos.
- Validaciones.
- Condicionales.
- Persistencia temporal.
- Confirmación.

### Fase 3 — Panel administrativo

- Dashboard.
- Tabla y filtros.
- Vista de detalle.
- Estados y notas.
- Exportación.

### Fase 4 — Automatizaciones

- Correo de confirmación.
- Recordatorio previo al evento.
- Integración opcional con WhatsApp.
- Exportaciones programadas, si se requieren.

### Fase 5 — Calidad y lanzamiento

- Pruebas.
- Accesibilidad.
- Seguridad.
- Analítica.
- Optimización móvil.
- Publicación.

---

## 26. Contenido editable recomendado

Todo este contenido debe administrarse desde configuración o archivos de contenido:

- Título principal.
- Texto del propósito social.
- Beneficiario.
- Fecha y lugar.
- Qué incluye la inscripción.
- Recomendaciones.
- Compromisos.
- Mensajes de éxito.
- Datos de contacto.
- Enlaces sociales.
- Políticas.
- Plantillas de correo.

---

## 27. Dirección creativa final

La experiencia debe unir tres ideas:

1. **Cuidado:** lenguaje empático y visual cálido.
2. **Orden:** jerarquía clara, pasos breves y comunicación precisa.
3. **Tecnología humana:** interfaz contemporánea que simplifica el proceso sin sentirse fría.

El formulario debe hacer que el usuario perciba que su participación tiene un propósito real y que HEIM está preparada para organizar la caminata de manera responsable, segura y profesional.

---

## 28. Entregables esperados

- Diseño responsive del formulario.
- Diseño responsive del panel administrativo.
- Sistema de componentes.
- Base de datos y políticas de seguridad.
- Formulario funcional.
- Panel con filtros, detalle y exportaciones.
- Correos transaccionales.
- Documentación de despliegue.
- Manual breve de uso para administradores.
- Pruebas del flujo principal.

---

## 29. Resultado esperado

Una plataforma de inscripción ágil y visualmente coherente con HEIM, capaz de transformar un formulario básico en una experiencia guiada, confiable y medible, mientras proporciona al equipo organizador una base de datos limpia, útil y segura para operar la caminata.
