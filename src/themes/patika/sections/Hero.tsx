import Image from "next/image";
import { Fragment } from "react";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK_DARK,
  featuredItems,
  highlightsOrDerived,
  hoursRange,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { pillLine, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/*
 * Baslik kelimelerinin giris gecikmesi — tasarimdaki satir gecikmeleri
 * (.05s / .15s / .25s). Ucuncuden sonrasi ayni kademede kalir.
 */
const HEADLINE_STAGGER = ["pk-up-1", "pk-up-2", "pk-up-3"];

/**
 * Afis hero'su: gorsel UZERINE yazi YOK.
 *
 * NEDEN: metni fotografin ustune koymak koyu temada kontrasti sansa birakiyor.
 * Tasarimda once tipografi geliyor (dev buyuk harf baslik), altinda uc kolonlu
 * bir taban satiri var: aciklama | kunye rozetleri | kucuk gorsel.
 *
 * ANIMASYON: burada <Reveal> KULLANILMIYOR. Reveal istemci tarafli ve scroll
 * ile tetikleniyor; ilk ekranda zaten gorunen bir blok icin bu, JS yuklenene
 * kadar bos bir hero demek. Yerine tokens.css'teki pk-up-* acilis animasyonu
 * var: sunucudan gelen HTML'de aninda ve sirali calisir.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, tagline, heroImageUrl, contact, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Sol kolonun metni: once SLOGAN, yoksa hakkimizdanin ilk paragrafi.
   *
   * Sira bilerek boyle: hakkimizda paragrafi hemen alttaki bolumde zaten
   * bastan basiliyor; onu once burada gostermek ayni cumleyi iki ekran arayla
   * tekrar ettiriyordu. Slogan ise sayfada baska hicbir yerde yok.
   */
  const intro = tagline || (paragraphs(content.about)[0] ?? "");

  /*
   * Basligin ikinci parcasindaki son noktalama isareti ayriliyor: tasarimda o
   * tek karakter turuncu. Isaret yoksa ikinci parca oldugu gibi basilir.
   */
  const sublineMatch = /([.!?…]+)$/.exec(heroSubline);
  const sublinePunctuation = sublineMatch?.[1] ?? "";
  const sublineText = sublinePunctuation
    ? heroSubline.slice(0, -sublinePunctuation.length)
    : heroSubline;

  /* Kelime kelime animasyon icin ayrilir; birden fazla bosluk sorun cikarmasin. */
  const headlineWords = heroHeadline.split(/\s+/).filter(Boolean);

  /*
   * Yuvarlak turuncu rozet tasarimda calisma saatini tasiyor. Musteri kendi
   * kunyelerini yazmadiysa highlightsOrDerived zaten saati rozet olarak
   * basiyor; ikisini birden gostermemek icin bu durumda daire hic cikmaz.
   */
  const range = hoursRange(content.openingHours);
  const showHoursBadge = range !== "" && content.highlights.length > 0;

  /* Kayan serit: one cikan urunler. Isaretli urun yoksa serit hic basilmaz. */
  const strip = featuredItems(content, 6);

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/*
        Tasarimda hero'nun ALT boslugu yok (`padding:70px 40px 0`); araligi
        altindaki seridin 76px'lik ust boslugu tasiyor. Serit basilmiyorsa
        (one cikan urun yoksa) bosluk burada verilir, yoksa hero sonraki
        bolume yapisirdi.
      */}
      <div
        className={`${shell} relative pt-12 sm:pt-16 lg:pt-[4.375rem] ${
          strip.length > 0 ? "" : "pb-12 sm:pb-16"
        }`}
      >
        {showHoursBadge ? (
          /*
           * Daire mutlak konumlu ve yalnizca genis ekranda: dar ekranda basligin
           * uzerine binerdi. inset-inline-end kullaniliyor ki Arapca'da sola gecsin.
           */
          <div
            className="pk-pop pk-badge absolute end-[3.75rem] top-10 hidden size-[8.25rem] flex-col items-center justify-center rounded-full bg-[var(--brand-accent)] text-center text-[var(--brand-primary-contrast)] lg:flex"
            aria-hidden="true"
          >
            <span>{t.hours.label}</span>
            <span dir="ltr">{range}</span>
          </div>
        ) : null}

        {/*
          Tasarimda bu satir KONUM ("Kadikoy · Yeldegirmeni") — kisa ve neon.
          Slogan burada degil: uzun bir cumle bu 12px'lik genis harf arali
          satirda iki satira boluniyor ve devasa basligin ustundeki gerilimi
          bozuyor. Ayrica slogan asagida taban satirinin metni; ikisinde birden
          cikarsa ayni cumle iki kez okunur. Semt yoksa satir hic basilmaz.
        */}
        {contact.locality ? (
          <p className="pk-up pk-eyebrow text-[var(--brand-primary)]">
            {contact.locality}
          </p>
        ) : null}

        {/*
          Tasarimda baslik satir satir, gecikmeli olarak giriyor. Panelde baslik
          tek satirlik bir alan (satir sonu giremiyoruz), o yuzden ayni etkiyi
          KELIME bazinda uretiyoruz: her kelime kendi gecikmesiyle yukari kayar.
          Gecikme en fazla ucuncu kademede sabitlenir; uzun basliklarda giris
          suruncemede kalmasin diye.
        */}
        <h1 id="hero-title" className="pk-h1 mt-[1.125rem] text-balance">
          {headlineWords.map((word, index) => (
            <Fragment key={index}>
              {/* Bosluk span'in DISINDA: icine alinsaydi satir sonu olusmazdi. */}
              {index > 0 ? " " : null}
              <span
                className={`inline-block ${
                  HEADLINE_STAGGER[Math.min(index, HEADLINE_STAGGER.length - 1)]
                }`}
              >
                {word}
              </span>
            </Fragment>
          ))}

          {/*
            Tasarimin imzasi: basligin bir parcasi NEON, sonundaki nokta
            turuncu. Panelde baslik tek satirlik bir alan oldugu icin ikinci
            rengi "baslik devami" alanindan aliyoruz — boylece musteri kendi
            metnini yazdiginda da iki tonlu ritim korunuyor.
          */}
          {heroSubline ? (
            <span className="pk-up-3 block text-[var(--brand-primary)]">
              {sublineText}
              {/* Tasarimda cumleyi bitiren nokta turuncu — kucuk ama imza. */}
              {sublinePunctuation ? (
                <span className="text-[var(--brand-accent)]">
                  {sublinePunctuation}
                </span>
              ) : null}
            </span>
          ) : null}
        </h1>

        {/*
          Taban satiri: tasarimda align-items:end — uc kolon da ALT kenardan
          hizali, boylece farkli yuksekteki bloklar tek bir cizgide biter.
        */}
        <div className="mt-10 grid items-end gap-7 lg:mt-13 lg:grid-cols-3">
          {/*
            Tasarimda sol kolonda mekani anlatan kisa bir paragraf var; slogan
            degil. "Hakkimizda"nin ilk paragrafini kullaniyoruz, o da yoksa
            slogana duseriz.
          */}
          {intro ? (
            <p className="pk-up-4 pk-lead max-w-[24rem] text-pretty text-[var(--brand-ink-muted)]">
              {intro}
            </p>
          ) : null}

          {highlights.length > 0 ? (
            <dl className="pk-up-5 flex flex-wrap items-center gap-2.5">
              {highlights.map((highlight, index) => (
                <div key={index} className={pillLine}>
                  <dt className="text-[var(--brand-ink-muted)]">
                    {highlight.label}
                  </dt>
                  <dd className="font-bold">{highlight.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {/*
            Gorsel: tasarimda 230px yuksekliginde, yalnizca yuvarlak koseli.
            col-start-3 acikca veriliyor: alt satir (heroSubline) bos kalirsa
            gorsel ortadaki kolona kayardi.
          */}
          <div className="pk-up-6 lg:col-start-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--brand-radius-media)] bg-[var(--brand-surface-alt)] lg:aspect-auto lg:h-[14.375rem]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK_DARK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 30rem, 100vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {strip.length > 0 ? (
        /*
         * Neon kayan serit — tasarimin imzasi. Icerik iki kez basiliyor:
         * animasyon -%50 kaydirinca ikinci kopya birincinin yerine oturur ve
         * dikis gorunmez. Kopya ekran okuyuculara tekrar okunmasin diye gizli.
         */
        <div
          className={`mt-[4.75rem] overflow-hidden border-y-[length:var(--brand-border-width)] border-[var(--brand-border)] bg-[var(--brand-primary)] py-[0.9375rem] text-[var(--brand-primary-contrast)]`}
        >
          <div className="pk-marquee">
            <MarqueeRow items={strip} />
            <MarqueeRow items={strip} ariaHidden />
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** Seridin tek kopyasi. Ayirici karakter dekoratif; metin sozlukten gelmez. */
function MarqueeRow({
  items,
  ariaHidden = false,
}: {
  items: { id: number; name: string; price: string }[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      className="flex shrink-0 items-center gap-11 pe-11"
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="pk-marquee-item flex shrink-0 items-center gap-11 whitespace-nowrap"
        >
          <span>
            {item.name}
            {item.price ? <span dir="ltr"> {item.price}</span> : null}
          </span>
          <span aria-hidden="true">&#10022;</span>
        </li>
      ))}
    </ul>
  );
}
