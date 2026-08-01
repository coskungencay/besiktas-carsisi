import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { Rule, meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin imzasi: solda "— 00" indeksi, iki tonlu buyuk baslik, ince ayrac,
 * altinda uc kolon (metin / kunye / adres), en altta genis gorsel bandi.
 *
 * Baslik `heroHeadline`ten gelir; musteri panelde bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, about, contact, heroImageUrl, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  // Hero'daki kisa tanitim: "hakkimizda"nin ilk paragrafi, yoksa slogan.
  const intro = about.split(/\n{2,}/)[0]?.trim() || content.tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-16 pb-0 sm:pt-24`}>
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <p className={`${meta} lg:col-span-2`} aria-hidden="true">
              — 00
            </p>

            <h1
              id="hero-title"
              className="brand-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-[-0.02em] text-balance lg:col-span-10"
            >
              {heroHeadline}
              {heroSubline ? (
                <>
                  {" "}
                  <span className="text-[var(--brand-ink-muted)]">
                    {heroSubline}
                  </span>
                </>
              ) : null}
            </h1>
          </div>
        </Reveal>

        <Rule className="mt-16 sm:mt-24" />

        <Reveal delay={0.08}>
          <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-10">
            {intro ? (
              <p className="text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)] lg:col-span-4">
                {intro}
              </p>
            ) : null}

            {highlights.length > 0 ? (
              <dl className={`${meta} flex flex-col gap-2 lg:col-span-4`}>
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-baseline gap-2">
                    <dt className="brand-eyebrow">{highlight.label}</dt>
                    {highlight.label && highlight.value ? (
                      <span aria-hidden="true">·</span>
                    ) : null}
                    <dd className="text-[var(--brand-ink)]">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {contact.address ? (
              <div className="lg:col-span-4 lg:text-end">
                <a
                  href={contact.mapsUrl || "#iletisim"}
                  {...(contact.mapsUrl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-1 text-sm transition-colors hover:text-[var(--brand-ink-muted)]"
                >
                  <span className="text-pretty">{contact.address}</span>
                  <ArrowIcon className="size-3.5" />
                </a>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>

      {/* Gorsel bandi kenardan kenara: tasarimda sayfanin alt sinirini o cizer. */}
      <Reveal delay={0.12}>
        <div className="relative aspect-[16/7] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/9]">
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
