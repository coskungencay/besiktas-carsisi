import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import { SectionHead, card, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Manifesto bloku: solda baslik, sagda metin — tasarimin iki kolonlu duzeni.
 *
 * Saatler tabloya DEGIL yatay kaydirilabilir gun kartlarina donusur: koyu
 * zeminde satir satir bir cetvel agir durur, kart serisi ise afis ritmini korur.
 * Ne metin ne saat varsa bolum hic basilmaz.
 */
export default function About({ content }: SectionProps) {
  const { about, name, openingHours, t } = content;
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);
  const hours = hoursFromMonday(openingHours);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          />

          <div className="pk-lead mt-10 flex max-w-[46rem] flex-col gap-5 text-pretty text-[var(--brand-ink-muted)]">
            {body.length > 0 ? (
              body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{fill(t.about.placeholder, { name })}</p>
            )}
          </div>
        </Reveal>

        {hours.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-14">
              <h3 className="pk-eyebrow text-[var(--brand-primary)]">
                {t.about.openingHours}
              </h3>

              {/*
                Negatif kenar boslugu: kartlar ekranin kenarina kadar kaysin,
                kaydirilabilir oldugu ilk bakista anlasilsin diye.
              */}
              <div className="-mx-5 mt-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
                <dl className="flex w-max gap-3.5">
                  {hours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      className={`${card} min-w-[9.5rem] text-center`}
                    >
                      <dt className="pk-caps text-[var(--brand-ink-muted)]">
                        {hour.dayLabel}
                      </dt>
                      <dd
                        className={`brand-display mt-3 text-base tabular-nums ${
                          hour.isClosed
                            ? "text-[var(--brand-accent)]"
                            : "text-[var(--brand-primary)]"
                        }`}
                      >
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
              </div>

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
