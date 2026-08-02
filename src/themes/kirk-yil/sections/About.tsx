import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  DoubleRule,
  SectionTitle,
  column,
  meta,
  metaMuted,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ortalanmis dar kolon: once metin, altinda kunye rakamlari, en altta KLASIK
 * saat tablosu (gun basta, saat sonda, satirlari ince cizgi ayirir).
 * Hicbiri yoksa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, highlights, name, openingHours, t } = content;

  /*
   * Kunye rakamlari (1986 / 3. kusak / kum ocaginda) tasarimda HERO'DA DEGIL,
   * hikaye bolumunun altinda cift cizginin uzerinde duruyor. Hero afis
   * ritmini bozmasin diye buraya alindi.
   *
   * DIKKAT: burada highlightsOrDerived KULLANILMAZ. Musteri kunye girmediginde
   * o yardimci calisma saatinden ("07–23 / Saatler") satir uretiyor; hemen
   * altindaki saat tablosu ayni bilgiyi zaten veriyor ve rakam iki kez cikiyor.
   * Turetilmis kunyenin yeri hero'daki muhur.
   */
  if (!about && openingHours.length === 0 && highlights.length === 0) {
    return null;
  }

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className={`${column} ky-prose mt-10 flex flex-col gap-5 text-center text-pretty text-[var(--brand-ink-muted)]`}
          >
            {body.length > 0 ? (
              body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{fill(t.about.placeholder, { name })}</p>
            )}
          </div>
        </Reveal>

        {highlights.length > 0 ? (
          <Reveal delay={0.1}>
            <div className={`${column} mt-12`}>
              <DoubleRule />

              {/*
                Rakam ustte, etiket altta: DOM'da <dt> once gelmek ZORUNDA
                (gecerli <dl>), gorsel sirayi flex-col-reverse cozuyor.
              */}
              <dl className="flex flex-wrap items-start justify-center gap-x-11 gap-y-7 pt-6">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex flex-col-reverse items-center gap-1.5 text-center"
                  >
                    <dt className={metaMuted}>{highlight.label}</dt>
                    <dd className="brand-display ky-stat text-[var(--brand-primary)]">
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ) : null}

        {hours.length > 0 ? (
          <Reveal delay={0.12}>
            <div className="mx-auto mt-14 w-full max-w-md text-center">
              <h3 className={`${meta} text-[var(--brand-primary)]`}>
                {t.about.openingHours}
              </h3>

              <DoubleRule className="mt-4" />

              <dl className="mt-1 flex flex-col">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="ky-detail flex items-baseline justify-between gap-6 border-b border-[var(--brand-border)] py-2.5"
                  >
                    <dt>{hour.dayLabel}</dt>
                    <dd className="tabular-nums text-[var(--brand-ink-muted)]">
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

              {/* Not satiri tasarimda italik serif — arsiv altyazisi tonu. */}
              <p className="ky-note mt-5 text-[var(--brand-ink-muted)]">
                {t.about.hoursNote}
              </p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
