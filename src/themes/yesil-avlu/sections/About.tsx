import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday, paragraphs } from "@/themes/_shared/data";
import {
  SectionHeading,
  column,
  eyebrow,
  shell,
  surface,
} from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dar ve ortalanmis bir metin kolonu, altinda gunlerin kart izgarasi.
 *
 * Saatler tablo yerine kartlarda: bu tema yumusak ve yuvarlak: uzun bir
 * cizgi tablosu duzenin sakinligini bozuyordu. Ne metin ne saat varsa
 * bolum hic basilmaz (Header'daki nav linki de ayni kosulla gizli).
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
          <SectionHeading
            eyebrowText={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div
            className={`${column} mt-10 flex flex-col gap-6 text-center text-base leading-loose text-pretty text-[var(--brand-ink-muted)]`}
          >
            {body.length > 0 ? (
              body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{fill(t.about.placeholder, { name })}</p>
            )}
          </div>
        </Reveal>

        {hours.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16">
              <h3 className={`${eyebrow} text-center`}>{t.about.openingHours}</h3>

              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className={`brand-frame flex flex-col items-center justify-center gap-2 px-4 py-6 text-center ${
                      hour.isClosed
                        ? "bg-[var(--brand-surface-alt)] opacity-70"
                        : "bg-[var(--brand-surface)]"
                    }`}
                  >
                    <dt className={eyebrow}>{hour.dayLabel}</dt>
                    <dd className="brand-display text-base tabular-nums">
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

              <p className="mt-6 text-center text-xs leading-relaxed text-[var(--brand-ink-muted)]">
                {t.about.hoursNote}
              </p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
