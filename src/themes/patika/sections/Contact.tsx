import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { shell, surface } from "@/themes/patika/parts";
import { ContactForm } from "@/themes/patika/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Sayfayi kapatan NEON BLOK: tasarimda iletisim, koyu zeminden cikip lime bir
 * kutuya tasiniyor (28px kose, 52/46px ic bosluk, 1.25fr + bilgi kolonlari).
 *
 * Blok icinde renk devrildigi icin ikincil metinler `opacity` ile soluklastirilir;
 * koyu tema icin tanimli --brand-ink-muted burada okunmazdi.
 *
 * Form bloku ayri ve koyu: lime kutunun icinde form alanlari afisi bozardi.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;

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
  /*
   * Koordinat bilerek bu listede YOK: sozlukte "koordinat" basligi olmadigi
   * icin etiketsiz bir kart olurdu. Footer'da kunye satiri olarak duruyor.
   */

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      {/* Sayfanin son bolumu: tasarimda tek yer altinda da bosluk tasiyan. */}
      <div className={`${shell} pk-section pk-section-end`}>
        <Reveal>
          <div className="grid gap-10 rounded-[var(--brand-radius-block)] bg-[var(--brand-primary)] p-8 text-[var(--brand-primary-contrast)] sm:p-13 lg:grid-cols-[1.25fr_1.6fr] lg:gap-11">
            <div>
              <p className="pk-eyebrow opacity-60">{t.contact.eyebrow}</p>
              <h2 id="contact-title" className="pk-h3 mt-3 text-balance">
                {t.contact.title}
              </h2>
              <p className="pk-lead mt-6 max-w-[24rem] font-medium text-pretty">
                {fill(t.contact.intro, { name })}
              </p>
            </div>

            {rows.length > 0 ? (
              <dl className="grid gap-x-11 gap-y-7 sm:grid-cols-2">
                {rows.map((row, index) => (
                  <div key={`${row.term}-${index}`}>
                    <dt className="pk-eyebrow opacity-60">{row.term}</dt>
                    <dd
                      className="mt-3 text-sm leading-[1.6] font-medium text-pretty"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="border-b-[length:var(--brand-border-width)] border-current/30 pb-0.5 transition-opacity hover:opacity-70"
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
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="brand-frame mt-4 bg-[var(--brand-surface-alt)] p-6 sm:p-10">
            <h3 className="pk-title">{t.contact.formTitle}</h3>
            <div className="mt-8">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
