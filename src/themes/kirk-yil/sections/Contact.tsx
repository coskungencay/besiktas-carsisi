import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday } from "@/themes/_shared/data";
import {
  Ornament,
  SectionTitle,
  meta,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import { ContactForm } from "@/themes/kirk-yil/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Ortalanmis kartvizit duzeni: bilgiler ustte esit sutunlara dagilmis,
 * form altta dar ve cerceveli bir kolonda.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;

  // Koordinat bilerek burada YOK: footer'da zaten var, "Adres" etiketini iki
  // kez tekrarlamak kartvizit duzenini bozardi.
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
   * Calisma saatleri tasarimda TAM BURADA ("Acilis" sutunu), hikaye bolumunde
   * degil. Yedi satirlik tablo hikayenin ortasindayken o bolumu iki katina
   * cikariyor ve sayfayi gereksiz uzatiyordu.
   */
  const hours = hoursFromMonday(content.openingHours);

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
          >
            <p>{fill(t.contact.intro, { name })}</p>
          </SectionTitle>
        </Reveal>

        {/*
          UC KOLON — tasarimdaki adres bolumu (1.2fr .85fr .85fr): solda adres,
          ortada acilis saatleri, sagda iletisim bilgileri.

          NEDEN: onceki hali her blogu ayri ayri ortalanmis dar kolonlara
          koyuyordu (max-w-2xl / 4xl); 1240px'lik sayfada sag ve sol taraf bos
          kaliyor, bolum gereksiz uzuyordu.
        */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.85fr_0.85fr] lg:gap-14">
          {contact.address ? (
            <Reveal>
              <h3 className={`${meta} text-[var(--brand-primary)]`}>
                {t.contact.address}
              </h3>
              <p className="ky-detail mt-3 text-pretty">{contact.address}</p>

              {contact.mapsUrl ? (
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ky-strip mt-4 inline-block border-b border-[var(--brand-primary)] pb-1 text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]"
                >
                  {t.location.directions}
                </a>
              ) : null}
            </Reveal>
          ) : null}

          {hours.length > 0 ? (
            <Reveal delay={0.08}>
              <h3 className={`${meta} text-[var(--brand-primary)]`}>
                {t.about.openingHours}
              </h3>

              <dl className="mt-3 flex flex-col">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--brand-border)] py-2 last:border-b-0"
                  >
                    <dt className="ky-detail">{hour.dayLabel}</dt>
                    <dd className="ky-detail tabular-nums text-[var(--brand-ink-muted)]">
                      {hour.isClosed ? (
                        t.hours.closed
                      ) : (
                        <span dir="ltr">
                          {hour.openTime} — {hour.closeTime}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {rows.length > 1 ? (
            <Reveal delay={0.12}>
              <h3 className={`${meta} text-[var(--brand-primary)]`}>
                {t.contact.eyebrow}
              </h3>

              <dl className="mt-3 flex flex-col gap-3">
                {rows
                  .filter((row) => row.term !== t.contact.address)
                  .map((row, index) => (
                    <div key={`${row.term}-${index}`}>
                      <dt className="sr-only">{row.term}</dt>
                      <dd
                        className="ky-detail"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {row.href ? (
                          <a
                            href={row.href}
                            className="text-[var(--brand-primary)] underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
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
        </div>

        <Reveal delay={0.16}>
          {/* Form kolonu bilerek okuma kolonundan da dar: fis hissi. */}
          <div className="mx-auto mt-16 w-full max-w-2xl text-center">
            <h3 className="brand-display ky-h3">{t.contact.formTitle}</h3>
            <Ornament className="mt-5" />

            <div className="brand-frame mt-8 bg-[var(--brand-surface-alt)] px-6 py-8 text-start sm:px-10 sm:py-10">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
