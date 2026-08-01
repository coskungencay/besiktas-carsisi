/*
 * LEGACY ORTAK BILESEN
 *
 * Bu klasordeki bilesenler, tasarimina gore HENUZ yeniden yazilmamis temalarin
 * ortak iskeletidir — dokuz temanin ayni gorunmesinin sebebi de buydu.
 *
 * YENI TEMA YAZARKEN KULLANMAYIN. Ornek yapi: src/themes/beyaz-oda/
 * Ortak MANTIK icin: src/themes/_shared/  (bkz. THEMING.md)
 */
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
 * Ust satirda marka + adres, altta 12'li izgarada baslik / slogan ayrimi,
 * en altta genis gorsel.
 * Kullanan temalar: beyaz-oda
 */
export default function EditorialHero({ content }: SectionProps) {
  const { name, tagline, contact, t } = content;

  return (
    <section id="hero" aria-labelledby="hero-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <div className="flex flex-col gap-12">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <BrandMark content={content} />
              {contact.locality ? (
                <p className="text-sm text-[var(--brand-ink-muted)]">
                  {contact.locality}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h1
                  id="hero-title"
                  className="brand-display text-4xl leading-tight text-balance sm:text-6xl"
                >
                  {name}
                </h1>
              </div>

              <div className="flex flex-col justify-end gap-6 lg:col-span-5">
                {tagline ? (
                  <p className="text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                    {tagline}
                  </p>
                ) : null}
                <HeroActions content={content} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
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
