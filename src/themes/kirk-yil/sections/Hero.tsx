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
  Ornament,
  Passepartout,
  column,
  meta,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * TAM SIMETRIK afis duzeni: kunye satiri, dev serif baslik, kisa ayrac,
 * tek satirda kunyeler ve en altta cerceveli gorsel.
 *
 * Baslik `heroHeadline`ten gelir; musteri panelde bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, contact, heroImageUrl, name, tagline, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Baslik ustundeki "est." satiri: once semt/sehir. Slogan zaten hemen
   * yukarida tabelanin altinda basiliyor; ayni satiri iki kez ust uste
   * gostermek tabela hissini bozuyordu. Slogan sadece semt yoksa devreye girer.
   */
  const eyebrow = contact.locality || tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-14 pb-16 sm:pt-20 sm:pb-24`}>
        <Reveal>
          <div className={`${column} text-center`}>
            {eyebrow ? <p className={meta}>{eyebrow}</p> : null}

            <h1
              id="hero-title"
              className="brand-display mt-6 text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05] text-balance"
            >
              {heroHeadline}
            </h1>

            {heroSubline ? (
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                {heroSubline}
              </p>
            ) : null}

            <Ornament className="mt-8" />
          </div>
        </Reveal>

        {highlights.length > 0 ? (
          <Reveal delay={0.08}>
            {/*
              Kunyeler tek satirda ve aralarinda dikey ayrac; dar ekranda alta
              sariyor. Ayraclar ilk ogeden sonra basildigi icin RTL'de de dogru
              tarafta kalir.
            */}
            <dl
              className={`${column} mt-8 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-3`}
            >
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-baseline gap-3">
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="text-[var(--brand-accent)]"
                    >
                      |
                    </span>
                  ) : null}
                  <dt className={meta}>{highlight.label}</dt>
                  <dd className="text-sm">{highlight.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {hasMenu(content) ? (
          <Reveal delay={0.1}>
            <p className="mt-10 text-center">
              <a
                href="#menu"
                className="brand-frame brand-eyebrow inline-flex items-center gap-3 border-[var(--brand-primary)] px-7 py-3 text-xs text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]"
              >
                <span>{t.hero.viewMenu}</span>
                <ArrowIcon className="size-3.5" />
              </a>
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={0.12}>
          <Passepartout className="mx-auto mt-14 max-w-5xl">
            <div className="relative aspect-[4/3] sm:aspect-[16/9]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </Passepartout>
        </Reveal>
      </div>
    </section>
  );
}
