import Image from "next/image";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  label,
  meta,
  metaInk,
  metaMuted,
  prose,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin hero'su: once ince bir altin cizgi CIZILIR, hemen ardindan
 * buyuk serif baslik asagidan yukari suzulur, en son da sagdaki dar kolon
 * gelir. Bu kademeli giris temanin ilk izlenimi.
 *
 * NEDEN Reveal YOK: bu blok sayfanin ilk ekraninda; scroll ile tetiklenen
 * Reveal burada ya hic calismaz ya da gec kalir. Yerine tokens.css'teki saf
 * CSS acilis animasyonlari (vl-*) kullanildi — SSR ile ilk boyamada baslar.
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
      <div className={`${shell} pt-16 pb-14 sm:pt-24 sm:pb-[4.875rem]`}>
        {kicker ? (
          <p className={`${label} vl-up-early mb-8`}>{kicker}</p>
        ) : null}

        {/*
         * Cizgi tasarimda altindan saydama giden bir gecis; tek renk bir cubuk
         * degil. scaleX ile cizildigi icin transform-origin tokens.css'te.
         */}
        <div
          aria-hidden="true"
          className="vl-rule h-px w-full bg-linear-to-r from-[var(--brand-primary)] to-transparent rtl:bg-linear-to-l"
        />

        {/* 34px ust bosluk ve 60px kolon araligi tasarimdan birebir. */}
        <div className="mt-[2.125rem] flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-[3.75rem]">
          <h1
            id="hero-title"
            className="vl-up brand-display max-w-[47.5rem] text-[clamp(2.5rem,6.6vw,5.25rem)] leading-[1.02] tracking-[-0.01em] text-balance"
          >
            {heroHeadline}
          </h1>

          {/* Dar kolon tasarimda sabit 330px; buyuyen baslik onu ezmesin. */}
          <div className="vl-up-late w-full lg:w-[20.625rem] lg:shrink-0">
            {heroSubline ? <p className={prose}>{heroSubline}</p> : null}

            {highlights.length > 0 ? (
              <dl className="mt-5 flex flex-col gap-3">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <dt className={metaMuted}>{highlight.label}</dt>
                    <dd className={meta}>{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {hasMenu(content) ? (
              <a
                href="#menu"
                className="mt-7 inline-flex items-center gap-3 border-b border-[var(--brand-primary)] pb-2 transition-colors hover:text-[var(--brand-primary)]"
              >
                <span className={metaInk}>{t.hero.viewMenu}</span>
                <ArrowIcon className="size-3.5 text-[var(--brand-primary)]" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/*
       * Kenardan kenara cok yatay bant: sayfanin ilk nefes molasi.
       * Gorsel hafifce ic zoom yapiyor; sarmalayici overflow-hidden olmali
       * yoksa buyuyen kenarlar yatay kaydirma yaratir.
       */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--brand-surface-alt)] sm:aspect-[21/9]">
        <Image
          src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
          alt={fill(t.hero.coverAlt, { name })}
          fill
          sizes="100vw"
          priority
          className="vl-zoom object-cover"
        />
        {/* Alt kenardaki koyulasma: bandin sayfaya baglanmasi icin. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-transparent to-[var(--brand-surface)] opacity-70"
        />
      </div>
    </section>
  );
}
