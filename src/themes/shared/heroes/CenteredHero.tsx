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
 * Ortalanmis metin bloklari, altta genis (21:9) gorsel.
 * Kullanan temalar: kirk-yil
 */
export default function CenteredHero({ content }: SectionProps) {
  const { name, tagline, contact, t } = content;

  return (
    <section id="hero" aria-labelledby="hero-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <div className="flex flex-col items-center gap-10 text-center">
          <Reveal>
            <BrandMark content={content} stacked iconClassName="size-10" />
          </Reveal>

          <Reveal delay={0.06}>
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
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                  {tagline}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <HeroActions content={content} className="justify-center" />
          </Reveal>

          <Reveal delay={0.18} className="w-full">
            <div className="brand-rounded relative aspect-21/9 w-full overflow-hidden bg-[var(--brand-surface-alt)]">
              <Image
                src={content.heroImageUrl || HERO_FALLBACK}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="100vw"
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
