import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Hairline,
  RuleRow,
  labelBase,
  page,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi ic sayfasi acilisi — ASIMETRIK.
 *
 * Sol genis kolon: dev serif baslik ve giris metni.
 * Sag dar kolon: kunye satirlari (cizgilerle ayrilmis), ALTINDA dikey 3:4
 * gorsel. Gorsel bilerek tam genislikte degil; dergide fotograf metnin
 * yaninda durur, altinda bant olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, about, heroImageUrl, name, tagline, t } =
    content;

  const highlights = highlightsOrDerived(content);
  // Giris metni: "hakkimizda"nin ilk paragrafi, yoksa slogan.
  const intro = paragraphs(about)[0] || tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${page} pt-12 pb-16 sm:pt-16 sm:pb-24`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h1
                id="hero-title"
                className="brand-display text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.98] tracking-[-0.02em] text-balance"
              >
                {heroHeadline}
              </h1>

              {heroSubline ? (
                <p className="brand-display mt-6 max-w-xl text-[clamp(1.25rem,2.6vw,1.9rem)] leading-snug text-pretty text-[var(--brand-ink-muted)]">
                  {heroSubline}
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.08}>
              <Hairline className="mt-10" />

              <div className="pt-6">
                {intro ? (
                  <p className="max-w-lg text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                    {intro}
                  </p>
                ) : null}

                {hasMenu(content) ? (
                  <a
                    href="#menu"
                    className={`${labelBase} mt-8 inline-flex items-center gap-3 border-b border-[var(--brand-ink)] pb-1.5 transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`}
                  >
                    <span>{t.hero.viewMenu}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            {highlights.length > 0 ? (
              <Reveal delay={0.06}>
                <dl className="border-t border-[var(--brand-border)]">
                  {highlights.map((highlight, index) => (
                    <RuleRow key={index} term={highlight.label}>
                      {highlight.value}
                    </RuleRow>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            <Reveal delay={0.12}>
              <div
                className={`relative aspect-[3/4] w-full bg-[var(--brand-surface-alt)] ${
                  highlights.length > 0 ? "mt-8" : ""
                }`}
              >
                <Image
                  src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                  alt={fill(t.hero.coverAlt, { name })}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
