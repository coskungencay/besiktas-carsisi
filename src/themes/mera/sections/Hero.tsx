import Image from "next/image";

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
  labelAccent,
  labelBase,
  labelFaint,
  page,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi ic sayfasi acilisi — ASIMETRIK (tasarimda 1.15fr / .85fr).
 *
 * Sol genis kolon: kunye satiri, dev serif baslik, cizgi, altinda iki kolona
 * bolunmus giris metni + kunye degerleri. Sag dar kolon: neredeyse kare
 * (10:11) bir fotograf ve altinda kucuk altyazi seridi.
 *
 * NEDEN <Reveal> YOK: tasarimda hero scroll ile degil, sayfa acilir acilmaz
 * kademeli olarak giriyor. Bunlar tokens.css'teki saf CSS acilis
 * animasyonlari (mera-*); JS beklemedigi icin ilk boyamada baslarlar ve
 * Reveal ile birlestirilirse cift animasyon olusurdu.
 */
export default function Hero({ content }: SectionProps) {
  const {
    heroHeadline,
    heroSubline,
    about,
    heroImageUrl,
    name,
    tagline,
    contact,
    t,
  } = content;

  const highlights = highlightsOrDerived(content);
  // Giris metni: once slogan altligi, yoksa "hakkimizda"nin ilk paragrafi.
  const intro = heroSubline || paragraphs(about)[0];

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/* Hero'nun ALT dolgusu YOK. Tasarimda bolumler yalnizca ust dolgu
          kullanir; buraya ayrica pb eklemek hero ile ilk ayirici cizgi arasini
          tasarimdaki 132px'ten iki katina cikariyordu. */}
      <div className={page}>
        <div className="grid items-end gap-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-[4.75rem]">
          <div className="min-w-0">
            {tagline ? (
              <p
                className={`${labelAccent} mera-wide mera-fade-eyebrow mb-[1.875rem]`}
              >
                {tagline}
              </p>
            ) : null}

            <h1
              id="hero-title"
              className="brand-display mera-up text-[clamp(2.6rem,7.2vw,6.5rem)] leading-[0.94] tracking-[-0.02em] text-balance"
            >
              {heroHeadline}
            </h1>

            {/* mera-line: cizgi baslangic kenarindan cekilerek cizilir. */}
            <Hairline className="mera-line mt-11 mb-[1.625rem]" />

            <div className="mera-up-late max-w-[620px]">
              <div className="grid gap-10 sm:grid-cols-2">
                {intro ? (
                  <p className="text-[0.97rem] leading-[1.65] text-pretty text-[var(--brand-ink-body)]">
                    {intro}
                  </p>
                ) : null}

                {highlights.length > 0 ? (
                  <dl className="flex flex-col gap-3.5">
                    {highlights.map((highlight, index) => (
                      <RuleRow key={index} term={highlight.label}>
                        {highlight.value}
                      </RuleRow>
                    ))}
                  </dl>
                ) : null}
              </div>

              {hasMenu(content) ? (
                <a
                  href="#menu"
                  className={`${labelBase} mera-caption mt-8 inline-flex items-center gap-3 border-b border-[var(--brand-primary)] pb-1 text-[0.75rem] text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-primary)]`}
                >
                  <span>{t.hero.viewMenu}</span>
                  <ArrowIcon className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="mera-fade-figure min-w-0">
            {/* Oran tasarimdan turetildi: 1440px'de dar kolon ~537px genis,
                gorsel 560px yuksek. Sabit yukseklik yerine oran kullaniliyor
                ki dar ekranda kolon daralinca gorsel de kucululsun. */}
            <div className="relative aspect-[24/25] w-full bg-[var(--brand-surface-alt)]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="object-cover"
              />
            </div>

            {/* Altyazi seridi yalnizca yazacak bir sey varsa basilir; yoksa
                fotografin altinda bos bir bant kalirdi. */}
            {contact.locality ? (
              <p className={`${labelFaint} mt-3`}>{contact.locality}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
