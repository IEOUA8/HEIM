"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRegistrationForm } from "@/lib/form/useRegistrationForm";
import { activeSteps, type StepApi } from "./steps";
import { Logo } from "@/components/brand/Logo";
import { ProgressIndicator } from "./ProgressIndicator";
import { NavigationControls } from "./NavigationControls";
import { StepHeader } from "./StepHeader";

const DOC_LABELS: Record<string, string> = {
  cc: "Cédula de ciudadanía",
  ce: "Cédula de extranjería",
  passport: "Pasaporte",
  other: "Otro",
};

/**
 * Formulario inteligente tipo modal (§6). Una microdecisión por pantalla,
 * progreso visible, transiciones suaves y persistencia local.
 * Los pasos vienen de `steps.tsx`; el resumen y la confirmación se manejan
 * como pantallas terminales dentro del modal.
 */
export function FormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const form = useRegistrationForm();
  const { state, hydrated } = form;
  const [showErrors, setShowErrors] = useState(false);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<"steps" | "review" | "success" | "submitting">("steps");
  const [code, setCode] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepList = useMemo(() => activeSteps(state), [state]);
  const stepIndex = Math.min(state.currentStep, stepList.length - 1);
  const step = stepList[stepIndex];
  const totalStepsForProgress = stepList.length + 1; // +1 = resumen

  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const api: StepApi = {
    state,
    update: form.update,
    updateParticipant: form.updateParticipant,
    updatePet: form.updatePet,
    updateConsents: form.updateConsents,
    showErrors,
  };

  const goNext = () => {
    if (phase === "review") return submit();
    if (!step.isValid(state)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setDirection(1);
    if (stepIndex >= stepList.length - 1) {
      setPhase("review");
    } else {
      form.setStep(stepIndex + 1);
    }
  };

  const goBack = () => {
    setShowErrors(false);
    setDirection(-1);
    if (phase === "review") {
      setPhase("steps");
      return;
    }
    if (stepIndex > 0) form.setStep(stepIndex - 1);
  };

  const submit = async () => {
    setPhase("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendsWithPet: state.attendsWithPet,
          participant: state.participant,
          pet: state.attendsWithPet ? state.pet : undefined,
          consents: state.consents,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as { code: string };
      setCode(json.code);
      setPhase("success");
      form.reset();
    } catch {
      // Mantener los datos en el navegador y permitir reintento (§10).
      setSubmitError(
        "No pudimos guardar tu inscripción. Tus datos siguen aquí; intenta nuevamente.",
      );
      setPhase("review");
    }
  };

  const progressCurrent =
    phase === "review" || phase === "submitting" ? totalStepsForProgress : stepIndex + 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-forest/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Inscripción a la caminata HEIM"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="my-auto flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-brand-ivory shadow-[0_24px_60px_-24px_rgba(35,63,53,0.25)]"
      >
        {/* Cabecera persistente (§6.2) */}
        <div className="flex items-center justify-between gap-3 px-6 pt-5">
          <Logo size={60} />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-forest/60 hover:bg-brand-forest/5 hover:text-brand-forest"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M6.3 5A1 1 0 0 0 5 6.3L8.6 10 5 13.7A1 1 0 1 0 6.3 15L10 11.4l3.7 3.6A1 1 0 0 0 15 13.7L11.4 10 15 6.3A1 1 0 0 0 13.7 5L10 8.6 6.3 5Z" />
            </svg>
          </button>
        </div>

        {phase !== "success" && (
          <div className="px-6 pt-3">
            <ProgressIndicator current={progressCurrent} total={totalStepsForProgress} />
            <p className="mt-2 text-xs font-medium text-brand-forest/50">
              {phase === "review" ? "Resumen" : step?.section} · Paso {progressCurrent} de{" "}
              {totalStepsForProgress}
            </p>
          </div>
        )}

        {/* Contenido con transición entre pasos (§5.5) */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={phase === "steps" ? step?.id : phase}
              custom={direction}
              initial={{ x: direction * 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -24, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {!hydrated ? (
                <p className="text-sm text-brand-forest/50">Cargando…</p>
              ) : phase === "success" ? (
                <SuccessScreen code={code!} state={state} />
              ) : phase === "review" || phase === "submitting" ? (
                <ReviewScreen state={state} error={submitError} />
              ) : (
                step?.render(api)
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navegación (§6.1) */}
        {phase !== "success" && (
          <div className="border-t border-brand-forest/10 bg-brand-ivory px-6 py-4">
            <NavigationControls
              onNext={goNext}
              onBack={goBack}
              canGoBack={stepIndex > 0 || phase === "review"}
              canGoNext={phase === "review" ? true : !!step?.isValid(state)}
              isSubmitting={phase === "submitting"}
              nextLabel={
                phase === "review" ? "Confirmar inscripción" : step?.nextLabel ?? "Siguiente"
              }
            />
          </div>
        )}

        {phase === "success" && (
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full rounded-full bg-brand-forest px-6 py-3 font-semibold text-brand-ivory"
            >
              Listo
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-brand-forest/60">{label}</span>
      <span className="text-right font-medium text-brand-forest">{value}</span>
    </div>
  );
}

function ReviewScreen({
  state,
  error,
}: {
  state: ReturnType<typeof useRegistrationForm>["state"];
  error?: string | null;
}) {
  const doc = state.participant.documentNumber
    ? `${DOC_LABELS[state.participant.documentType] ?? ""} ••••${state.participant.documentNumber.slice(-4)}`
    : undefined;
  return (
    <div className="space-y-3">
      <StepHeader title="Revisa tu inscripción" help="Confirma que todo esté correcto antes de enviar." />
      {error && (
        <p className="rounded-xl bg-brand-orange/10 px-4 py-3 text-sm text-brand-orange" role="alert">
          {error}
        </p>
      )}
      <div className="divide-y divide-brand-forest/10 rounded-2xl bg-white px-4">
        <Row label="Nombre" value={state.participant.fullName} />
        <Row label="Teléfono" value={state.participant.phone} />
        <Row label="Correo" value={state.participant.email} />
        <Row label="Documento" value={doc} />
        <Row
          label="Participación"
          value={state.attendsWithPet ? "Con mi perro" : "Sin mascota"}
        />
        {state.attendsWithPet && (
          <>
            <Row label="Perro" value={state.pet?.name} />
            <Row label="Raza" value={state.pet?.breed} />
          </>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({
  code,
  state,
}: {
  code: string;
  state: ReturnType<typeof useRegistrationForm>["state"];
}) {
  return (
    <div className="space-y-4 py-2 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-lime">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-brand-forest" aria-hidden>
          <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-brand-forest">¡Tu inscripción está confirmada!</h2>
        <p className="mt-1 text-sm text-brand-forest/70">
          Gracias por caminar por quienes aún esperan un hogar
          {state.pet?.name ? `, junto a ${state.pet.name}` : ""}.
        </p>
      </div>
      <div className="rounded-2xl border-2 border-dashed border-brand-forest/20 bg-white py-4">
        <p className="text-xs uppercase tracking-wide text-brand-forest/50">
          Código de inscripción
        </p>
        <p className="mt-1 text-xl font-bold tracking-wide text-brand-orange">{code}</p>
      </div>
    </div>
  );
}
