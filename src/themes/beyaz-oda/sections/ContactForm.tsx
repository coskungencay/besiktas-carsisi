"use client";

import type { Messages } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ArrowIcon } from "@/themes/_shared/icons";
import { useContactForm } from "@/themes/_shared/useContactForm";
import { meta } from "@/themes/beyaz-oda/parts";

/**
 * Beyaz Oda'nin formu: kutu yok, sadece alt cizgili alanlar.
 * Dogrulama/gonderim mantigi _shared/useContactForm icinde; burada yalnizca
 * bu tasarima ait isaretleme var.
 */

/*
 * Alan bicimi.
 *
 * PUNTO TELEFONDA 16px OLMAK ZORUNDA. iOS Safari, punto 16px'in ALTINDA olan
 * bir alana odaklanildiginda sayfayi kendiliginden yakinlastirir; kullanici
 * "Ad Soyad"a dokununca sayfa buyuyor, yazip bitirince geri donmuyor ve
 * formun geri kalanini yatay kaydirarak dolduruyordu. Tasarimin 14px'i
 * sm'den itibaren geri geliyor — orada boyle bir davranis yok.
 *
 * Dikey dolgu da telefonda bir tik acildi: 45px'lik bir alan parmakla
 * isabetli ama dar; 52px rahat.
 */
const field =
  "w-full border-0 border-b border-[var(--brand-border)] bg-transparent py-3.5 text-base outline-none transition-colors placeholder:text-[var(--brand-ink-muted)] focus:border-[var(--brand-ink)] sm:py-3 sm:text-sm";

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
          <label htmlFor="contact-name" className={`${meta} brand-eyebrow`}>
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
            <p id="contact-name-error" className="mt-2 text-sm text-[var(--brand-accent)]">
              {form.errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className={`${meta} brand-eyebrow`}>
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
            <p className="mt-2 text-sm text-[var(--brand-accent)]">
              {form.errors.phone.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={`${meta} brand-eyebrow`}>
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
            <p className="mt-2 text-sm text-[var(--brand-accent)]">
              {form.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={`${meta} brand-eyebrow`}>
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
            className={`${field} resize-y`}
            {...form.register("message")}
          />
          {form.errors.message ? (
            <p
              id="contact-message-error"
              className="mt-2 text-sm text-[var(--brand-accent)]"
            >
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

      {/*
        Buton ORTADA. Form alanlari sola hizali (okuma yonu boyle), ama
        gonderme eylemi formun kapanisi — bolumun geri kalani ortalanmisken
        tek basina sola yaslanmasi seridi bozuyordu.
      */}
      <div className="mt-10 text-center">
        <button
          type="submit"
          disabled={form.pending}
          className="brand-rounded inline-flex items-center gap-2.5 bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-[var(--brand-primary-contrast)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <span>
            {form.pending ? messages.form.submitting : messages.form.submit}
          </span>
          <ArrowIcon />
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-center text-sm ${
          form.state.status === "error"
            ? "text-[var(--brand-accent)]"
            : "text-[var(--brand-ink)]"
        }`}
      >
        {form.state.message}
      </p>

      <p className="mx-auto mt-3 max-w-[44ch] text-center text-xs leading-relaxed text-[var(--brand-ink-muted)]">
        {messages.form.consent}
      </p>
    </form>
  );
}
