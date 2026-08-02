"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { mono } from "@/themes/tesviye/parts";

/**
 * Tesviye'nin formu: numarali alan defteri.
 *
 * NEDEN TEK SUTUN: bu tasarimda her bolum numarali bir kunye ile basliyor;
 * form da ayni ritmi surdurmeli. Alanlar yan yana konsaydi sayfadaki tek
 * "serbest izgara" olurdu ve paftanin cetvel duzeni bozulurdu.
 *
 * Dogrulama/gonderim mantigi _shared/useContactForm icinde; burada yalnizca
 * bu tasarima ait isaretleme var.
 */

const field =
  "brand-frame w-full bg-[var(--brand-surface)] px-3 py-2.5 text-[length:var(--ts-body-sm)] font-light outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-primary)]";

const label = `${mono} flex flex-wrap items-baseline gap-x-2 text-[var(--brand-ink-muted)]`;

/** Alan sirasini gosteren kose numarasi — paftalardaki kunye numarasiyla ayni dil. */
const code = "tabular-nums";

/** Hata metni: bu palette accent = murekkep rengi, uyari icin vurgu kullanilir. */
const errorText = "mt-1.5 text-xs text-[var(--brand-primary)]";

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

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="contact-name" className={label}>
            <span aria-hidden="true" className={code}>
              01
            </span>
            <span>
              {messages.form.name} <span aria-hidden="true">*</span>
            </span>
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
            className={`${field} mt-1.5`}
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
            <span aria-hidden="true" className={code}>
              02
            </span>
            <span>{messages.form.phone}</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={messages.form.phonePlaceholder}
            aria-invalid={Boolean(form.errors.phone)}
            aria-describedby={
              form.errors.phone ? "contact-phone-error" : undefined
            }
            className={`${field} mt-1.5`}
            {...form.register("phone")}
          />
          {form.errors.phone ? (
            <p id="contact-phone-error" className={errorText}>
              {form.errors.phone.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={label}>
            <span aria-hidden="true" className={code}>
              03
            </span>
            <span>{messages.form.email}</span>
          </label>
          <input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={messages.form.emailPlaceholder}
            aria-invalid={Boolean(form.errors.email)}
            aria-describedby={
              form.errors.email ? "contact-email-error" : undefined
            }
            className={`${field} mt-1.5`}
            {...form.register("email")}
          />
          {form.errors.email ? (
            <p id="contact-email-error" className={errorText}>
              {form.errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-message" className={label}>
            <span aria-hidden="true" className={code}>
              04
            </span>
            <span>
              {messages.form.message} <span aria-hidden="true">*</span>
            </span>
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
            className={`${field} mt-1.5 resize-y`}
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
        className={`${mono} mt-6 inline-flex w-full items-center justify-center gap-2 bg-[var(--brand-primary)] px-5 py-4 text-[var(--brand-primary-contrast)] transition-colors hover:bg-[var(--brand-accent)] disabled:opacity-60`}
      >
        <span>
          {form.pending ? messages.form.submitting : messages.form.submit}
        </span>
        <ArrowIcon className="size-3.5" />
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-sm ${
          form.state.status === "error"
            ? "text-[var(--brand-primary)]"
            : "text-[var(--brand-ink)]"
        }`}
      >
        {form.state.message}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
