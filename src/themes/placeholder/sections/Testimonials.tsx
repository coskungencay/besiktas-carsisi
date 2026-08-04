import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHeader,
  StarIcon,
  containerClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

/** 5'lik olcek sabit; dolu yildiz sayisi puandan gelir. */
const STARS = [1, 2, 3, 4, 5];

export default function Testimonials({ content }: SectionProps) {
  // Gorunurluk tek yerde karara baglanir (panel + icerik kontrolu birlikte).
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  return (
    <section
      id="yorumlar"
      aria-labelledby="testimonials-title"
      className={sectionClass}
    >
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          />
        </Reveal>

        {/* Menu kartlariyla ayni izgara ve bosluk ritmi. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal as="li" key={item.id} delay={Math.min(i, 5) * 0.05}>
              <figure className="brand-frame flex h-full flex-col gap-4 bg-[var(--brand-surface-alt)] p-6">
                {item.rating !== null ? (
                  <p className="flex items-center gap-2 text-[var(--brand-accent)]">
                    {/*
                     * Yildizlar salt gorsel: ekran okuyucu ayni bilgiyi bir kez,
                     * asagidaki sr-only metinden alsin.
                     */}
                    <span aria-hidden="true" className="flex items-center gap-1">
                      {STARS.map((star) => (
                        <StarIcon key={star} filled={star <= item.rating!} />
                      ))}
                    </span>
                    <span className="sr-only">
                      {fill(t.testimonials.ratingLabel, {
                        rating: String(item.rating),
                      })}
                    </span>
                  </p>
                ) : null}

                <blockquote className="flex-1 text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                  <p>{item.text}</p>
                </blockquote>

                <figcaption className="brand-display border-t border-[var(--brand-border)] pt-4 text-base">
                  <Latin>{item.author}</Latin>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
