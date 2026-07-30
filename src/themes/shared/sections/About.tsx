import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/shared/parts";
import type { SectionProps } from "@/themes/types";

export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;

  // Ne metin ne saat varsa bolumu hic basma.
  if (!about && openingHours.length === 0) return null;

  const paragraphs = about
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <SectionHeader
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              titleId="about-title"
            />
            <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)] sm:text-lg">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>

          {openingHours.length > 0 ? (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="brand-frame bg-[var(--brand-surface-alt)] p-6 sm:p-8">
                <h3 className="brand-display text-xl">{t.about.openingHours}</h3>

                <dl className="mt-5 flex flex-col">
                  {openingHours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-3 last:border-b-0"
                    >
                      <dt className="text-sm sm:text-base">{hour.dayLabel}</dt>
                      <dd className="text-sm tabular-nums text-[var(--brand-ink-muted)] sm:text-base">
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
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
