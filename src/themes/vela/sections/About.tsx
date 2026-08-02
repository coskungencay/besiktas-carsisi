import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  Hairline,
  label,
  metaMuted,
  proseFine,
  proseSm,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimdaki "deneyim" bolumu: solda 280px genisliginde SADECE etiket ve
 * altinda kisa bir cizgi, sagda 1fr icerik. Aradaki 70px bosluk denge
 * bilerek bozuk tutuyor — simetri bu tasarimda "kurumsal" durur.
 *
 * Paragraflar numaralanmis kartlara donusuyor (01, 02, 03…): tasarimda ic
 * icerik boyle bolunmus. Numara ve baslik serif, govde sans — kontrast
 * temanin ritmini kuruyor.
 *
 * Saatler ayri bir blok; gun adi kucuk ve genis harf arali, saatin kendisi
 * serif, cunku sayfada okunmasi gereken tek "veri" o.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);
  const cards = body.length > 0 ? body : [fill(t.about.placeholder, { name })];

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-[17.5rem_1fr] lg:gap-[4.375rem]">
          <Reveal>
            <p className={label}>{t.about.eyebrow}</p>
            <Hairline tone="gold" className="mt-4" />
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              {/* Tasarimda 38px / 1.4 — baslik degil, "acilis cumlesi" olcusu. */}
              <h2
                id="about-title"
                className="brand-display max-w-[62.5rem] text-[clamp(1.625rem,3.4vw,2.375rem)] leading-[1.4] tracking-[-0.005em] text-pretty"
              >
                {t.about.title}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              {/* 58px ust bosluk ve 52px kolon araligi tasarimdan. */}
              <div className="mt-[3.625rem] grid gap-x-[3.25rem] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((paragraph, index) => (
                  <div key={index}>
                    <div className="brand-display text-[0.9375rem] tracking-[var(--brand-meta-tracking)] text-[var(--brand-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    {/* Tasarimda ayrac 18px ust / 20px alt bosluk aliyor. */}
                    <Hairline className="mt-[1.125rem] mb-[1.25rem]" />
                    <p className={proseSm}>{paragraph}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {hours.length > 0 ? (
          <Reveal delay={0.12}>
            <div className="mt-24">
              <Hairline tone="gold" />

              <h3 className={`${label} mt-10`}>{t.about.openingHours}</h3>

              <dl className="mt-8 grid gap-x-[3.25rem] gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-[1.1875rem]"
                  >
                    <dt className={metaMuted}>{hour.dayLabel}</dt>
                    <dd className="brand-display text-[1.3125rem] leading-[1.3] tabular-nums">
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
