import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import { SectionHead, lead, shell, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Solda anlati, sagda saatler KOYU kart icinde.
 *
 * Koyu kart tasarimin tek yuksek kontrastli yuzeyi: sicak krem sayfanin
 * ortasinda firinin agzi gibi duruyor. Saatler oraya kondu cunku sayfada en
 * cok bakilan bilgi o.
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
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-13">
          <Reveal className="lg:col-span-7">
            <SectionHead
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              titleId="about-title"
            />

            <div className={`${lead} mt-6 flex flex-col gap-5 text-pretty`}>
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>

          {hours.length > 0 ? (
            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="brand-rounded bg-[var(--brand-ink)] px-8 py-9 text-[var(--brand-on-ink)]">
                <h3 className="brand-body brand-eyebrow text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-on-ink-eyebrow)]">
                  {t.about.openingHours}
                </h3>

                <dl className="mt-5 flex flex-col">
                  {hours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-[var(--brand-on-ink-hairline)] py-3 last:border-b-0"
                    >
                      <dt className="text-[length:var(--brand-text-row)] font-light">
                        {hour.dayLabel}
                      </dt>
                      <dd className="text-[length:var(--brand-text-row)] font-medium tabular-nums">
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

                <p className="mt-6 text-sm leading-relaxed font-light text-[var(--brand-on-ink-muted)]">
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
