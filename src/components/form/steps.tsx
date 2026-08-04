"use client";

import type { RegistrationFormState, BehaviorTag } from "@/types/registration";
import { eventConfig } from "@/config/event";
import {
  fullNameSchema,
  phoneSchema,
  emailSchema,
  documentSchema,
} from "@/lib/validation/registration";
import { ChoiceCard } from "./ChoiceCard";
import { TextField } from "./TextField";
import { StepHeader } from "./StepHeader";

/** Helpers que el motor entrega a cada paso. */
export type StepApi = {
  state: RegistrationFormState;
  updateParticipant: (p: Partial<RegistrationFormState["participant"]>) => void;
  updatePet: (p: Partial<NonNullable<RegistrationFormState["pet"]>>) => void;
  updateConsents: (p: Partial<RegistrationFormState["consents"]>) => void;
  update: (p: Partial<RegistrationFormState>) => void;
  showErrors: boolean;
};

export type StepDef = {
  id: string;
  section: string;
  /** Determina si el paso aplica según respuestas previas (§8). */
  isActive: (s: RegistrationFormState) => boolean;
  /** Avance permitido solo si la respuesta es válida (§6.1). */
  isValid: (s: RegistrationFormState) => boolean;
  render: (api: StepApi) => React.ReactNode;
  nextLabel?: string;
};

const petName = (s: RegistrationFormState) =>
  s.pet?.name?.trim() || "tu perro";

const BEHAVIOR_OPTIONS: { value: BehaviorTag; title: string; special?: boolean }[] = [
  { value: "friendly", title: "Es amigable y sociable." },
  { value: "needs_space", title: "Puede ponerse nervioso y necesita espacio.", special: true },
  { value: "muzzle", title: "Usará bozal durante el recorrido.", special: true },
  { value: "reactive_dogs", title: "Puede reaccionar ante perros desconocidos.", special: true },
  { value: "reactive_people", title: "Puede reaccionar ante grupos de personas.", special: true },
  { value: "wants_to_talk", title: "Prefiero conversar con el equipo antes del evento.", special: true },
];

/**
 * Definición declarativa del flujo (§7). El motor filtra por `isActive`,
 * por lo que los pasos de mascota se omiten automáticamente si el
 * participante asiste sin perro (§8).
 */
export const steps: StepDef[] = [
  // Paso 1 — Confirmación de participación
  {
    id: "participation",
    section: "Participación",
    isActive: () => true,
    isValid: (s) => s.attendsWithPet !== null,
    render: ({ state, update }) => (
      <div className="space-y-4">
        <StepHeader title="¿Participarás en la caminata con tu perro?" />
        <div className="space-y-3">
          <ChoiceCard
            selected={state.attendsWithPet === true}
            onSelect={() => update({ attendsWithPet: true })}
            title="Sí, asistiré con mi perro."
          />
          {eventConfig.allowWithoutPet && (
            <ChoiceCard
              selected={state.attendsWithPet === false}
              onSelect={() => update({ attendsWithPet: false })}
              title="No, asistiré sin mascota."
            />
          )}
        </div>
      </div>
    ),
  },

  // Paso 2 — Nombre del participante
  {
    id: "name",
    section: "Tus datos",
    isActive: () => true,
    isValid: (s) => fullNameSchema.safeParse(s.participant.fullName).success,
    render: ({ state, updateParticipant, showErrors }) => (
      <div className="space-y-4">
        <StepHeader title="¿Cuál es tu nombre completo?" />
        <TextField
          label="Nombre completo"
          autoComplete="name"
          value={state.participant.fullName}
          onChange={(v) => updateParticipant({ fullName: v })}
          help="Usaremos este nombre para identificar tu inscripción."
          error={
            showErrors && !fullNameSchema.safeParse(state.participant.fullName).success
              ? "Escribe tu nombre completo para continuar."
              : undefined
          }
        />
      </div>
    ),
  },

  // Paso 3 — Teléfono o WhatsApp
  {
    id: "phone",
    section: "Tus datos",
    isActive: () => true,
    isValid: (s) => phoneSchema.safeParse(s.participant.phone).success,
    render: ({ state, updateParticipant, showErrors }) => (
      <div className="space-y-4">
        <StepHeader
          title="¿A qué número podemos enviarte información importante del evento?"
          help="Solo lo usaremos para comunicaciones relacionadas con la caminata y tu inscripción."
        />
        <TextField
          label="Teléfono o WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          value={state.participant.phone}
          onChange={(v) => updateParticipant({ phone: v })}
          error={
            showErrors && !phoneSchema.safeParse(state.participant.phone).success
              ? "Revisa el número e incluye todos los dígitos."
              : undefined
          }
        />
      </div>
    ),
  },

  // Paso 4 — Documento de identidad
  {
    id: "document",
    section: "Tus datos",
    isActive: () => true,
    isValid: (s) =>
      documentSchema.safeParse({
        documentType: s.participant.documentType,
        documentNumber: s.participant.documentNumber,
      }).success,
    render: ({ state, updateParticipant, showErrors }) => {
      const docTypes = [
        { value: "cc", label: "Cédula de ciudadanía" },
        { value: "ce", label: "Cédula de extranjería" },
        { value: "passport", label: "Pasaporte" },
        { value: "other", label: "Otro" },
      ] as const;
      return (
        <div className="space-y-4">
          <StepHeader
            title="¿Cuál es tu número de identificación?"
            help="Este dato puede ser requerido para la póliza y la validación de tu participación."
          />
          <div className="grid grid-cols-2 gap-2">
            {docTypes.map((d) => (
              <ChoiceCard
                key={d.value}
                selected={state.participant.documentType === d.value}
                onSelect={() => updateParticipant({ documentType: d.value })}
                title={d.label}
              />
            ))}
          </div>
          <TextField
            label="Número de documento"
            inputMode="numeric"
            value={state.participant.documentNumber}
            onChange={(v) => updateParticipant({ documentNumber: v })}
            error={
              showErrors && state.participant.documentNumber.trim().length < 4
                ? "Verifica que el número de identificación esté completo."
                : undefined
            }
          />
        </div>
      );
    },
  },

  // Paso 5 — Correo electrónico
  {
    id: "email",
    section: "Tus datos",
    isActive: () => true,
    isValid: (s) =>
      eventConfig.emailRequired
        ? emailSchema.safeParse(s.participant.email).success
        : !s.participant.email || emailSchema.safeParse(s.participant.email).success,
    render: ({ state, updateParticipant, showErrors }) => (
      <div className="space-y-4">
        <StepHeader
          title="¿A qué correo deseas recibir la confirmación?"
          help="Te enviaremos el resumen y el código de inscripción."
        />
        <TextField
          label={eventConfig.emailRequired ? "Correo electrónico" : "Correo electrónico (opcional)"}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={state.participant.email ?? ""}
          onChange={(v) => updateParticipant({ email: v })}
          error={
            showErrors &&
            !(eventConfig.emailRequired
              ? emailSchema.safeParse(state.participant.email).success
              : !state.participant.email || emailSchema.safeParse(state.participant.email).success)
              ? "Escribe un correo válido, por ejemplo nombre@correo.com."
              : undefined
          }
        />
      </div>
    ),
  },

  // Paso 6 — Nombre del perro (condicional)
  {
    id: "pet-name",
    section: "Tu perro",
    isActive: (s) => s.attendsWithPet === true,
    isValid: (s) => (s.pet?.name?.trim().length ?? 0) >= 1,
    render: ({ state, updatePet, showErrors }) => (
      <div className="space-y-4">
        <StepHeader
          title="¿Cómo se llama tu compañero de caminata?"
          help="Queremos recibirlo por su nombre."
        />
        <TextField
          label="Nombre del perro"
          value={state.pet?.name ?? ""}
          onChange={(v) => updatePet({ name: v })}
          maxLength={60}
          error={
            showErrors && !(state.pet?.name?.trim())
              ? "Escribe el nombre de tu perro para continuar."
              : undefined
          }
        />
      </div>
    ),
  },

  // Paso 8 — Comportamiento social (condicional, selección múltiple)
  {
    id: "behavior",
    section: "Tu perro",
    isActive: (s) => s.attendsWithPet === true,
    isValid: (s) => (s.pet?.behaviorTags.length ?? 0) > 0,
    render: ({ state, updatePet }) => {
      const tags = state.pet?.behaviorTags ?? [];
      const toggle = (t: BehaviorTag) =>
        updatePet({
          behaviorTags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t],
        });
      const needsNote = tags.some((t) => t !== "friendly");
      return (
        <div className="space-y-4">
          <StepHeader
            title={`¿Cómo suele comportarse ${petName(state)} con otros perros y personas?`}
            help="Puedes elegir varias opciones."
          />
          <div className="space-y-2">
            {BEHAVIOR_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.value}
                multiple
                selected={tags.includes(o.value)}
                onSelect={() => toggle(o.value)}
                title={o.title}
              />
            ))}
          </div>
          {needsNote && (
            <TextField
              label="¿Hay algo más que debamos saber para acompañarlos mejor?"
              value={state.pet?.behaviorNotes ?? ""}
              onChange={(v) => updatePet({ behaviorNotes: v })}
              maxLength={300}
            />
          )}
        </div>
      );
    },
  },

  // Paso 9 — Estado de salud y capacidad física (condicional)
  {
    id: "health",
    section: "Tu perro",
    isActive: (s) => s.attendsWithPet === true,
    isValid: (s) =>
      s.pet?.healthStatus === "healthy" ||
      (s.pet?.healthStatus === "observation" && (s.pet?.healthNotes?.trim().length ?? 0) > 0),
    render: ({ state, updatePet }) => {
      const status = state.pet?.healthStatus ?? "healthy";
      return (
        <div className="space-y-4">
          <StepHeader
            title={`¿Confirmas que ${petName(state)} está en condiciones de realizar actividad física moderada?`}
            help="La información es declarativa y preventiva, no una evaluación veterinaria."
          />
          <div className="space-y-3">
            <ChoiceCard
              selected={status === "healthy"}
              onSelect={() => updatePet({ healthStatus: "healthy", healthNotes: "" })}
              title="Sí, se encuentra en buen estado de salud."
            />
            <ChoiceCard
              selected={status === "observation"}
              onSelect={() => updatePet({ healthStatus: "observation" })}
              title="Tengo una observación que deseo informar."
            />
          </div>
          {status === "observation" && (
            <TextField
              label="Cuéntanos brevemente"
              value={state.pet?.healthNotes ?? ""}
              onChange={(v) => updatePet({ healthNotes: v })}
              maxLength={300}
            />
          )}
        </div>
      );
    },
  },

  // Paso 10/11 — Recomendaciones y consentimientos (combinado)
  {
    id: "consents",
    section: "Seguridad y datos",
    isActive: () => true,
    isValid: (s) => s.consents.safety && s.consents.privacy,
    nextLabel: "Revisar inscripción",
    render: ({ state, updateConsents }) => (
      <div className="space-y-4">
        <StepHeader
          title="Recomendaciones y compromisos de seguridad"
          help="Estas medidas cuidan a todos los asistentes y a sus mascotas."
        />
        <ul className="space-y-1.5 rounded-2xl bg-brand-sky/15 p-4 text-sm text-brand-forest/80">
          <li>• Llevar al perro siempre con correa durante el recorrido.</li>
          <li>• Llevar bolsas para recoger sus desechos.</li>
          <li>• Usar bozal y traílla adecuados cuando corresponda.</li>
          <li>• Asumir la responsabilidad por el bienestar de la mascota.</li>
        </ul>
        <div className="space-y-3 pt-1">
          <ChoiceCard
            multiple
            selected={state.consents.safety}
            onSelect={() => updateConsents({ safety: !state.consents.safety })}
            title="He leído y acepto las recomendaciones y compromisos de seguridad."
          />
          <ChoiceCard
            multiple
            selected={state.consents.privacy}
            onSelect={() => updateConsents({ privacy: !state.consents.privacy })}
            title="Autorizo el tratamiento de mis datos para gestionar la inscripción."
          />
          <ChoiceCard
            multiple
            selected={state.consents.marketing}
            onSelect={() => updateConsents({ marketing: !state.consents.marketing })}
            title="Quiero recibir información de futuras actividades de HEIM. (opcional)"
          />
          <ChoiceCard
            multiple
            selected={state.consents.imageUse}
            onSelect={() => updateConsents({ imageUse: !state.consents.imageUse })}
            title="Autorizo el uso de imágenes o material audiovisual del evento. (opcional)"
          />
        </div>
      </div>
    ),
  },
];

/** Devuelve los pasos activos para el estado actual (§8). */
export function activeSteps(state: RegistrationFormState): StepDef[] {
  return steps.filter((s) => s.isActive(state));
}
