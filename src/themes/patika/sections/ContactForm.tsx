"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";

/**
 * Patika'nin formu: alt cizgi degil, her alan kendi kalin cerceveli kutusunda.
 * Dogrulama/gonderim mantigi _shared/useContactForm icinde; burada yalnizca
 * bu tasarima ait isaretleme var.
 */

const field =
  "brand-frame w-full bg-[var(--brand-surface)] px-4 py-3 text-base outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const label = "brand-eyebrow block text-xs text-[var(--brand-ink-muted)]";

const errorText = "mt-2 text-sm text-[var(--brand-accent)]";

/*
 * Gonder butonu parts.tsx'teki pillSolid'i GENISLETMIYOR, kendi olcusunu yaziyor.
 * NEDEN: ayni sinif dizisinde px-4/px-6 gibi cakisan iki utility bulunursa hangisinin
 * kazanacagini Tailwind'in ic siralamasi belirler; buton olcusu o siralamaya
 * emanet edilmemeli.
 */
const submitButton =
  "inline-flex items-center gap-2 rounded-[var(--brand-radius-pill)] brand-eyebrow bg-[var(--brand-primary)] px-[1.625rem] py-[0.875rem] text-[0.8125rem] font-bold text-[var(--brand-primary-contrast)] transition-colors hover:bg-[var(--brand-accent)] disabled:opacity-60";

export function ContactForm({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const form = useContactForm(locale, messages);

  return (
    <form
      ref={form.formRef}
      action={form.formAction}
      onSubmit={form.onSubmit}
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="contact-name" className={label}>
            {messages.form.name} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            placeholder={messages.form.namePlaceholder}
            aria-invalid={Boolean(form.errors.name)}
            aria-describedby={
              form.errors.name ? "contact-name-error" : undefined
            }
            className={`${field} mt-2`}
            {...form.register("name")}
          />
          {form.errors.name ? (
            <p id="contact-name-error" className={errorText}>
              {form.errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className={label}>
            {messages.form.phone}
          </label>
          <input
            id="contact-phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={messages.form.phonePlaceholder}
            className={`${field} mt-2`}
            {...form.register("phone")}
          />
          {form.errors.phone ? (
            <p className={errorText}>{form.errors.phone.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={label}>
            {messages.form.email}
          </label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={messages.form.emailPlaceholder}
            aria-invalid={Boolean(form.errors.email)}
            className={`${field} mt-2`}
            {...form.register("email")}
          />
          {form.errors.email ? (
            <p className={errorText}>{form.errors.email.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={label}>
            {messages.form.message} <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            required
            placeholder={messages.form.messagePlaceholder}
            aria-invalid={Boolean(form.errors.message)}
            aria-describedby={
              form.errors.message ? "contact-message-error" : undefined
            }
            className={`${field} mt-2 resize-y`}
            {...form.register("message")}
          />
          {form.errors.message ? (
            <p id="contact-message-error" className={errorText}>
              {form.errors.message.message}
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
          {...form.register("website")}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={form.pending} className={submitButton}>
          <span>
            {form.pending ? messages.form.submitting : messages.form.submit}
          </span>
          <ArrowIcon />
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            form.state.status === "error"
              ? "text-[var(--brand-accent)]"
              : "text-[var(--brand-primary)]"
          }`}
        >
          {form.state.message}
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
