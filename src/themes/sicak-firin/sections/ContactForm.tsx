"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { fieldLabel, pillSolid } from "@/themes/sicak-firin/parts";

/**
 * Sicak Firin'in formu: yuvarlak, acik renk alanlar.
 *
 * Form artik krem PANELIN uzerinde duruyor, bu yuzden alanlarin zemini ana
 * yuzey rengi: ikincil zemin kullanilsa alanlar panelin icinde kaybolurdu.
 * Dogrulama/gonderim mantigi _shared/useContactForm icinde.
 */

const field =
  "w-full rounded-[var(--brand-radius-sm)] border border-[var(--brand-hairline-soft)] bg-[var(--brand-surface)] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const errorText = "mt-2 text-sm text-[var(--brand-accent)]";

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
        <div>
          <label htmlFor="contact-name" className={fieldLabel}>
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
          <label htmlFor="contact-phone" className={fieldLabel}>
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

        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className={fieldLabel}>
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
          <label htmlFor="contact-message" className={fieldLabel}>
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

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={form.pending}
          className={`${pillSolid} disabled:opacity-60`}
        >
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
              : "text-[var(--brand-ink)]"
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
