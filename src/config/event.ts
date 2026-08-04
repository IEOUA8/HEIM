/**
 * Configuración del evento — contenido editable (§26 del documento maestro).
 *
 * NADA de esto debe quedar escrito directamente dentro de los componentes.
 * En producción, estos valores provienen de la tabla `events` (§12.1) y del
 * panel de configuración (§11.6). Este archivo actúa como valores por defecto
 * y única fuente de verdad mientras no exista backend conectado.
 */

export type EventConfig = {
  name: string;
  shortName: string;
  slug: string;
  beneficiary: string;
  purposeText: string;
  includes: string[];
  location: { name: string; url?: string };
  startsAt: string | null; // ISO 8601
  registrationDeadline: string | null;
  capacity: number | null;
  registrationOpen: boolean;
  /** Permitir participantes sin mascota (Paso 1, §7). */
  allowWithoutPet: boolean;
  /** Correo obligatorio u opcional (Paso 5, §7). */
  emailRequired: boolean;
  defaultCountry: "CO";
  contact: { whatsapp?: string; instagram?: string; email?: string };
};

export const eventConfig: EventConfig = {
  name: "Caminata por los animales",
  shortName: "Caminata HEIM",
  slug: "caminata-heim-2026",
  beneficiary: "Hogar de paso Ángeles de la Calle, Circasia",
  purposeText:
    "Tu participación ayuda a impulsar jornadas de esterilización para animales rescatados. Completar la inscripción toma aproximadamente 3 minutos.",
  includes: [
    "Póliza de seguro para el evento",
    "Snack para el participante y su perro",
    "Actividad con propósito social",
  ],
  location: { name: "Por confirmar" },
  startsAt: null,
  registrationDeadline: null,
  capacity: null,
  registrationOpen: true,
  allowWithoutPet: true,
  emailRequired: true,
  defaultCountry: "CO",
  contact: {},
};
