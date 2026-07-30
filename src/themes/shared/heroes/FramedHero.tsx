import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  BrandMark,
  HERO_FALLBACK,
  HeroActions,
  containerClass,
  sectionClass,
} from "@/themes/shared/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Cerceve icinde iki sutun: solda metin, sagda tam yukseklikte gorsel.
 * Kullanan temalar: tesviye
 */
export default function FramedHero({ content }: SectionProps) {
  const { name, tagline, contact, t } = content;

  return (
    <section id="hero" aria-labelledby="hero-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <div className="brand-frame grid overflow-hidden lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-12 border-b-[length:var(--brand-border-width)] border-[var(--brand-border)] p-8 sm:p-12 lg:border-b-0 lg:border-e-[length:var(--brand-border-width)]">
              <BrandMark content={content} />

              <div>
                {contact.locality ? (
                  <p className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                    {contact.locality}
                  </p>
                ) : null}

                <h1
                  id="hero-title"
                  className="brand-display mt-4 text-4xl leading-tight text-balance sm:text-6xl"
                >
                  {name}
                </h1>

                {tagline ? (
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                    {tagline}
                  </p>
                ) : null}
              </div>

              <HeroActions content={content} />
            </div>

            <div className="relative min-h-[360px] bg-[var(--brand-surface-alt)]">
              <Image
                src={content.heroImageUrl || HERO_FALLBACK}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
