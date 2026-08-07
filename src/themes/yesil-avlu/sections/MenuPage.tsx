import Link from "next/link";

import { ImageZoom } from "@/components/site/ImageZoom";
import { fill } from "@/i18n";
import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import { Sprig, bodyText, sectionEyebrow } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * TAM menu — kendi sayfasinin govdesi (/tr/menu).
 *
 * ZEMIN: tasarimda menu koyu bir serit (.ya-grove). Sayfanin TAMAMI o serit;
 * boylece ana sayfadaki vitrinden buraya gecis kesintisiz duruyor ve menu
 * sitenin geri kalanindan ayri bir "yer" gibi okunuyor.
 *
 * KAP: liste artik bu koyu zemine kenardan kenara akmiyor, koyu korunun
 * uzerine BIRAKILMIS krem bir MENU KARTI'nin (.ya-leaflet) icinde duruyor.
 * Nedeni okunurluk: 2200px genisliginde akan bir satirda goz urun adindan
 * fiyatina varamiyordu. Kart 1040px'te duruyor — uzun bir urun adi, aciklamasi
 * ve fiyatinin bir arada okundugu aralik. Kartin ust kenari temanin kemeri,
 * icinde tasarimin kutularindaki ince passe-partout cizgisi var; boylece kap
 * jenerik bir "beyaz kart" degil, bu avlunun menu karti.
 *
 * Baslik blogu kartin ICINDE, kemerin altinda: kemer boylece bos bir kubbe
 * degil, basligi tasiyan tabela oluyor.
 *
 * DUZEN: kategoriler alt alta tam genislikte BLOK; urunler blogun icinde iki
 * kolona akiyor (columns, izgara degil): komsu kolonlarin satirlari birbirine
 * kilitlenmiyor, uzun ve kisa aciklamalar kolonlarda bosluk birakmiyor. Kart
 * 1040px oldugu icin iki kolon ancak lg'de aciliyor; altinda tek kolonluk
 * kitapcik sayfasi kaliyor.
 *
 * Kategori basligi YAPISKAN: 30+ urunluk bir listede kaydirirken hangi
 * kategoride oldugunuz gorunur kalmali. Zemini --brand-surface (kart icinde bu
 * krem kagit) oldugu icin altindan gecen satirlar okunmuyor.
 *
 * Cizgi YOK: bu tasarimda urunleri ayiran sey bosluk; tek ince cizgi kategori
 * basliginin altinda ve sayfayi kapatan satirin ustunde.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  return (
    <section aria-labelledby="menu-page-title" className="ya-grove">
      {/*
        Zemin seridi. Yan bosluk 390px'te 14px'e kadar iner (kart tam genisligi
        kullanmali), genis ekranda kart kendi 1040px'inde kalir ve iki yanda
        koru zemini gorunur. Ust/alt bosluk kartin "birakilmis" durmasini
        saglayacak kadar ferah.
      */}
      <div className="px-3.5 py-12 sm:px-8 sm:py-20 lg:py-28">
        <div className="ya-leaflet mx-auto w-full max-w-[65rem] px-6 pt-14 pb-12 sm:px-12 sm:pt-24 sm:pb-16 lg:px-16">
          {/*
            Baslik blogu SectionHeading'in ayni ritmi, ama h2 degil h1: bu bir
            bolum degil sayfa ve sayfanin tek birinci duzey basligi bu.
            Kemerin altinda kaldigi icin ortali.
          */}
          <div className="text-center">
            <p className={sectionEyebrow}>{t.menu.eyebrow}</p>

            <h1
              id="menu-page-title"
              /*
                Olcek ana sayfadakinden bir tik kucuk: baslik artik 1040px'lik
                bir kagidin icinde, sayfa genisliginde degil.
              */
              className="brand-display mx-auto mt-4 max-w-2xl text-[clamp(2.2rem,5.5vw,3.75rem)] leading-[1.1] tracking-[-0.01em] text-balance"
            >
              {t.menu.title}
            </h1>

            <p className={`${bodyText} mx-auto mt-6 max-w-xl`}>
              {t.menu.pageIntro}
            </p>

            <Sprig className="mt-8" />
          </div>

          {/*
            Sayfa ici capa listesi: tasarimin ust serit navigasyonuyla ayni
            recete (.ya-nav, 30px yatay bosluk). flex-wrap sayesinde dar ekranda
            alt satira sarar. Tek kategori varken gezinilecek bir sey olmadigi
            icin basilmaz.
          */}
          {categories.length > 1 ? (
            <nav
              aria-label={t.menu.eyebrow}
              className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 sm:gap-x-[1.875rem]"
            >
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#menu-kategori-${category.id}`}
                  /* Hover rengi tema genelinde tanimli (tokens.css). */
                  className="ya-nav brand-body text-[var(--brand-ink-muted)] transition-colors"
                >
                  <Latin>{category.name}</Latin>
                </a>
              ))}
            </nav>
          ) : null}

          <div className="mt-14">
            {categories.map((category) => {
              /* Fotograf sutunu kategori bazinda acilir. */
              const withImages = anyItemHasImage(content, category.items);

              return (
              <section
                key={category.id}
                id={`menu-kategori-${category.id}`}
                aria-labelledby={`menu-kategori-${category.id}-title`}
                /* Capa ile gelindiginde baslik ekranin tam tepesine yapismasin. */
                className="scroll-mt-6 pt-12 first:pt-0 sm:pt-14"
              >
                {/*
                  Yapiskan baslik Reveal'in DISINDA: Reveal bir transform
                  uyguluyor ve transform, position:sticky icin yeni bir
                  kapsayici blok yaratip yapiskanligi iptal ederdi.
                */}
                <h2
                  id={`menu-kategori-${category.id}-title`}
                  className="brand-display ya-serif-book sticky top-0 z-10 border-b border-[var(--brand-border)] bg-[var(--brand-surface)] pt-5 pb-3.5 text-[1.625rem] italic sm:text-[1.75rem]"
                >
                  <Latin>{category.name}</Latin>
                </h2>

                <Reveal>
                  {/*
                    columns: urunler once soldaki kolonu doldurup saga geciyor.
                    Izgara yerine bunun secilmesinin nedeni ustte anlatildi.
                    Ikinci kolon ancak lg'de acilir: 1040px'lik kagidin altinda
                    iki kolon urun adi ile fiyat arasinda yeterli acikligi
                    birakmiyordu.
                  */}
                  <ul className="mt-2 lg:columns-2 lg:gap-x-14">
                    {category.items.map((item) => (
                      /* Tasarimdaki satir ritmi: 13px alt-ust. */
                      <li
                        key={item.id}
                        className="break-inside-avoid py-[0.8125rem]"
                      >
                        <div
                          className={
                            withImages ? "flex items-start gap-4" : ""
                          }
                        >
                          {withImages ? (
                            /* Sayfada tek tek kart basmak yerine kucuk kare:
                               columns-2 ile akan uzun listede buyuk gorseller
                               kolonlari kirardi. Yuvarlatma temanin token'i. */
                            <span
                              className={`relative block size-14 shrink-0 overflow-hidden rounded-[var(--brand-radius)] sm:size-16 ${itemThumb(content, item) ? "bg-[var(--brand-surface-alt)]" : ""}`}
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
                                  sizes="64px"
                                />
                              ) : null}
                            </span>
                          ) : null}

                          <div className="min-w-0 flex-1">
                        {/*
                          flex-wrap + min-w-0: uzun urun adi fiyatin uzerine
                          binmez, sigmayinca fiyat alt satira duser.
                        */}
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                          <h3 className="brand-body min-w-0 text-[0.9375rem] font-light">
                            <Latin>{item.name}</Latin>
                            {item.isFeatured ? (
                              <span className="brand-body brand-eyebrow ms-3 text-[0.6rem] text-[var(--brand-accent)]">
                                {t.menu.featured}
                              </span>
                            ) : null}
                          </h3>

                          {item.price ? (
                            <p
                              className="shrink-0 text-[0.9375rem] font-light tabular-nums text-[var(--brand-accent)]"
                              dir="ltr"
                            >
                              {item.price}
                            </p>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-muted)]">
                            {item.description}
                          </p>
                        ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </section>
              );
            })}
          </div>

          {/*
            Ana sayfaya donus. Tasarimin kapanis satiri tam olarak bu: ustte
            ince cizgi, altinda ortalanmis italik serif 19px ve SOLUK bir
            isletme adi. Kagidin icinde kaliyor ki kart kendi kendini kapatsin.
            Sozlukte "ana sayfaya don" anahtari olmadigi icin metin isletme adi;
            hover'da accent'e donmesi (tokens.css) tiklanabilirligini gosteriyor.
          */}
          <div className="mt-16 border-t border-[var(--brand-border)] pt-7 text-center">
            <Link
              href={`/${content.locale}`}
              className="brand-display ya-serif-book text-[1.1875rem] text-[var(--brand-ink-muted)] italic transition-colors"
            >
              {content.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
