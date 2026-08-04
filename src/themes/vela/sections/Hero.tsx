import Image from "next/image";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK_DARK,
  highlightsOrDerived,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { meta, proseOnPhoto, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin hero'su TAM EKRAN BIR FOTOGRAF: karanlik, atmosferik bir mekân
 * goruntusu hafifce ic zoom yapar, uzerine ustten ve alttan koyulasan bir
 * perde iner ve butun yazi bu perdenin ALT kenarina yaslanir. Temanin
 * "butik otel" hissi bu tek karardan geliyor; yaziyi gorselden ayirip alt
 * alta koymak tasarimi siradan bir bloga cevirir.
 *
 * Alt blokta once ince bir altin cizgi CIZILIR (soldan saga, saydama giden
 * gecis), hemen ardindan buyuk serif baslik asagidan yukari suzulur, en son
 * da sagdaki dar kolon gelir.
 *
 * NEDEN Reveal YOK: bu blok sayfanin ilk ekraninda; scroll ile tetiklenen
 * Reveal burada ya hic calismaz ya da gec kalir. Yerine tokens.css'teki saf
 * CSS acilis animasyonlari (vl-*) kullanildi — SSR ile ilk boyamada baslar.
 *
 * NEDEN HERO'DA BUTON YOK: tasarimda da yok; menuye ust seritteki nav
 * goturuyor. Fotografin uzerindeki tek eylem cagrisi basligin kendisi.
 *
 * Baslik `heroHeadline`ten gelir; panelde bos birakilirsa icerik katmani
 * isletme adini koyuyor, yani burada asla bos degil.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, tagline, name, t } = content;

  const highlights = highlightsOrDerived(content);
  /*
   * Sagdaki dar kolonun metni tasarimda mekâni anlatan KISA bir paragraf
   * ("sekiz masa, tek kavurma partisi..."), slogan degil. Kaynagi
   * hakkimizda'nin ilk paragrafi; musteri henuz yazmadiysa slogana duser.
   */
  const intro = paragraphs(content.about)[0] ?? tagline;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      /*
       * Tasarimda ust serit hero'nun ICINDE, fotografin uzerinde duruyor ve
       * bolumun toplam yuksekligi 780px (48.75rem). Bizde Header ayri bir
       * bilesen oldugu icin fotograf lg'de negatif ust bosluk ile seridin
       * altina cekiliyor: 5.25rem = 30px + 30px dolgu + 24px marka satiri.
       * Boylece Header + Hero toplami yine 780px oluyor ve marka adi
       * tasarimdaki gibi fotografin uzerinde duruyor.
       *
       * Kucuk ekranlarda cekme YOK: orada serit sarabildigi icin yuksekligi
       * degisken; fotografin altinda kalmasi daha guvenli.
       *
       * flex + items-end yazinin her zaman alt kenara yaslanmasini saglar:
       * fotograf uzasa da baslik ile alt kenar arasindaki 78px'lik bosluk
       * sabit kalir.
       */
      className={`${surface} relative flex min-h-[32rem] items-end overflow-hidden lg:-mt-[5.25rem] lg:min-h-[48.75rem]`}
    >
      {/*
       * Fotograf hafifce ic zoom yapiyor; sarmalayici overflow-hidden olmali
       * yoksa buyuyen kenarlar yatay kaydirma yaratir.
       */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={imageOrFallback(heroImageUrl, HERO_FALLBACK_DARK)}
          alt={fill(t.hero.coverAlt, { name })}
          fill
          sizes="100vw"
          priority
          className="vl-zoom object-cover"
        />
      </div>

      {/*
       * Uc duraklı perde: ust kenar koyu (ust seritle birlesir), orta acilir
       * (fotograf nefes alir), alt kenar en koyu (yazinin kontrasti musteri
       * hangi fotografi yuklerse yuklesin garanti altina alinir).
       */}
      <div aria-hidden="true" className="vl-veil absolute inset-0" />

      {/*
       * lg'de ust dolgu seridin yuksekliginden (5.25rem) buyuk: baslik cok
       * uzasa bile nav'in altina girmez.
       */}
      <div
        className={`${shell} relative w-full pt-24 pb-14 lg:pt-[7.5rem] lg:pb-[4.875rem]`}
      >
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
            <Latin>{heroHeadline}</Latin>
            {/*
             * Tasarimda basligin bir parcasi ITALIK VE ALTIN — temanin imzasi
             * bu tek vurgu. Ayni punto ve ayni satir icinde akar; kucuk punto
             * ile ayri bir yere basmak vurguyu yok eder.
             */}
            {heroSubline ? (
              <>
                {" "}
                <span className="italic text-[var(--brand-primary)]">
                  <Latin>{heroSubline}</Latin>
                </span>
              </>
            ) : null}
          </h1>

          {/* Dar kolon tasarimda sabit 330px; buyuyen baslik onu ezmesin. */}
          <div className="vl-up-late w-full lg:w-[20.625rem] lg:shrink-0">
            {intro ? <p className={proseOnPhoto}><Latin>{intro}</Latin></p> : null}

            {/*
             * Tasarimda paragrafin 20px altinda tek satirlik altin bir kunye
             * var ("09:00 — 22:00 · Her gun"). Kunyeler cogalirsa satir sarar,
             * alt alta yigilmaz — o dar kolonu uzatirdi.
             *
             * NEDEN ETIKET DE ALTIN: tasarimda bu satirin TAMAMI altin, tek
             * parca bir cizgi gibi okunuyor; etiketi soluk griye almak hem o
             * imzayi bolerdi hem de fotograf uzerinde okunmaz kalirdi.
             */}
            {highlights.length > 0 ? (
              <dl className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-baseline gap-x-2"
                  >
                    <dt className={meta}>{highlight.label}</dt>
                    <dd className={meta}>{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
