import { z } from "zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

/**
 * Esquemas de validación por paso (Zod). Se usan tanto en cliente como en
 * servidor (§13: "Validar datos en cliente y servidor").
 * Mensajes de error alineados con §9.
 */

export const fullNameSchema = z
  .string()
  .trim()
  .min(3, "Escribe tu nombre completo para continuar.")
  .max(100)
  .refine((v) => !/^\d+$/.test(v), "Escribe tu nombre completo para continuar.")
  // Elimina espacios dobles (§7 Paso 2)
  .transform((v) => v.replace(/\s{2,}/g, " "));

/** Normaliza a formato internacional E.164 (§7 Paso 3). */
export const phoneSchema = z
  .string()
  .trim()
  .refine((v) => isValidPhoneNumber(v, "CO"), "Revisa el número e incluye todos los dígitos.")
  .transform((v) => parsePhoneNumberFromString(v, "CO")!.number);

export const emailSchema = z
  .string()
  .trim()
  .email("Escribe un correo válido, por ejemplo nombre@correo.com.");

export const documentSchema = z.object({
  documentType: z.enum(["cc", "ce", "passport", "other"], {
    message: "Selecciona un tipo de documento.",
  }),
  documentNumber: z
    .string()
    .trim()
    .min(4, "Verifica que el número de identificación esté completo.")
    .max(30),
});

export const petSchema = z.object({
  name: z.string().trim().min(1).max(60),
  breed: z.string().trim().max(80).optional(),
  size: z.enum(["small", "medium", "large", "giant", "unknown"]),
  behaviorTags: z.array(
    z.enum([
      "friendly",
      "needs_space",
      "muzzle",
      "reactive_dogs",
      "reactive_people",
      "wants_to_talk",
    ]),
  ),
  behaviorNotes: z.string().trim().max(300).optional(),
  healthStatus: z.enum(["healthy", "observation"]),
  healthNotes: z.string().trim().max(300).optional(),
});

export const consentsSchema = z.object({
  // Obligatorios (§11 / §22.5)
  safety: z.literal(true, {
    message: "Debes aceptar este compromiso para finalizar la inscripción.",
  }),
  privacy: z.literal(true, {
    message: "Debes aceptar este compromiso para finalizar la inscripción.",
  }),
  // Opcionales e independientes (§22.6)
  marketing: z.boolean(),
  imageUse: z.boolean(),
});
