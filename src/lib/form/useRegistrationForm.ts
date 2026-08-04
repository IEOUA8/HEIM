"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RegistrationFormState } from "@/types/registration";
import { eventConfig } from "@/config/event";

const STORAGE_KEY = `heim:registration:${eventConfig.slug}`;
// Vida del borrador antes de descartarse automáticamente (§10).
const DRAFT_TTL_MS = 1000 * 60 * 60 * 24; // 24 h

export function createInitialState(): RegistrationFormState {
  return {
    eventId: eventConfig.slug,
    currentStep: 0,
    attendsWithPet: null,
    participant: {
      fullName: "",
      phone: "",
      email: "",
      documentType: "",
      documentNumber: "",
    },
    pet: {
      name: "",
      breed: "",
      size: "unknown",
      behaviorTags: [],
      behaviorNotes: "",
      healthStatus: "healthy",
      healthNotes: "",
    },
    consents: { safety: false, privacy: false, marketing: false, imageUse: false },
  };
}

type Persisted = { savedAt: number; state: RegistrationFormState };

/**
 * Estado del formulario con guardado temporal en localStorage.
 * Permite retomar desde el último paso y descarta el borrador vencido (§10).
 */
export function useRegistrationForm() {
  const [state, setState] = useState<RegistrationFormState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const skipPersist = useRef(true);

  // Hidratar borrador al montar. Lectura única de almacenamiento externo:
  // localStorage no existe en el servidor, por lo que debe hacerse en un efecto.
  useEffect(() => {
    let draft: RegistrationFormState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Persisted = JSON.parse(raw);
        if (Date.now() - parsed.savedAt < DRAFT_TTL_MS) {
          draft = parsed.state;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Borrador corrupto: se ignora.
    }
    /* eslint-disable react-hooks/set-state-in-effect -- hidratación única desde localStorage */
    if (draft) {
      setState(draft);
      setHasDraft(draft.currentStep > 0);
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persistir en cada cambio (salvo la primera hidratación).
  useEffect(() => {
    if (!hydrated) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      const payload: Persisted = { savedAt: Date.now(), state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Almacenamiento no disponible.
    }
  }, [state, hydrated]);

  const update = useCallback(
    (patch: Partial<RegistrationFormState>) =>
      setState((prev) => ({ ...prev, ...patch })),
    [],
  );

  const updateParticipant = useCallback(
    (patch: Partial<RegistrationFormState["participant"]>) =>
      setState((prev) => ({
        ...prev,
        participant: { ...prev.participant, ...patch },
      })),
    [],
  );

  const updatePet = useCallback(
    (patch: Partial<NonNullable<RegistrationFormState["pet"]>>) =>
      setState((prev) => ({
        ...prev,
        pet: { ...prev.pet!, ...patch },
      })),
    [],
  );

  const updateConsents = useCallback(
    (patch: Partial<RegistrationFormState["consents"]>) =>
      setState((prev) => ({ ...prev, consents: { ...prev.consents, ...patch } })),
    [],
  );

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(createInitialState());
    setHasDraft(false);
  }, []);

  return {
    state,
    hydrated,
    hasDraft,
    setStep: (currentStep: number) => update({ currentStep }),
    update,
    updateParticipant,
    updatePet,
    updateConsents,
    reset,
  };
}
