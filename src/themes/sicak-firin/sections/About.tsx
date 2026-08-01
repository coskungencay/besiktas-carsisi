import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import { SectionHead, metaText, shell, soft, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Solda anlati, sagda saatler yumusak kart icinde.
 *
 * "Bugun" satiri BILEREK vurgulanmiyor: gun hesabi sunucuda ve tarayicida farkli
 * cikabilir (saat dilimi), bu da hydration uyusmazligi olur.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <SectionHead
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              titleId="about-title"
            />

            <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>

          {hours.length > 0 ? (
            <Reveal delay={0.08} className="lg:col-span-5">
              <div className={`${soft} p-6 sm:p-8`}>
                <h3 className={metaText}>{t.about.openingHours}</h3>

                <dl className="mt-5 flex flex-col gap-3">
                  {hours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
                    >
                      <dt className="text-sm">{hour.dayLabel}</dt>
                      <dd className="text-sm tabular-nums text-[var(--brand-ink-muted)]">
                        {hour.isClosed ? (
                          t.hours.closed
                        ) : (
                          <span dir="ltr">
                            {hour.openTime} – {hour.closeTime}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
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
