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
import { Sprig, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Avlu girisi: her sey tek eksende ortalanmis.
 *
 * Kunyeler yan yana dizilir ve aralarina ince dikey ayrac girer; ayrac
 * kenarlik olarak veriliyor ki RTL'de kendiliginden diger tarafa gecsin.
 * Baslik `heroHeadline`ten gelir; musteri bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, t } = content;

  const highlights = highlightsOrDerived(content);
  // Ustteki kucuk etiket: once mekanin semti, yoksa slogan.
  const label = contact.locality || content.tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-4 pb-14 text-center sm:pt-8 sm:pb-20`}>
        <Reveal>
          {label ? <p className={eyebrow}>{label}</p> : null}

          <h1
            id="hero-title"
            className="brand-display mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.15] text-balance"
          >
            {heroHeadline}
          </h1>

          {heroSubline ? (
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
              {heroSubline}
            </p>
          ) : null}

          <Sprig className="mt-10" />
        </Reveal>

        {highlights.length > 0 ? (
          <Reveal delay={0.08}>
            <dl className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-6 sm:flex sm:max-w-none sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-y-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  /*
                   * Dikey ayrac yalnizca kunyeler tek satira sigdiginda (sm+)
                   * cizilir; dar ekranda ikili izgaraya dusuyorlar ve ayrac
                   * ikinci satirin basinda bosa asili kalirdi.
                   */
                  className="flex flex-col items-center justify-center gap-2 sm:px-8 sm:first:ps-0 sm:last:pe-0 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-[var(--brand-border)]"
                >
                  <dt className={eyebrow}>{highlight.label}</dt>
                  <dd className="brand-display text-lg">{highlight.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {hasMenu(content) ? (
          <Reveal delay={0.12}>
            <a
              href="#menu"
              className="brand-rounded mt-12 inline-flex items-center gap-2 bg-[var(--brand-primary)] px-7 py-3 text-sm text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
            >
              <span>{t.hero.viewMenu}</span>
              <ArrowIcon className="size-4" />
            </a>
          </Reveal>
        ) : null}
      </div>

      {/* Genis, yuvarlak koseli gorsel: avlunun manzarasi. */}
      <Reveal delay={0.15}>
        <div className={shell}>
          <div className="brand-rounded relative aspect-[16/9] w-full overflow-hidden bg-[var(--brand-surface-alt)]">
            <Image
              src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
              alt={fill(t.hero.coverAlt, { name })}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
