"use client";

import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactAction } from "@/actions/contact";
import { IDLE } from "@/lib/action-result";
import { contactMessageSchema } from "@/lib/validators";

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3.5 py-2.5 text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-primary)]";

const labelClass = "block text-sm font-medium text-[var(--brand-ink)]";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, IDLE);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(contactMessageSchema),
    mode: "onBlur",
    defaultValues: { name: "", phone: "", email: "", message: "", website: "" },
  });

  useEffect(() => {
    if (state.status === "success") {
      reset();
      formRef.current?.reset();
    }
  }, [state.status, reset]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        void trigger();
      }}
      noValidate
      className="space-y-4"
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Ad Soyad <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClass}
          {...register("name")}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            {...register("phone")}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            E-posta
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldClass}
            {...register("email")}
          />
        </div>
      </div>
      {errors.phone ? (
        <p className="text-sm text-red-700">{errors.phone.message}</p>
      ) : null}
      {errors.email ? (
        <p className="text-sm text-red-700">{errors.email.message}</p>
      ) : null}

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Mesajınız <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass} resize-y`}
          {...register("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1 text-sm text-red-700">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: gercek kullanicilar gormez, botlar doldurur. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Web siteniz</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[var(--radius-sm)] bg-[var(--brand-primary)] px-6 py-3 font-semibold text-[var(--brand-primary-contrast)] transition-opacity disabled:opacity-60"
      >
        {pending ? "Gönderiliyor…" : "Mesaj Gönder"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={
          state.status === "error"
            ? "text-sm font-medium text-red-700"
            : "text-sm font-medium text-[var(--brand-primary)]"
        }
      >
        {state.message}
      </p>
    </form>
  );
}
