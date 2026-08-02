import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  Hairline,
  label,
  labelMuted,
  prose,
  proseFine,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Asimetrik 5/7: solda sadece etiket ve baslik, sagda metin. Denge bilerek
 * bozuk — simetri bu tasarimda "kurumsal" durur.
 *
 * Saatler metnin altinda AYRI bir blok; gun adi kucuk ve genis harf arali,
 * saatin kendisi serif, cunku sayfada okunmasi gereken tek "veri" o.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className={label}>{t.about.eyebrow}</p>
            <h2
              id="about-title"
              className="brand-display mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2] text-balance"
            >
              {t.about.title}
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className={`flex flex-col gap-6 ${prose}`}>
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>
        </div>

        {hours.length > 0 ? (
          <Reveal delay={0.12}>
            <div className="mt-20">
              <Hairline tone="gold" />

              <h3 className={`${label} mt-10`}>{t.about.openingHours}</h3>

              <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4"
                  >
                    <dt className={labelMuted}>{hour.dayLabel}</dt>
                    <dd className="brand-display text-lg tabular-nums">
                      {hour.isClosed ? (
                        <span className="text-[var(--brand-ink-muted)]">
                          {t.hours.closed}
                        </span>
                      ) : (
                        <span dir="ltr">
                          {hour.openTime} — {hour.closeTime}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className={`${proseFine} mt-10`}>{t.about.hoursNote}</p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
