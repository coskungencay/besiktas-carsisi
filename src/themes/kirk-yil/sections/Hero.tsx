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
  Ornament,
  Passepartout,
  column,
  metaMuted,
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
 *
 * ANIMASYON: hero'da <Reveal> YOK. Acilis hareketi tokens.css'teki ky-*
 * siniflarindan geliyor (kyWide/kyUp/kyFade/kyStamp); boylece ilk ekran
 * JavaScript beklemeden, SSR'dan gelen boyamayla birlikte oynar. Reveal
 * sayfanin asagisindaki bolumlerde kaliyor.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, contact, heroImageUrl, name, tagline, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Baslik ustundeki "est." satiri: once semt/sehir. Slogan zaten hemen
   * yukarida tabelanin altinda basiliyor; ayni satiri iki kez ust ust
   * gostermek tabela hissini bozuyordu. Slogan sadece semt yoksa devreye girer.
   */
  const eyebrow = contact.locality || tagline;

  /*
   * Yuvarlak muhur (tasarimdaki "40 / yildir" rozeti) yalnizca KISA bir
   * kunyeyle calisir; "07:00 — 23:00" gibi uzun degerler daireyi patlatir.
   * Sigmayacaksa rozet hic basilmaz — icerik DB'den geldigi icin uzunluga
   * guvenemeyiz.
   */
  const stamp = highlights.find(
    (highlight) => highlight.value.length <= 8 && highlight.label.length <= 14,
  );

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/*
        Alt bosluk yok: tasarimda gorsel bolumun kenarinda bitiyor, dikey
        araligi bir sonraki bolumun kendi ust boslugu veriyor.
      */}
      <div className={`${shell} pt-12 pb-0 sm:pt-16`}>
        <div className={`${column} text-center`}>
          {eyebrow ? (
            /* Tasarim: 12.5px / .28em — bolum kunyelerinden bir tik buyuk. */
            <p className="brand-body ky-hero-eyebrow ky-wide text-[var(--brand-primary)]">
              {eyebrow}
            </p>
          ) : null}

          <h1
            id="hero-title"
            className="brand-display ky-h1 ky-up mt-[22px] text-balance"
          >
            {heroHeadline}
          </h1>

          <Ornament wide className="ky-fade-slow mt-6" />

          {heroSubline ? (
            <p className="ky-lead ky-up-2 mx-auto mt-[26px] max-w-[40rem] text-pretty text-[var(--brand-ink-muted)]">
              {heroSubline}
            </p>
          ) : null}
        </div>

        {highlights.length > 0 ? (
          /*
            Kunyeler tek satirda ve aralarinda dikey ayrac; dar ekranda alta
            sariyor. Ayraclar ilk ogeden sonra basildigi icin RTL'de de dogru
            tarafta kalir.
          */
          <dl
            className={`${column} ky-up-3 mt-8 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-3`}
          >
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-baseline gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-[var(--brand-accent)]">
                    |
                  </span>
                ) : null}
                <dt className={metaMuted}>{highlight.label}</dt>
                <dd className="text-sm">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {hasMenu(content) ? (
          <p className="ky-up-4 mt-[34px] text-center">
            <a
              href="#menu"
              className="brand-frame ky-btn-label inline-flex items-center gap-3 border-[var(--brand-primary)] px-8 py-[15px] text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]"
            >
              <span>{t.hero.viewMenu}</span>
              <ArrowIcon className="size-3.5" />
            </a>
          </p>
        ) : null}

        {/* Muhur mutlak konumlandigi icin cerceve goreli bir kutuya sarildi. */}
        <div className="relative mx-auto mt-[62px] max-w-5xl">
          <Passepartout className="ky-fade-frame">
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

          {stamp ? (
            /*
              Dar ekranda gizli: 150px'lik daire gorselin ustune tasip
              basligi kapatiyordu. end-* kullanildigi icin RTL'de sola gecer.
            */
            <div className="ky-stamp absolute -top-9 end-[-8px] hidden size-[150px] flex-col items-center justify-center rounded-full border-2 border-[var(--brand-primary)] bg-[var(--brand-surface)] px-4 text-center text-[var(--brand-primary)] sm:flex">
              <span className="brand-display ky-stat">{stamp.value}</span>
              <span className="ky-stamp-label mt-2">{stamp.label}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
