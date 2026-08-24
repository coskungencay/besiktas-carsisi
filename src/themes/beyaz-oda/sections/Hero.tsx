import Image from "next/image";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import { HERO_FALLBACK, hoursRange, imageOrFallback, menuHref } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { shell } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Hero — carsinin kelime-markasi, kendi cephesinin uzerinde.
 *
 * ONCEKI HALI ve NEDEN DEGISTI: sol hizali kucuk bir baslik ("Besiktas'in
 * carsisi, kirk yildir ayni yerde") ve altinda ayri bir gorsel bandi vardi.
 * Ilk ekran bir metin blogu gibi duruyordu; 40 yillik bir carsinin
 * karsilamasi olacak agirligi tasimiyordu.
 *
 * Simdi: cephe fotografi tam ekran fon, uzerinde ortalanmis amblem + buyuk
 * kelime-marka. Ziyaretci sayfayi actiginda once NEREDE oldugunu goruyor.
 *
 * Acilis animasyonu Reveal ile DEGIL tokens.css'teki keyframe'lerle: hero ilk
 * ekranda oldugu icin scroll gozlemcisi gec kalir, CSS animasyonu SSR
 * ciktisiyla birlikte baslar. `prefers-reduced-motion` globals.css'te zaten
 * hepsini durduruyor.
 */
export default function Hero({ content }: SectionProps) {
  const { name, tagline, logoUrl, heroImageUrl, founded, contact, t } = content;

  const range = hoursRange(content.openingHours);

  /*
   * Alt seritteki kunye: yil · saat · semt. Bos olanlar hic basilmaz ki
   * musteri panelden birini silince ayirac ortada kalmasin.
   */
  const meta = [
    founded ? `${t.site.since} ${founded}` : "",
    range ? `${t.hours.label} ${range}` : "",
    contact.locality,
  ].filter(Boolean);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-[var(--brand-ink)]"
    >
      {/* Fon fotografi */}
      <div className="bo-hero-photo absolute inset-0 -z-20">
        <Image
          src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
          alt={fill(t.hero.coverAlt, { name })}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/*
        Ortasi acik, ust ve alti koyu bir perde. Ustte header'in beyaz seridi
        bitiyor, altta ise bir sonraki bolume gecis var; ikisi de metnin
        kontrastini bozmadan fotografi gostersin diye ucgen gradyan.
      */}
      <div
        aria-hidden="true"
        className="bo-hero-veil absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--bo-hero-veil-top),var(--bo-hero-veil-mid)_42%,var(--bo-hero-veil-bottom))]"
      />

      <div className={`${shell} py-24 text-center sm:py-32`}>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            /*
              96px tavan BILINCLI: amblemin kaynagi 185px. Daha buyuk
              basilirsa 2x ekranlarda bulaniklasir. (bkz. scripts/assets/README.md)
            */
            className="bo-hero-seal mx-auto mb-8 size-16 object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:size-24"
          />
        ) : null}

        <h1
          id="hero-title"
          className="bo-hero-word brand-display mx-auto max-w-[16ch] text-[clamp(2.5rem,7.2vw,6.5rem)] leading-[0.94] font-black tracking-[-0.035em] text-balance text-[var(--bo-hero-ink)] uppercase"
        >
          <Latin>{name}</Latin>
        </h1>

        <div
          aria-hidden="true"
          className="bo-hero-rule mx-auto mt-9 h-px w-24 bg-[var(--bo-hero-line)] sm:w-32"
        />

        {tagline ? (
          <p className="bo-hero-sub mx-auto mt-8 max-w-[46ch] text-[15px] leading-[1.75] text-pretty text-[var(--bo-hero-ink-soft)] sm:text-[17px]">
            <Latin>{tagline}</Latin>
          </p>
        ) : null}

        {meta.length > 0 ? (
          <ul className="bo-hero-meta bo-mono brand-eyebrow mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-light text-[var(--bo-hero-ink-soft)] sm:text-[11px]">
            {meta.map((entry, index) => (
              <li key={entry} className="flex items-center gap-4">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-[var(--bo-hero-line)]">
                    ·
                  </span>
                ) : null}
                {entry}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
          Tek eylem: magazalara git. Tasarimda dolgulu buton yok; temanin
          birincil eylem bicimi alt cizgili metin + ok (hero'daki adres
          baglantisi, iletisimdeki harita baglantisi ile ayni aile).
        */}
        <a
          href={menuHref(content)}
          /*
            bo-tap: hero'nun tek eylemi bu ve telefonda 26px yuksekligindeydi.
            Gorunmez dokunma alani icin bkz. tokens.css.
          */
          className="bo-hero-cue bo-tap mt-12 inline-flex items-center gap-2 border-b border-[var(--bo-hero-line)] pb-1 text-[14px] text-[var(--bo-hero-ink)] transition-colors hover:border-[var(--bo-hero-ink)] motion-reduce:animate-none"
        >
          <span>{t.hero.viewMenu}</span>
          <ArrowIcon className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
