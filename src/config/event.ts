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
  slug: "caminata-heim",
  beneficiary: "Hogar de paso Ángeles de la Calle, Circasia",
  purposeText:
    "Llegamos a nuestro primer año y queremos celebrarlo con nuevos proyectos para seguir ayudando, pero esta vez queremos hacerlo contigo.",
  includes: [
    "Póliza de seguro para el evento",
    "Snack para el participante y su perro",
  ],
  location: { name: "Circasia, Quindío" },
  startsAt: "2026-09-06T08:00:00-05:00",
  registrationDeadline: null,
  capacity: null,
  registrationOpen: true,
  allowWithoutPet: true,
  emailRequired: true,
  defaultCountry: "CO",
  contact: {},
};
