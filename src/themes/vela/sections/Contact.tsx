import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { coordinateLabel } from "@/themes/_shared/data";
import {
  Hairline,
  label,
  metaMuted,
  proseSm,
  shell,
  surface,
} from "@/themes/vela/parts";
import { ContactForm } from "@/themes/vela/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Tasarimin kapanis bolumu: en ustte altin bir cizgi, altinda 56px'lik dolgu
 * ve 1.15 / .8 / 1 oranli uc kolon. Solda buyuk serif cagri, ortada iletisim
 * satirlari (terim solda, deger sagda, aralarinda ince ayrac), sagda form.
 *
 * Kolonlar arasinda cizgi yok — sadece 60px bosluk ayiriyor.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;
  const coords = coordinateLabel(contact.lat, contact.lng);

  const rows: Row[] = [
    contact.address && {
      term: t.contact.address,
      value: contact.address,
      href: contact.mapsUrl,
      ltr: false,
    },
    contact.phone && {
      term: t.contact.phone,
      value: contact.phone,
      href: contact.phoneHref,
      ltr: true,
    },
    contact.whatsapp && {
      term: t.contact.whatsapp,
      value: contact.whatsapp,
      href: contact.whatsappHref,
      ltr: true,
    },
    contact.email && {
      term: t.contact.email,
      value: contact.email,
      href: `mailto:${contact.email}`,
      ltr: true,
    },
    contact.instagram && {
      term: t.contact.instagram,
      value: `@${contact.instagram}`,
      href: contact.instagramHref,
      ltr: true,
    },
  ].filter((row): row is Row => Boolean(row));

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Hairline tone="gold" />

        <div className="grid gap-14 pt-14 lg:grid-cols-[1.15fr_0.8fr_1fr] lg:gap-[3.75rem]">
          <Reveal>
            {/* Tasarimda 56px / 1.06 — sayfanin en buyuk ikinci tipografisi. */}
            <h2
              id="contact-title"
              className="brand-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.01em] text-balance"
            >
              {t.contact.title}
            </h2>
            <p className={`mt-[1.625rem] max-w-md ${proseSm}`}>
              {fill(t.contact.intro, { name })}
            </p>

            {/* Koordinat ayri bir DB alani degil; enlem/boylamdan turetiliyor. */}
            {coords ? (
              <p className={`${metaMuted} mt-8`} dir="ltr">
                {coords}
              </p>
            ) : null}
          </Reveal>

          {rows.length > 0 ? (
            <Reveal delay={0.08}>
              <h3 className={label}>{t.contact.eyebrow}</h3>
              <dl className="mt-[1.125rem]">
                {rows.map((row, index) => (
                  <div
                    key={`${row.term}-${index}`}
                    className={`flex items-baseline justify-between gap-6 py-[0.6875rem] ${
                      index === rows.length - 1
                        ? ""
                        : "border-b border-[var(--brand-rule-soft)]"
                    }`}
                  >
                    <dt className={`${metaMuted} shrink-0`}>{row.term}</dt>
                    <dd
                      className="text-[0.90625rem] leading-[1.6] text-pretty text-end"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="underline-offset-8 transition-colors hover:text-[var(--brand-primary)] hover:underline"
                          {...(row.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          <Reveal delay={0.14}>
            <h3 className={label}>{t.contact.formTitle}</h3>
            <div className="mt-[1.125rem]">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
