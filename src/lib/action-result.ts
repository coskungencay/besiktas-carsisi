import type { z } from "zod";

/**
 * Tum server action'larin ortak donus tipi.
 * useActionState ile birebir uyumlu; fancy bir state kutuphanesi yok.
 */
export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Alan adi -> ilk hata mesaji. */
  fieldErrors?: Record<string, string>;
};

export const IDLE: ActionState = { status: "idle", message: "" };

export function ok(message = "Kaydedildi."): ActionState {
  return { status: "success", message };
}

export function fail(
  message = "Bir hata oluştu.",
  fieldErrors?: Record<string, string>,
): ActionState {
  return { status: "error", message, fieldErrors };
}

export function fromZodError(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  const first = Object.values(fieldErrors)[0];
  return fail(first ?? "Girdiğiniz bilgileri kontrol edin.", fieldErrors);
}

/** FormData'yi duz objeye cevirir (File'lar atlanir). */
export function formToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}
