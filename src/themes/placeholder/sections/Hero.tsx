import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  BrandMark,
  HERO_FALLBACK,
  HeroActions,
  containerClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Metin bir yanda, gorsel diger yanda (4:3).
 * Kullanan temalar: mera, yesil-avlu, sicak-firin, placeholder
 */
export default function SplitHero({ content }: SectionProps) {
  const { name, tagline, contact, t } = content;

  return (
    <section id="hero" aria-labelledby="hero-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <BrandMark content={content} />

            {contact.locality ? (
              <p className="brand-eyebrow mt-8 text-xs text-[var(--brand-ink-muted)]">
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

            <HeroActions content={content} className="mt-8" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="brand-rounded relative aspect-4/3 w-full overflow-hidden bg-[var(--brand-surface-alt)]">
              <Image
                src={content.heroImageUrl || HERO_FALLBACK}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
