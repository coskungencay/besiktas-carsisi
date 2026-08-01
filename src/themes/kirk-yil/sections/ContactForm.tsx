"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { meta } from "@/themes/kirk-yil/parts";

/**
 * Kırk Yıl'in formu: alanlar tek kolonda alt alta, hepsi cerceveli kutular,
 * gonder butonu tam genislikte ve ortalanmis — eski bir kayit fisi gibi.
 *
 * Dogrulama/gonderim mantigi _shared/useContactForm icinde; burada yalnizca
 * bu tasarima ait isaretleme var.
 */

const field =
  "brand-frame mt-2 w-full bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const errorText = "mt-2 text-xs text-[var(--brand-primary)]";

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

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="contact-name" className={meta}>
            {messages.form.name} <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            placeholder={messages.form.namePlaceholder}
            aria-invalid={Boolean(form.errors.name)}
            aria-describedby={form.errors.name ? "contact-name-error" : undefined}
            className={field}
            {...form.register("name")}
          />
          {form.errors.name ? (
            <p id="contact-name-error" className={errorText}>
              {form.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={meta}>
              {messages.form.phone}
            </label>
            <input
              id="contact-phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder={messages.form.phonePlaceholder}
              className={field}
              {...form.register("phone")}
            />
            {form.errors.phone ? (
              <p className={errorText}>{form.errors.phone.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contact-email" className={meta}>
              {messages.form.email}
            </label>
            <input
              id="contact-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder={messages.form.emailPlaceholder}
              aria-invalid={Boolean(form.errors.email)}
              className={field}
              {...form.register("email")}
            />
            {form.errors.email ? (
              <p className={errorText}>{form.errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={meta}>
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
            className={`${field} resize-y`}
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

      <button
        type="submit"
        disabled={form.pending}
        className="brand-eyebrow brand-rounded mt-8 w-full bg-[var(--brand-primary)] px-6 py-4 text-xs text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {form.pending ? messages.form.submitting : messages.form.submit}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-center text-sm ${
          form.state.status === "error"
            ? "text-[var(--brand-primary)]"
            : "text-[var(--brand-ink)]"
        }`}
      >
        {form.state.message}
      </p>

      <p className="mt-2 text-center text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
