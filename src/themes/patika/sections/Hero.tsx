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
  pillAccent,
  pillLine,
  pillSolid,
  shell,
  surface,
} from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Afis hero'su: gorsel UZERINE yazi YOK.
 *
 * NEDEN: metni fotografin ustune koymak koyu temada kontrasti sansa birakiyor.
 * Bunun yerine tipografi once gelir (dev, 900 agirlikli baslik + rozet satiri),
 * gorsel altta genis ve yuvarlak koseli bir blok olarak durur.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, tagline, heroImageUrl, name, t } = content;

  const highlights = highlightsOrDerived(content);
  const showMenuLink = hasMenu(content);

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-12 pb-10 sm:pt-16 sm:pb-14`}>
        <Reveal>
          {tagline ? <p className={pillLine}>{tagline}</p> : null}

          <h1
            id="hero-title"
            /*
             * leading 0.85 poster hissi icin cazip ama Turkce'de ustu/alti
             * uzayan harfler (ç, ğ, ş, İ) satirlar arasinda birbirine giriyor.
             * 0.95 hem afis sikiligini koruyor hem harfleri ayirir.
             */
            className="brand-display mt-6 text-[clamp(3rem,13vw,8.5rem)] leading-[0.95] text-balance"
          >
            {heroHeadline}
          </h1>

          {heroSubline ? (
            <p className="brand-display mt-4 max-w-3xl text-[clamp(1.5rem,4.5vw,2.75rem)] leading-[0.95] text-pretty text-[var(--brand-ink-muted)]">
              {heroSubline}
            </p>
          ) : null}
        </Reveal>

        {highlights.length > 0 || showMenuLink ? (
          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {showMenuLink ? (
                <a
                  href="#menu"
                  className={`${pillSolid} transition-opacity hover:opacity-85`}
                >
                  <span>{t.hero.viewMenu}</span>
                  <ArrowIcon className="size-4" />
                </a>
              ) : null}

              {highlights.length > 0 ? (
                <dl className="flex flex-wrap items-center gap-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className={pillAccent}>
                      <dt className="text-[var(--brand-ink-muted)]">
                        {highlight.label}
                      </dt>
                      <dd className="font-bold">{highlight.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </Reveal>
        ) : null}
      </div>

      {/* Gorsel blogu: kenarlardan icerde, yuvarlak koseli, kalin cerceveli. */}
      <Reveal delay={0.12}>
        <div className={`${shell} pb-4`}>
          <div className="brand-frame relative aspect-[4/3] w-full overflow-hidden bg-[var(--brand-surface-alt)] sm:aspect-[16/7]">
            <Image
              src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
              alt={fill(t.hero.coverAlt, { name })}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
