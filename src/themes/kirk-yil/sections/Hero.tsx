import Image from "next/image";
import Link from "next/link";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
  menuHref,
  paragraphs,
} from "@/themes/_shared/data";
import {
  Ornament,
  Passepartout,
  buttonGhost,
  buttonSolid,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * TAM SIMETRIK afis duzeni. Tasarimdaki siralama birebir:
 * kunye -> dev serif baslik -> ayrac -> kisa paragraf -> iki buton ->
 * cerceveli genis gorsel + kosesinde yuvarlak muhur.
 *
 * Baslik `heroHeadline`ten gelir; musteri panelde bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 *
 * ANIMASYON: hero'da <Reveal> YOK. Acilis hareketi tokens.css'teki ky-*
 * siniflarindan geliyor (kyWide/kyUp/kyFade/kyStamp); boylece ilk ekran
 * JavaScript beklemeden, SSR'dan gelen boyamayla birlikte oynar. Reveal
 * sayfanin asagisindaki bolumlerde kaliyor. Gecikmeler tasarimdaki kademe:
 * .1 kunye, .2 baslik, .5 ayrac/cerceve, .6 paragraf, .75 butonlar, .9 muhur.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, contact, heroImageUrl, name, tagline, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Baslik ustundeki "est." satiri: once semt/sehir. Slogan zaten hemen
   * yukarida tabelanin altinda basiliyor; ayni satiri iki kez ust ust
   * gostermek tabela hissini bozuyor. Slogan sadece semt yoksa devreye girer.
   */
  const eyebrow = contact.locality || tagline;

  /*
   * Tasarimda basligin altindaki paragraf mekani anlatiyor (slogan degil).
   * Kaynagi "hakkimizda"nin ilk paragrafi; o da yoksa slogana duseriz.
   */
  const intro = paragraphs(content.about)[0] ?? tagline;

  /*
   * Yol tarifi butonu yalnizca konum bolumu sayfada varken basilir; yoksa
   * hicbir yere gitmeyen kirik bir capa olurdu.
   */
  const showDirections = content.isVisible("konum");
  const showMenu = hasMenu(content);

  /*
   * Yuvarlak muhur (tasarimdaki "40 / yildir" rozeti) yalnizca KISA bir
   * kunyeyle calisir; "07:00 — 23:00" gibi uzun degerler daireyi patlatir.
   * Sigmayacaksa rozet hic basilmaz — icerik DB'den geldigi icin uzunluga
   * guvenemeyiz.
   *
   * 6 karakter siniri dar ekrandaki 110px'lik daireden geliyor: icine yatay
   * olarak ancak bu kadar rakam siger, fazlasi cemberi tasardi.
   */
  const stamp = highlights.find(
    (highlight) => highlight.value.length <= 6 && highlight.label.length <= 14,
  );

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/*
        Alt bosluk yok: tasarimda gorsel bolumun kenarinda bitiyor, dikey
        araligi bir sonraki bolumun kendi ust boslugu veriyor.
      */}
      <div className={`${shell} pt-12 pb-0 sm:pt-16`}>
        {/*
          Metin kolonu tasarimda 1000px — bolum metinlerinin kullandigi dar
          kolondan (768px) genis, cunku 132px'lik baslik orada nefes aliyor.
        */}
        <div className="mx-auto w-full max-w-[62.5rem] text-center">
          {eyebrow ? (
            /* Tasarim: 12.5px / .28em — bolum kunyelerinden bir tik buyuk. */
            <p className="brand-body ky-hero-eyebrow ky-wide text-[var(--brand-primary)]">
              {eyebrow}
            </p>
          ) : null}

          <h1
            id="hero-title"
            /*
              break-words: 132px'lik puntoda TEK kelimelik uzun bir isletme
              adi (icerik DB'den geliyor, uzunluguna guvenemeyiz) 390px'te
              kolonu tasirdi; text-balance kelime BOLMEZ, sadece dagitir.
            */
            className="brand-display ky-h1 ky-up mt-[22px] break-words text-balance"
          >
            {heroHeadline}
            {/*
              "Baslik devami" alani basligin ICINDE, AYNI puntoda ikinci satir
              olarak basilir: tasarimdaki dev tabela yazisi tek renk ve cok
              satirli (line-height .92 tam bunun icin). Kucuk punto ile ayri
              bir yere basmak afis hissini bozuyordu.
            */}
            {heroSubline ? <span className="block">{heroSubline}</span> : null}
          </h1>

          <Ornament wide className="ky-fade-slow mt-6" />

          {intro ? (
            <p className="ky-lead ky-up-2 mx-auto mt-[26px] max-w-[40rem] text-pretty text-[var(--brand-ink-muted)]">
              {intro}
            </p>
          ) : null}

          {showMenu || showDirections ? (
            /*
              Tasarimda yan yana IKI buton var: dolu bordo "menu" ve cerceveli
              "nasil gelinir". Ikisi de kosullu oldugu icin biri dusunce digeri
              ortada tek basina kalir (justify-center).
            */
            <div className="ky-up-3 mt-[34px] flex flex-wrap items-center justify-center gap-4">
              {/*
                Menu artik ana sayfada bir capa degil, kendi sayfasi; bu yuzden
                next/link ile istemci tarafi gecis.
              */}
              {showMenu ? (
                <Link href={menuHref(content)} className={buttonSolid}>
                  {t.hero.viewMenu}
                </Link>
              ) : null}

              {showDirections ? (
                <a href="#konum" className={buttonGhost}>
                  {t.location.directions}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {/*
          Gorsel tasarimda kolonun degil, sayfa kabugunun tam genisliginde
          (1240px) ve BASIK: 1240x430. Muhur mutlak konumlandigi icin cerceve
          goreli bir kutuya sarildi.
        */}
        <div className="relative mt-[62px]">
          <Passepartout className="ky-fade-frame">
            <div className="relative aspect-[4/3] sm:aspect-[2/1] lg:aspect-[124/43]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1320px) 1240px, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </Passepartout>

          {stamp ? (
            /*
              Tasarimin imza ogesi; dar ekranda GIZLENMEZ, kucululur
              (150 -> 110px). Cerceveden 8px disari tasar ama kabugun 24px'lik
              kenar boslugu icinde kalir, yani 390px'te yatay tasma olmaz;
              dikeyde de gorselin 62px'lik ust boslugunun icinde durdugu icin
              basligin uzerine binmez. end-* kullanildigi icin RTL'de sola gecer.
            */
            /*
             * Damga dar ekranda ekranin sagindan tasip sabit WhatsApp butonuyla
             * cakisiyordu. Mobilde iceri alindi (end-2), genis ekranda tasarimdaki
             * gibi cerceveden hafifce disari cikmaya devam ediyor.
             */
            <div className="ky-stamp absolute -top-7 end-2 flex size-[110px] flex-col items-center justify-center rounded-full border-2 border-[var(--brand-primary)] bg-[var(--brand-surface)] px-3 text-center text-[var(--brand-primary)] sm:end-[-8px] sm:-top-9 sm:size-[150px] sm:px-4">
              <span className="brand-display ky-stamp-value">{stamp.value}</span>
              <span className="ky-stamp-label mt-1.5 sm:mt-2">
                {stamp.label}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
