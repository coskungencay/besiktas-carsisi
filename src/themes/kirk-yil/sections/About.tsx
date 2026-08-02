import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  DoubleRule,
  SectionTitle,
  column,
  meta,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ortalanmis dar kolon: once metin, altinda KLASIK saat tablosu
 * (gun basta, saat sonda, satirlari ince cizgi ayirir).
 * Ne metin ne saat varsa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

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
            className={`${column} mt-10 flex flex-col gap-6 text-center text-base leading-relaxed text-pretty`}
          >
            {body.length > 0 ? (
              body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{fill(t.about.placeholder, { name })}</p>
            )}
          </div>
        </Reveal>

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
                    className="flex items-baseline justify-between gap-6 border-b border-[var(--brand-border)] py-3"
                  >
                    <dt className="text-sm">{hour.dayLabel}</dt>
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
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
