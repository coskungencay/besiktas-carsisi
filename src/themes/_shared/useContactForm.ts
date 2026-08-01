"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactAction } from "@/actions/contact";
import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { IDLE } from "@/lib/action-result";
import { makeContactMessageSchema } from "@/lib/validators";

/**
 * Iletisim formunun MANTIGI — isaretlemesi yok.
 *
 * NEDEN: Form gorunumu (izgara, alan sirasi, buton yeri) her tasarimda farkli;
 * ama dogrulama, honeypot, rate limit ve basari sonrasi temizleme her temada
 * ayni olmali. Tema kendi <form>'unu yazar, bu hook'u baglar.
 *
 * Kullanim:
 *   const f = useContactForm(locale, t);
 *   <form ref={f.formRef} action={f.formAction} onSubmit={f.onSubmit} noValidate>
 *     <input {...f.register("name")} aria-invalid={Boolean(f.errors.name)} />
 *     ...
 *     <button disabled={f.pending}>…</button>
 *   </form>
 *
 * DIKKAT: gizli `locale` alanini ve honeypot (`website`) alanini basmayi
 * unutmayin — ikisi de sunucu tarafinda bekleniyor.
 */
export function useContactForm(locale: Locale, messages: Messages) {
  const [state, formAction, pending] = useActionState(submitContactAction, IDLE);
  const formRef = useRef<HTMLFormElement>(null);

  const schema = useMemo(() => makeContactMessageSchema(messages), [messages]);

  const {
    register,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
      locale,
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      reset();
      formRef.current?.reset();
    }
  }, [state.status, reset]);

  return {
    formRef,
    formAction,
    pending,
    /** Sunucudan donen durum: idle | success | error + mesaj. */
    state,
    register,
    errors,
    /** <form onSubmit>'e baglanir; istemci tarafi dogrulamayi tetikler. */
    onSubmit: () => {
      void trigger();
    },
  };
}
