import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  SQUARE_FALLBACK,
  featuredItems,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { chip, metaText, shell, soft, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sicak karsilama: solda metin + yuvarlak rozetler, sagda kare-yuvarlak gorsel.
 *
 * Altindaki "bugun firindan" vitrini bu temanin imzasi: one cikan urunler uc
 * yumusak kart halinde daha sayfanin basinda gorunuyor. Urun isaretlenmemisse
 * satir hic basilmaz, duzen bozulmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, t } = content;

  const highlights = highlightsOrDerived(content);
  const featured = featuredItems(content, 3);
  const showMenuCta = hasMenu(content);

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-10 pb-16 sm:pt-16 sm:pb-24`}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <h1
              id="hero-title"
              className="brand-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.1] text-balance"
            >
              {heroHeadline}
            </h1>

            {heroSubline ? (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                {heroSubline}
              </p>
            ) : null}

            {highlights.length > 0 ? (
              <dl className="mt-8 flex flex-wrap gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className={chip}>
                    <dt className={metaText}>{highlight.label}</dt>
                    <dd className="text-sm">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/*
              Menu de semt de yoksa bu satir hic basilmaz; bos bir flex kutusu
              mt-8 kadar olu bosluk birakip basligi vitrinden kopariyordu.
            */}
            {showMenuCta || contact.locality ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {showMenuCta ? (
                  <a
                    href="#menu"
                    className="brand-rounded inline-flex items-center gap-2 bg-[var(--brand-primary)] px-6 py-3 text-sm text-[var(--brand-primary-contrast)] transition-opacity hover:opacity-85"
                  >
                    <span>{t.hero.viewMenu}</span>
                    <ArrowIcon />
                  </a>
                ) : null}

                {contact.locality ? (
                  <a
                    href={contact.mapsUrl || "#iletisim"}
                    {...(contact.mapsUrl
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-[var(--brand-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--brand-ink)] hover:underline"
                  >
                    {contact.locality}
                  </a>
                ) : null}
              </div>
            ) : null}
          </Reveal>

          {/* Kare-yuvarlak gorsel: firinin vitrinine bakar gibi, tek bir sicak yuzey. */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div
              className={`${soft} relative aspect-square w-full overflow-hidden`}
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

        {featured.length > 0 ? (
          <Reveal delay={0.12}>
            <div className="mt-16 sm:mt-20">
              <h2 className={metaText}>{t.menu.featured}</h2>

              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((item) => (
                  <li key={item.id} className={`${soft} p-5`}>
                    <div className="relative aspect-square w-full overflow-hidden brand-rounded bg-[var(--brand-surface)]">
                      <Image
                        src={imageOrFallback(
                          item.thumbUrl || item.imageUrl,
                          SQUARE_FALLBACK,
                        )}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="brand-display text-xl">{item.name}</h3>
                      {item.price ? (
                        <p className="text-sm tabular-nums" dir="ltr">
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
