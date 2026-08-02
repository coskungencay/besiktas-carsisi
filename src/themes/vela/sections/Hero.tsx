import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Hairline,
  label,
  labelInk,
  labelMuted,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dikey ritim: her sey alt alta ve sayfanin ortasindan baslayan dar bir
 * kolonda (lg:col-start-3). Boylece solda genis bir bosluk kaliyor — butik
 * otel sayfalarinin sessizligi bu bosluktan geliyor.
 *
 * Baslik `heroHeadline`ten gelir; panelde bos birakilirsa icerik katmani
 * isletme adini koyuyor, yani burada asla bos degil.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, tagline, t } =
    content;

  const highlights = highlightsOrDerived(content);
  // Basligin ustundeki etiket ayri bir DB alani degil: slogan, yoksa semt.
  const kicker = tagline || contact.locality;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-20 pb-16 sm:pt-32 sm:pb-24`}>
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-3">
            <Reveal>
              {kicker ? <p className={label}>{kicker}</p> : null}

              <h1
                id="hero-title"
                className="brand-display mt-8 text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.15] text-balance"
              >
                {heroHeadline}
              </h1>

              {heroSubline ? (
                <p className="brand-display mt-5 text-[clamp(1.25rem,3vw,2rem)] leading-[1.3] text-balance text-[var(--brand-ink-muted)]">
                  {heroSubline}
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.08}>
              <Hairline tone="gold" className="mt-14 sm:mt-20" />
            </Reveal>

            {highlights.length > 0 ? (
              <Reveal delay={0.12}>
                <dl className="mt-12 flex flex-col gap-7">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <dt className={labelMuted}>{highlight.label}</dt>
                      <dd className="brand-display text-lg leading-[1.4] sm:text-xl">
                        {highlight.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}

            {hasMenu(content) ? (
              <Reveal delay={0.15}>
                <a
                  href="#menu"
                  className="mt-14 inline-flex items-center gap-3 border-b border-[var(--brand-primary)] pb-2 transition-colors hover:text-[var(--brand-primary)]"
                >
                  <span className={labelInk}>{t.hero.viewMenu}</span>
                  <ArrowIcon className="size-3.5 text-[var(--brand-primary)]" />
                </a>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>

      {/* Kenardan kenara cok yatay bant: sayfanin ilk nefes molasi. */}
      <Reveal delay={0.1}>
        <div className="relative aspect-[3/2] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/9]">
          <Image
            src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
            alt={fill(t.hero.coverAlt, { name })}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
