"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRegistrationForm } from "@/lib/form/useRegistrationForm";
import { activeSteps, type StepApi } from "./steps";
import { Logo } from "@/components/brand/Logo";
import { ProgressIndicator } from "./ProgressIndicator";
import { NavigationControls } from "./NavigationControls";
import { StepHeader } from "./StepHeader";
import { eventConfig } from "@/config/event";

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
  const [isDuplicate, setIsDuplicate] = useState(false);

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

  const submit = async (force = false) => {
    setPhase("submitting");
    setSubmitError(null);
    if (force) setIsDuplicate(false);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allowDuplicate: force,
          attendsWithPet: state.attendsWithPet,
          participant: state.participant,
          pet: state.attendsWithPet ? state.pet : undefined,
          consents: state.consents,
        }),
      });
      if (res.status === 409) {
        // Posible inscripción duplicada (§8): no crear duplicado silencioso.
        const json = (await res.json()) as { error: string; duplicate?: boolean };
        setIsDuplicate(!!json.duplicate);
        setSubmitError(json.error);
        setPhase("review");
        return;
      }
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
                <ReviewScreen
                  state={state}
                  error={submitError}
                  isDuplicate={isDuplicate}
                  onForceSubmit={() => submit(true)}
                  onEdit={() => {
                    setDirection(-1);
                    setPhase("steps");
                    form.setStep(0);
                  }}
                />
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
  isDuplicate,
  onForceSubmit,
  onEdit,
}: {
  state: ReturnType<typeof useRegistrationForm>["state"];
  error?: string | null;
  isDuplicate?: boolean;
  onForceSubmit?: () => void;
  onEdit: () => void;
}) {
  const doc = state.participant.documentNumber
    ? `${DOC_LABELS[state.participant.documentType] ?? ""} ••••${state.participant.documentNumber.slice(-4)}`
    : undefined;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <StepHeader title="Revisa tu inscripción" help="Confirma que todo esté correcto antes de enviar." />
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm font-medium text-brand-lilac underline-offset-2 hover:underline"
        >
          Editar datos
        </button>
      </div>
      {error && (
        <div className="space-y-2 rounded-xl bg-brand-orange/10 px-4 py-3 text-sm text-brand-orange" role="alert">
          <p>{error}</p>
          {isDuplicate && onForceSubmit && (
            <button
              type="button"
              onClick={onForceSubmit}
              className="font-semibold underline underline-offset-2"
            >
              Continuar de todas formas
            </button>
          )}
        </div>
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

function calendarUrl(code: string): string {
  // Enlace a Google Calendar con los datos del evento (§7 Paso 13).
  const start = "20260906T130000Z"; // 2026-09-06 08:00 -05:00 en UTC
  const end = "20260906T160000Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${eventConfig.name} · HEIM`,
    dates: `${start}/${end}`,
    details: `Inscripción ${code}. ${eventConfig.purposeText}`,
    location: eventConfig.location.name,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function SuccessScreen({
  code,
  state,
}: {
  code: string;
  state: ReturnType<typeof useRegistrationForm>["state"];
}) {
  const downloadComprobante = () => {
    const lines = [
      "COMPROBANTE DE INSCRIPCIÓN — HEIM",
      "Caminata por los animales · 6 de septiembre de 2026",
      "",
      `Código: ${code}`,
      `Participante: ${state.participant.fullName}`,
      state.attendsWithPet ? `Mascota: ${state.pet?.name ?? "—"}` : "Asiste sin mascota",
      "",
      "Recomendaciones: correa siempre, bolsas para desechos,",
      "bozal cuando corresponda. ¡Gracias por participar!",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comprobante-${code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const shareData = {
      title: "Caminata por los animales · HEIM",
      text: "Me inscribí a la Caminata por los animales de HEIM. ¡Únete!",
      url: "https://heim-caminata.vercel.app",
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Enlace copiado para compartir.");
      }
    } catch {
      // El usuario canceló el diálogo de compartir.
    }
  };

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
        <p className="text-xs uppercase tracking-wide text-brand-forest/50">Código de inscripción</p>
        <p className="mt-1 text-xl font-bold tracking-wide text-brand-orange">{code}</p>
      </div>
      <div className="rounded-2xl bg-brand-sky/15 px-4 py-3 text-left text-sm text-brand-forest/80">
        <p className="font-semibold text-brand-forest">Caminata por los animales</p>
        <p>
          6 de septiembre de 2026
          {eventConfig.location.name && eventConfig.location.name !== "Por confirmar"
            ? ` · ${eventConfig.location.name}`
            : ""}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <a
          href={calendarUrl(code)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-brand-forest/15 px-4 py-2.5 text-sm font-semibold text-brand-forest hover:border-brand-forest/40"
        >
          Añadir al calendario
        </a>
        <button
          type="button"
          onClick={downloadComprobante}
          className="rounded-full border-2 border-brand-forest/15 px-4 py-2.5 text-sm font-semibold text-brand-forest hover:border-brand-forest/40"
        >
          Descargar comprobante
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-full border-2 border-brand-forest/15 px-4 py-2.5 text-sm font-semibold text-brand-forest hover:border-brand-forest/40"
        >
          Compartir
        </button>
      </div>
    </div>
  );
}
