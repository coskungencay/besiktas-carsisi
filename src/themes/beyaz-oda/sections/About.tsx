import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  SectionIndex,
  meta,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Editoryal iki kolon: solda metin (ilk paragraf 27px "lead", devami 15px),
 * sagda monospace calisma saati tablosu. Tasarimda tablo satirlari 13px dikey
 * bosluk ve ince alt cizgiyle ayriliyor.
 *
 * Ne metin ne saat varsa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  // Ilk paragraf tasarimda buyuk puntolu giris cumlesi; kalani govde metni.
  const [lead, ...rest] = body;

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          <SectionIndex index="01" title={t.about.title} titleId="about-title">
            <div className="grid gap-10 lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="brand-display text-[clamp(1.25rem,2vw,1.6875rem)] leading-[1.42] tracking-[-0.015em] text-pretty">
                    {lead || fill(t.about.placeholder, { name })}
                  </p>
                </Reveal>

                {rest.length > 0 ? (
                  <Reveal delay={0.09}>
                    <div className="mt-[26px] flex max-w-[460px] flex-col gap-4 text-[15px] leading-[1.8] text-pretty text-[var(--brand-ink-soft)]">
                      {rest.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                ) : null}
              </div>

              {hours.length > 0 ? (
                <div className="lg:col-span-4 lg:col-start-7">
                  <Reveal delay={0.16}>
                    {/* Tasarimda blok basliklari 10.5px mono, .06em. */}
                    <h3 className="bo-index-sm brand-eyebrow">
                      {t.about.openingHours}
                    </h3>

                    <dl className="mt-4 flex flex-col">
                      {hours.map((hour) => (
                        <div
                          key={hour.dayOfWeek}
                          className={`${meta} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-[13px]`}
                        >
                          <dt className="brand-eyebrow">{hour.dayLabel}</dt>
                          <dd className="tabular-nums text-[var(--brand-ink)]">
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

                    <p className="bo-index mt-5 leading-[1.8]">
                      {t.about.hoursNote}
                    </p>
                  </Reveal>
                </div>
              ) : null}
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
