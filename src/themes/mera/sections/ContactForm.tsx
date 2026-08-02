"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { label, labelBase } from "@/themes/mera/parts";

/**
 * Mera'nin formu: kutucuklar tam cerceveli ve keskin koseli (radius token'i
 * zaten 0). Dogrulama/gonderim mantigi _shared/useContactForm icinde;
 * burada yalnizca bu tasarima ait isaretleme var.
 *
 * Hata rengi olarak accent DEGIL primary kullaniliyor: bu temada accent
 * murekkeple ayni renkte, hata gorunmez olurdu.
 */

const field =
  "brand-frame brand-body mt-2.5 w-full bg-[var(--brand-surface)] px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const errorText = "mt-2 text-sm text-[var(--brand-primary)]";

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

      <div className="grid gap-6 sm:grid-cols-2">
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
            className={field}
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
            className={field}
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

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--brand-border)] pt-6">
        <button
          type="submit"
          disabled={form.pending}
          className={`${labelBase} inline-flex items-center gap-3 bg-[var(--brand-primary)] px-7 py-3.5 text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85 disabled:opacity-60`}
        >
          <span>
            {form.pending ? messages.form.submitting : messages.form.submit}
          </span>
          <ArrowIcon className="size-3.5" />
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            form.state.status === "error"
              ? "text-[var(--brand-primary)]"
              : "text-[var(--brand-ink)]"
          }`}
        >
          {form.state.message}
        </p>
      </div>

      <p className="mt-4 max-w-md text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
