import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import { SectionHead, label, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi yazisi duzeni: solda genis metin kolonu, ilk paragraf buyuk serif
 * ve "drop cap" ile aciliyor; sagda saatler kutu icinde DEGIL, yalnizca
 * cizgilerle ayrilmis liste halinde.
 *
 * Drop cap sadece LTR'de: Arapca'da ilk harfi buyutup ayirmak kelimenin
 * bitisik yazimini bozar.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${page} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          />
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal delay={0.06} className="lg:col-span-7">
            {body.length > 0 ? (
              <div className="flex flex-col gap-6">
                {body.map((paragraph, index) =>
                  index === 0 ? (
                    <p
                      key={index}
                      className="brand-display text-[1.35rem] leading-[1.55] text-pretty sm:text-[1.6rem] ltr:first-letter:float-start ltr:first-letter:pe-3 ltr:first-letter:text-[3.5em] ltr:first-letter:leading-[0.78] ltr:first-letter:text-[var(--brand-primary)]"
                    >
                      {paragraph}
                    </p>
                  ) : (
                    <p
                      key={index}
                      className="max-w-2xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]"
                    >
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            ) : (
              <p className="brand-display text-[1.35rem] leading-[1.55] text-pretty sm:text-[1.6rem]">
                {fill(t.about.placeholder, { name })}
              </p>
            )}
          </Reveal>

          {hours.length > 0 ? (
            <Reveal delay={0.12} className="lg:col-span-5">
              <h3 className={label}>{t.about.openingHours}</h3>

              <dl className="mt-5 border-t border-[var(--brand-border)]">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-[var(--brand-border)] py-3"
                  >
                    <dt className="brand-display text-base">{hour.dayLabel}</dt>
                    <dd className="text-sm tabular-nums text-[var(--brand-ink-muted)]">
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
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
