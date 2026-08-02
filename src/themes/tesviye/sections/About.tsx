import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  Sheet,
  SheetHead,
  bodyText,
  bodyTextSm,
  cell,
  hair,
  label,
  pad,
  shell,
  splitGrid,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Iki bolmeli pafta: solda metin, sagda saatler tablo gorunumunde.
 * Ne metin ne saat varsa bolum hic basilmaz (nav'daki link de ayni kosulda).
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section
      id="hakkimizda"
      aria-labelledby="about-title"
      className="bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <Sheet>
          <Reveal>
            <SheetHead
              code="01"
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              titleId="about-title"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className={`${splitGrid} ${
                hours.length > 0 ? "lg:grid-cols-[3fr_2fr]" : "grid-cols-1"
              }`}
            >
              <div
                className={`${cell} ${pad} ${bodyText} flex flex-col gap-4 text-[var(--brand-ink-muted)]`}
              >
                {body.length > 0 ? (
                  body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>{fill(t.about.placeholder, { name })}</p>
                )}
              </div>

              {hours.length > 0 ? (
                <div className={`${cell} ${pad}`}>
                  <h3 className={`${label} text-[var(--brand-primary)]`}>
                    {t.about.openingHours}
                  </h3>

                  {/* Tasarimda etiketle tablo arasi 18px. */}
                  <dl className="mt-[18px]">
                    {hours.map((hour) => (
                      <div
                        key={hour.dayOfWeek}
                        className={`${hair} ${bodyTextSm} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-[10px]`}
                      >
                        <dt>{hour.dayLabel}</dt>
                        <dd className="font-medium tabular-nums">
                          {hour.isClosed ? (
                            t.hours.closed
                          ) : (
                            <span dir="ltr">
                              {hour.openTime}–{hour.closeTime}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5 text-[length:var(--ts-label)] leading-[1.8] font-light text-[var(--brand-ink-muted)]">
                    {t.about.hoursNote}
                  </p>
                </div>
              ) : null}
            </div>
          </Reveal>
        </Sheet>
      </div>
    </section>
  );
}
