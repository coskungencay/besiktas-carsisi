import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  featuredItems,
  hasMenu,
  menuHref,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  meta,
  rowNumber,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/** Ana sayfada gosterilen vitrin urunu sayisi — tasarimin listesi kisa. */
const SHOWCASE_COUNT = 3;

/**
 * Ana sayfanin menu VITRINI — tam liste artik /<dil>/menu sayfasinda.
 *
 * NEDEN: menu buyudukce (30+ urun) bu bolum sayfanin geri kalanini eziyordu.
 * Burada yalnizca birkac one cikan urun duruyor, tam liste kendi sayfasinda.
 *
 * Satir bicimi tasarimdan birebir: "sira no / ad / aciklama / fiyat" dort
 * kolona oturur. Urun gorseli YOK — tasarimin sadeligi bunu istiyor; panelden
 * yuklenen urun gorselleri bu temada gosterilmez.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hicbir urunu "one cikan" isaretlemediyse bolum bos kalmasin diye
   * menunun ilk urunlerine duseriz.
   */
  const featured = featuredItems(content, SHOWCASE_COUNT);
  const items =
    featured.length > 0 ? featured : allMenuItems(content).slice(0, SHOWCASE_COUNT);

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/*
            Baslik olarak uzun cumle degil KISA etiket kullaniliyor: tasarimda
            bu alan 2 kolonluk (~208px) dar bir serit ve metin 11px BUYUK harf.
            "Bugun tezgahta ne var?" orada dort satira bolunup ritmi bozardi.
            O cumle menu SAYFASININ basligi olarak kullaniliyor.
          */}
          <SectionIndex index="02" title={t.menu.eyebrow} titleId="menu-title">
            <ul>
              {items.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <Reveal as="li" key={item.id} delay={index * 0.06}>
                    {/*
                      Dar ekranda IKI kolon: soldaki dar serit sadece sira
                      numarasi, ad/aciklama/fiyat ikinci kolonda alt alta.
                      Kolon baslangiclari acikca yazili (col-start) — aciklama
                      ya da fiyat girilmediginde kalan hucreler kaymasin diye.
                    */}
                    <div className="grid grid-cols-[32px_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-[22px] lg:grid-cols-[36px_minmax(0,1fr)_300px_90px]">
                      <span className={rowNumber} aria-hidden="true">
                        {number}
                      </span>

                      {/*
                        break-words: ad kolonu minmax(0,1fr) oldugu icin track
                        daralabiliyor, ama BOSLUKSUZ uzun bir urun adi kendi
                        hucresinden tasip genis ekranda fiyatin uzerine
                        binerdi, dar ekranda sayfayi yana kaydirirdi.
                      */}
                      <p className="brand-display text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.2] tracking-[-0.02em] break-words">
                        {item.name}
                      </p>

                      {item.description ? (
                        <p className="col-start-2 text-[13.5px] leading-[1.6] text-pretty text-[var(--brand-ink-muted)] lg:col-start-3">
                          {item.description}
                        </p>
                      ) : null}

                      {item.price ? (
                        <p
                          className="bo-mono col-start-2 text-[14px] tabular-nums lg:col-start-4 lg:text-end"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </ul>

            {/*
              Tasarimda listenin altinda mono bir kunye satiri var; onun yerini
              artik menu sayfasina giden baglanti aliyor. Bicim temanin birincil
              eylem bicimi: alt cizgili metin + ok (hero'daki adres baglantisi,
              iletisimdeki harita baglantisi ile ayni). Tasarimda dolgulu buton
              hic yok.
            */}
            <Reveal delay={0.24}>
              <div className="mt-[26px] flex items-baseline justify-between gap-6">
                <Link
                  href={menuHref(content)}
                  className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[14px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                >
                  <span>{t.menu.viewAll}</span>
                  <ArrowIcon className="size-3.5" />
                </Link>

                {/* Sayfada ne bekledigini soyleyen kucuk mono not. */}
                <p className={`${meta} brand-eyebrow hidden text-end sm:block`}>
                  {t.menu.pageIntro}
                </p>
              </div>
            </Reveal>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
