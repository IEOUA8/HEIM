/** Estados de inscripción (§11.5). */
export const REGISTRATION_STATUSES = [
  "BORRADOR",
  "ENVIADA",
  "CONFIRMADA",
  "PENDIENTE_REVISION",
  "CANCELADA",
  "ASISTIO",
  "NO_ASISTIO",
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
  CONFIRMADA: "Confirmada",
  PENDIENTE_REVISION: "Pendiente de revisión",
  CANCELADA: "Cancelada",
  ASISTIO: "Asistió",
  NO_ASISTIO: "No asistió",
};

/** Estados a los que un administrador puede cambiar manualmente. */
export const MANAGEABLE_STATUSES: RegistrationStatus[] = [
  "CONFIRMADA",
  "PENDIENTE_REVISION",
  "CANCELADA",
  "ASISTIO",
  "NO_ASISTIO",
];

export function isValidStatus(value: string): value is RegistrationStatus {
  return (REGISTRATION_STATUSES as readonly string[]).includes(value);
}
