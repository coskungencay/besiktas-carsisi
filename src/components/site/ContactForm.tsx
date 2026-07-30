"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactAction } from "@/actions/contact";
import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { IDLE } from "@/lib/action-result";
import { ArrowIcon } from "@/themes/shared/parts";
import { makeContactMessageSchema } from "@/lib/validators";

/**
 * Tum temalarin kullandigi TEK iletisim formu.
 * Gorunumu tamamen tema token'larindan (--brand-*) gelir, bu yuzden 9 temada
 * da yerinde durur; honeypot, rate limit ve zod dogrulamasi burada tek yerde.
 */

const fieldClass =
  "brand-frame w-full bg-[var(--brand-surface)] px-4 py-3 text-sm text-[var(--brand-ink)] outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const labelClass = "text-sm font-medium";

export function ContactForm({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
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

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        void trigger();
      }}
      noValidate
      className="mt-6"
    >
      <input type="hidden" name="locale" value={locale} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="contact-name" className={labelClass}>
            {messages.form.name} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            placeholder={messages.form.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-sm text-[var(--brand-accent)]">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-phone" className={labelClass}>
            {messages.form.phone}
          </label>
          <input
            id="contact-phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={messages.form.phonePlaceholder}
            className={fieldClass}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-sm text-[var(--brand-accent)]">
              {errors.phone.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className={labelClass}>
            {messages.form.email}
          </label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={messages.form.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className={fieldClass}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-[var(--brand-accent)]">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            {messages.form.message} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            required
            placeholder={messages.form.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={`${fieldClass} resize-y`}
            {...register("message")}
          />
          {errors.message ? (
            <p
              id="contact-message-error"
              className="text-sm text-[var(--brand-accent)]"
            >
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot: gercek kullanicilar gormez, botlar doldurur. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">{messages.form.honeypot}</label>
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
        className="brand-rounded mt-6 inline-flex items-center gap-2 bg-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        <span>{pending ? messages.form.submitting : messages.form.submit}</span>
        <ArrowIcon />
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-sm font-medium ${
          state.status === "error"
            ? "text-[var(--brand-accent)]"
            : "text-[var(--brand-primary)]"
        }`}
      >
        {state.message}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
