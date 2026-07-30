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
 * Tam genislikte gorsel + zemin renginde yari saydam ortu.
 * Kullanan temalar: patika, vela
 */
export default function OverlayHero({ content }: SectionProps) {
  const { name, tagline, contact, t } = content;

  return (
    <section id="hero" aria-labelledby="hero-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <div className="brand-rounded relative overflow-hidden bg-[var(--brand-surface-alt)]">
          <Image
            src={content.heroImageUrl || HERO_FALLBACK}
            alt={fill(t.hero.coverAlt, { name })}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Ortu: zemin renginin %75'i — hem acik hem koyu temalarda okunur kalir. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--brand-surface)_78%,transparent)]"
          />

          <div className="relative flex flex-col justify-between gap-16 p-8 sm:p-14">
            <Reveal>
              <BrandMark content={content} />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="max-w-3xl">
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
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                    {tagline}
                  </p>
                ) : null}

                <HeroActions content={content} className="mt-8" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
