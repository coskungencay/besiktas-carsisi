"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { labelMuted } from "@/themes/vela/parts";

/**
 * Vela'nin formu: kutu yok, alanlar tek alt cizgiden ibaret; odaklaninca cizgi
 * altina donuyor. Dogrulama/gonderim mantigi _shared/useContactForm icinde,
 * burada yalnizca bu tasarima ait isaretleme var.
 */

const field =
  "w-full border-0 border-b border-[var(--brand-border)] bg-transparent py-3 text-[0.9375rem] outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

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
      className="flex flex-col gap-8"
    >
      <input type="hidden" name="locale" value={locale} />

      <div>
        <label htmlFor="contact-name" className={labelMuted}>
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
          className={`${field} mt-3`}
          {...form.register("name")}
        />
        {form.errors.name ? (
          <p id="contact-name-error" className={errorText}>
            {form.errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelMuted}>
          {messages.form.phone}
        </label>
        <input
          id="contact-phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          placeholder={messages.form.phonePlaceholder}
          className={`${field} mt-3`}
          {...form.register("phone")}
        />
        {form.errors.phone ? (
          <p className={errorText}>{form.errors.phone.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelMuted}>
          {messages.form.email}
        </label>
        <input
          id="contact-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder={messages.form.emailPlaceholder}
          aria-invalid={Boolean(form.errors.email)}
          className={`${field} mt-3`}
          {...form.register("email")}
        />
        {form.errors.email ? (
          <p className={errorText}>{form.errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelMuted}>
          {messages.form.message} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          placeholder={messages.form.messagePlaceholder}
          aria-invalid={Boolean(form.errors.message)}
          aria-describedby={
            form.errors.message ? "contact-message-error" : undefined
          }
          className={`${field} mt-3 resize-y`}
          {...form.register("message")}
        />
        {form.errors.message ? (
          <p id="contact-message-error" className={errorText}>
            {form.errors.message.message}
          </p>
        ) : null}
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

      <div>
        {/* Buton olculeri tasarimdan: 15px/32px dolgu, 11.5px yazi, .24em. */}
        <button
          type="submit"
          disabled={form.pending}
          className="inline-flex items-center gap-3 border border-[var(--brand-primary)] px-8 py-[0.9375rem] text-[0.71875rem] uppercase tracking-[var(--brand-meta-tracking)] text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)] disabled:opacity-60"
        >
          <span>
            {form.pending ? messages.form.submitting : messages.form.submit}
          </span>
          <ArrowIcon className="size-3.5" />
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`mt-6 text-sm ${
            form.state.status === "error"
              ? "text-[var(--brand-primary)]"
              : "text-[var(--brand-ink)]"
          }`}
        >
          {form.state.message}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
          {messages.form.consent}
        </p>
      </div>
    </form>
  );
}
