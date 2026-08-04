/**
 * Estado global del formulario de inscripción.
 * Referencia: DOCUMENTO-MAESTRO.md §16.
 */

export type PetSize = "small" | "medium" | "large" | "giant" | "unknown";
export type HealthStatus = "healthy" | "observation";
export type DocumentType = "cc" | "ce" | "passport" | "other";

/** Etiquetas de comportamiento social (Paso 8, §7). */
export type BehaviorTag =
  | "friendly"
  | "needs_space"
  | "muzzle"
  | "reactive_dogs"
  | "reactive_people"
  | "wants_to_talk";

export type RegistrationFormState = {
  eventId: string;
  currentStep: number;
  attendsWithPet: boolean | null;
  participant: {
    fullName: string;
    phone: string; // formato E.164
    email?: string;
    documentType: DocumentType | "";
    documentNumber: string;
  };
  pet?: {
    name: string;
    breed?: string;
    size: PetSize;
    behaviorTags: BehaviorTag[];
    behaviorNotes?: string;
    healthStatus: HealthStatus;
    healthNotes?: string;
  };
  consents: {
    safety: boolean;
    privacy: boolean;
    marketing: boolean;
    imageUse: boolean;
  };
};

export type AttentionLevel = "normal" | "medium" | "high";
