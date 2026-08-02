import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  Hairline,
  SectionHead,
  bodyText,
  label,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi yazisi duzeni: tasarimdaki gibi metin UC ince kolona bolunur
 * (15px / 1.7), ilk paragraf "drop cap" ile acilir. Calisma saatleri kutu
 * icinde DEGIL, yalnizca cizgilerle ayrilmis liste halinde en altta durur.
 *
 * Paragraf sayisi kolon sayisini belirler: tek paragrafi uc kolona bolmek
 * sayfayi bos gosterirdi, bu yuzden az metinde izgara daralir.
 *
 * Drop cap sadece LTR'de: Arapca'da ilk harfi buyutup ayirmak kelimenin
 * bitisik yazimini bozar.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  const columns =
    body.length >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : body.length === 2
        ? "sm:grid-cols-2"
        : "max-w-[620px]";

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          >
            <Reveal delay={0.08}>
              {body.length > 0 ? (
                <div className={`grid gap-10 ${columns}`}>
                  {body.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? `${bodyText} ltr:first-letter:float-start ltr:first-letter:mt-1.5 ltr:first-letter:pe-2.5 ltr:first-letter:text-[2.9em] ltr:first-letter:leading-[0.8] ltr:first-letter:text-[var(--brand-primary)] ltr:first-letter:brand-display`
                          : bodyText
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className={`${bodyText} max-w-[620px]`}>
                  {fill(t.about.placeholder, { name })}
                </p>
              )}
            </Reveal>

            {hours.length > 0 ? (
              <Reveal delay={0.16}>
                <Hairline className="mt-14" />

                <div className="mt-9 grid gap-x-16 gap-y-9 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                  <div>
                    <h3 className={label}>{t.about.openingHours}</h3>
                    <p className="mt-4 text-[0.8125rem] leading-[1.6] text-[var(--brand-ink-faint)]">
                      {t.about.hoursNote}
                    </p>
                  </div>

                  <dl className="text-[0.845rem]">
                    {hours.map((hour) => (
                      <div
                        key={hour.dayOfWeek}
                        className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-[var(--brand-border)] py-2.5 last:border-0"
                      >
                        <dt className="text-[var(--brand-ink-body)]">
                          {hour.dayLabel}
                        </dt>
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
                </div>
              </Reveal>
            ) : null}
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
