"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import type { ActionState } from "@/lib/action-result";

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 disabled:bg-zinc-100";

export const labelClass = "block text-sm font-medium text-zinc-800";

export const cardClass =
  "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6";

export function SubmitButton({
  children = "Kaydet",
  variant = "primary",
  confirm,
  disabled = false,
}: {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  confirm?: string;
  /**
   * Cagiran taraf gonderimi engellemek istediginde. Buton zaten `pending`
   * sirasinda kendiliginden kapanir; bu, ona EK bir kosul (orn. secilen
   * dosyalarin toplam boyutu tavani asiyor) eklemek icin.
   */
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  const styles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary:
      "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
    danger: "border border-red-300 bg-white text-red-700 hover:bg-red-50",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${styles}`}
    >
      {pending ? "İşleniyor…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={`rounded-lg px-3 py-2 text-sm font-medium ${
        state.status === "error"
          ? "bg-red-50 text-red-800"
          : "bg-emerald-50 text-emerald-800"
      }`}
    >
      {state.message}
    </p>
  );
}

export function FieldError({
  state,
  name,
}: {
  state: ActionState;
  name: string;
}) {
  const message = state.fieldErrors?.[name];
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-700">{message}</p>;
}
