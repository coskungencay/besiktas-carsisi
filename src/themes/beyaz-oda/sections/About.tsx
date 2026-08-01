import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import { SectionIndex, meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Editoryal iki kolon: solda metin, sagda monospace calisma saati tablosu.
 * Ne metin ne saat varsa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section border-t border-[var(--brand-border)]`}>
        <Reveal>
          <SectionIndex index="01" title={t.about.title} titleId="about-title">
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col gap-5 text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                {body.length > 0 ? (
                  body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>{fill(t.about.placeholder, { name })}</p>
                )}
              </div>

              {hours.length > 0 ? (
                <div>
                  <h3 className={`${meta} brand-eyebrow`}>
                    {t.about.openingHours}
                  </h3>

                  <dl className="mt-4 flex flex-col">
                    {hours.map((hour) => (
                      <div
                        key={hour.dayOfWeek}
                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[var(--brand-border)] py-3"
                      >
                        <dt className="text-sm">{hour.dayLabel}</dt>
                        <dd className="brand-body text-sm tabular-nums text-[var(--brand-ink-muted)]">
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

                  <p className="mt-5 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
                    {t.about.hoursNote}
                  </p>
                </div>
              ) : null}
            </div>
          </SectionIndex>
        </Reveal>
      </div>
    </section>
  );
}
