import Link from "next/link";

import { ImageZoom } from "@/components/site/ImageZoom";
import { fill } from "@/i18n";
import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  anyItemHasImage,
  featuredItems,
  hasMenu,
  itemThumb,
  menuHref,
} from "@/themes/_shared/data";
import { SectionHeading, shell } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI — tam liste degil.
 *
 * NEDEN VITRIN: menu buyudukce (30+ urun) bu koyu serit sayfanin yarisini
 * kaplayip "tek nefes kesen yer" olma ozelligini kaybediyordu. Tam liste artik
 * kendi sayfasinda (/tr/menu); burada yalnizca uc urun ve oraya giden dugme
 * duruyor. Serit boylece tasarimdaki boyuna geri donuyor.
 *
 * ZEMIN: tasarimda menu tam genislikte KOYU bir serit. Renkler .ya-grove
 * kapsaminda token'lar yeniden tanimlanarak veriliyor, boylece burada sabit
 * renk yazmiyoruz.
 *
 * URUN BICIMI: tasarimin menu kolonlarinda tek "buyuk" oge kategori adiydi —
 * italik serif 26px ve altinda ince cizgi. Vitrinde kategori yok, o yuzden bu
 * bicim urun adina veriliyor: uc urun tasarimin kendi diliyle one cikiyor.
 * Kart YOK; bu tasarimda kutu sadece hero gorseli, galeri ve saat kartinda var.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hic urun isaretlemediyse bolum bos kalmasin diye menunun ilk uc
   * urunune duseriz; vitrinin hep dolu olmasi tasarimin ritmi icin sart.
   */
  const featured = featuredItems(content, 3);
  const items = featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  const withImages = anyItemHasImage(content, items);

  return (
    <section id="menu" aria-labelledby="menu-title" className="ya-grove">
      {/*
        Bolum boslugu burada .brand-section DEGIL, elle veriliyor.
        .brand-section komsu iki bolumun 130px'lik arasini yariya bolme
        kuralidir; koyu serit ise tasarimda hem o 130px'i (kendinden onceki
        bolumun bosluguyla) hem de KENDI 96/100px'lik ic boslugunu tasiyor.
      */}
      <div className={`${shell} py-[var(--brand-section-py)] sm:pt-24 sm:pb-25`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        {/*
          1180px tasarimdan geliyor: sayfanin geri kalani kenardan kenara
          aksa da menu izgarasi ortada bu genislikte duruyor. Uc kolonun
          arasindaki 64px'lik bosluk fiyat sutununun okunurlugunu tasiyor.
        */}
        <ul className="mx-auto mt-14 grid max-w-[73.75rem] gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            /* Tasarimdaki kolon merdiveni: 0 / 100 / 200ms. */
            <Reveal key={item.id} as="li" delay={index * 0.1}>
              {/*
                flex-wrap + min-w-0: uzun urun adi dar ekranda fiyatin uzerine
                binmez, fiyat alt satira duser.
              */}
              {withImages ? (
                /*
                  Fotograf hucrenin USTUNDE ve GENIS yuvarlatilmis: bu temanin
                  imzasi yumusak koseler, kare bir pul buraya yabanci dururdu.
                  Fotografi olmayan urunde ayni yer bos birakilir ki uc kolonun
                  basliklari ayni hizada kalsin.
                */
                <div
                  className={`relative mb-5 aspect-[4/3] overflow-hidden rounded-[var(--brand-radius)] ${itemThumb(content, item) ? "bg-[var(--brand-surface-alt)]" : ""}`}
                >
                  {itemThumb(content, item) ? (
                    /*
                      Kucuk kare TIKLANABILIR: bu boyuttan urunun neye benzedigi
                      anlasilmiyor. ImageZoom yerinde bir <button> basar (kutu ayni
                      kalir) ve tiklaninca tarayicinin kendi <dialog>'unda buyutur.
                    */
                    <ImageZoom
                      thumbSrc={itemThumb(content, item) as string}
                      fullSrc={item.imageUrl}
                      alt={item.name}
                      openLabel={fill(t.menu.enlarge, { name: item.name })}
                      closeLabel={t.menu.closeImage}
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    />
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--brand-border)] pb-3.5">
                <h3 className="brand-display ya-serif-book min-w-0 text-[1.625rem] leading-tight italic">
                  <Latin>{item.name}</Latin>
                </h3>

                {item.price ? (
                  /* Fiyat tasarimda 15px gövde yazisi ve accent renginde. */
                  <p
                    className="shrink-0 text-[0.9375rem] font-light tabular-nums text-[var(--brand-accent)]"
                    dir="ltr"
                  >
                    {item.price}
                  </p>
                ) : null}
              </div>

              {item.description ? (
                <p className="mt-3.5 text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-muted)]">
                  {item.description}
                </p>
              ) : null}
            </Reveal>
          ))}
        </ul>

        {/*
          Tam menuye giden tek dugme: temanin hap bicimi (.ya-pill), ama koyu
          zeminde TERS — zemin zaten --brand-primary oldugu icin dolgu
          --brand-primary-contrast'tan okunuyor. Bu iki token .ya-grove icinde
          yeniden tanimlanmadigindan kontrast panelden renk degisse de korunur.
        */}
        <div className="mt-14 flex justify-center">
          <Link
            href={menuHref(content)}
            className="ya-nav ya-pill brand-body inline-flex items-center bg-[var(--brand-primary-contrast)] px-[1.625rem] py-3.5 text-center text-[var(--brand-primary)] transition-opacity hover:opacity-85"
          >
            {t.menu.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
