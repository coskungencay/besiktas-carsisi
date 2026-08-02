import Image from "next/image";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { Sprig, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Avlu girisi: her sey tek eksende ortalanmis.
 *
 * Kunyeler yan yana dizilir ve aralarina ince dikey ayrac girer; ayrac
 * kenarlik olarak veriliyor ki RTL'de kendiliginden diger tarafa gecsin.
 * Baslik `heroHeadline`ten gelir; musteri bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 *
 * HAREKET: Burada <Reveal> KULLANILMAZ. Ilk ekran zaten goruntude oldugu icin
 * scroll bekleyen bir gozlemci gereksiz; tasarimin acilis merdiveni (yaFade →
 * yaRise → yaArch) saf CSS ile veriliyor ve sunucudan gelen ilk boyamada
 * calisiyor. Ikisi birden uygulanirsa cift animasyon olurdu.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, t } = content;

  const highlights = highlightsOrDerived(content);
  // Ustteki kucuk etiket: once mekanin semti, yoksa slogan.
  const label = contact.locality || content.tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-4 pb-12 text-center sm:pt-6 sm:pb-16`}>
        {label ? (
          <p className="ya-kicker ya-fade-1 brand-body text-[var(--brand-ink-muted)]">
            {label}
          </p>
        ) : null}

        {/*
         * Tasarimdaki 92px Cormorant baslik: satir yuksekligi 1'e cok yakin,
         * harf araligi -.01em. Kucuk ekranda 2.5rem'den baslar.
         */}
        <h1
          id="hero-title"
          className="brand-display ya-rise mx-auto mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.75rem)] leading-[1.04] tracking-[-0.01em] text-balance"
        >
          {heroHeadline}
        </h1>

        {/* Tasarimda hero'nun ikinci satiri italik serif bir fisilti. */}
        {heroSubline ? (
          <p className="brand-display ya-serif-book ya-fade-2 mx-auto mt-6 max-w-xl text-[clamp(1.05rem,2.2vw,1.3rem)] leading-relaxed text-pretty text-[var(--brand-ink-muted)] italic">
            {heroSubline}
          </p>
        ) : null}

        <Sprig className="ya-fade-2 mt-9" />

        {highlights.length > 0 ? (
          <dl className="ya-fade-3 mx-auto mt-9 grid max-w-md grid-cols-2 gap-6 sm:flex sm:max-w-none sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-y-6">
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
                <dt className="ya-meta brand-body text-[var(--brand-ink-muted)]">
                  {highlight.label}
                </dt>
                {/* Tasarimdaki sayilar Cormorant, govde agirliginda (400). */}
                <dd className="brand-display ya-serif-book text-xl">
                  {highlight.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {hasMenu(content) ? (
          <a
            href="#menu"
            className="ya-nav ya-pill ya-fade-3 brand-body mt-11 inline-flex items-center gap-2 bg-[var(--brand-primary)] px-7 py-3.5 text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
          >
            <span>{t.hero.viewMenu}</span>
            <ArrowIcon className="size-4" />
          </a>
        ) : null}
      </div>

      {/*
       * Avlu kemeri: tasarimin imzasi olan yuvarlak tepeli gorsel cercevesi.
       * Yaricaplar yuzde oldugu icin (bkz. .ya-arch) her genislikte ayni oran.
       */}
      <div className={shell}>
        <div className="ya-arch ya-arch-in relative aspect-[4/5] w-full overflow-hidden bg-[var(--brand-surface-alt)] sm:aspect-[21/10]">
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
    </section>
  );
}
