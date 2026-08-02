import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { meta, rowNumber, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tam menu SAYFASI (/tr/menu).
 *
 * Ana sayfadaki bolumden farki: ustunde hero yok, yani sayfanin ilk buyuk
 * tipografisi burada olusuyor. Bu yuzden duzen tasarimin ayni dilini konusur
 * ama daha genis nefes alir:
 *
 *   - ust bosluk bolum ritmi (118px) yerine hero ritmi (150px),
 *   - sol 2 kolonluk serit YAPISKAN: "— 02 / MENU" etiketi ve altinda
 *     kategori capalari; 30+ urunluk listede kullanici nerede oldugunu
 *     kaybetmesin diye (tasarimin sol serit ritmini bozmadan),
 *   - sag 10 kolonda once sayfa basligi (tasarimda iletisim bolumunun 40px
 *     puntosu — hero'nun 60px'i sayfa basligi icin fazla iddiali), sonra
 *     kategori bloklari.
 *
 * Satir bicimi ana sayfadaki tasarimla ayni dort kolon: sira no / ad /
 * aciklama / fiyat. Urun gorseli YOK — tasarimin sadeligi bunu istiyor.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;
  const categories = menuWithItems(content);

  // Tasarimda urunler bastan sona numarali; numara kategoriye degil listeye ait.
  let counter = 0;

  // Tek kategori varsa capa listesi bir ise yaramaz, sadece etiketi tekrar eder.
  const showAnchors = categories.length > 1;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      <div className={`${shell} pt-20 pb-24 sm:pt-[150px] sm:pb-[130px]`}>
        <div className="grid gap-6 border-t border-[var(--brand-border)] pt-[34px] lg:grid-cols-12">
          {/*
            Sol serit. Yapiskanlik yalnizca genis ekranda: dar ekranda kolonlar
            alt alta dustugu icin yapiskan bir blok icerigin ustunde asili
            kalirdi.
          */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-10">
              <div className="bo-index">
                <p aria-hidden="true">— 02</p>
                <p className="brand-eyebrow">{t.menu.eyebrow}</p>
              </div>

              {showAnchors ? (
                <nav aria-label={t.menu.eyebrow} className="mt-8 hidden lg:block">
                  <ul className={`${meta} flex flex-col gap-2`}>
                    {categories.map((category) => (
                      <li key={category.id}>
                        {/*
                          Sayfa ici capa: next/link degil duz <a>. Ayni sayfada
                          kaldigimiz icin yonlendirmeye gerek yok, tarayicinin
                          kendi kaydirmasi yeterli.
                        */}
                        <a
                          href={`#${anchorId(category.id)}`}
                          /* Uzun kategori adi 2 kolonluk dar seritten tasmasin. */
                          className="brand-eyebrow border-b border-transparent pb-[2px] break-words transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-10 lg:col-start-3">
            {/*
              Sayfanin h1'i: bu sayfada baska baslik yok (Header'daki marka bir
              baglanti). Punto tasarimin iletisim bolumuyle ayni olcekte.
            */}
            <h1
              id="menu-page-title"
              className="brand-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.18] tracking-[-0.025em] text-balance"
            >
              {t.menu.title}
            </h1>

            <p className={`${meta} brand-eyebrow mt-5`}>{t.menu.pageIntro}</p>

            <div className="mt-14 flex flex-col gap-14 sm:mt-16 sm:gap-16">
              {categories.map((category, categoryIndex) => (
                <div key={category.id}>
                  <Reveal delay={categoryIndex === 0 ? 0 : 0.06}>
                    {/*
                      scroll-mt: capa ile gelindiginde kategori basligi ekranin
                      en ust pikseline yapismasin.
                    */}
                    <h2
                      id={anchorId(category.id)}
                      className={`${meta} brand-eyebrow scroll-mt-24`}
                    >
                      {category.name}
                    </h2>
                  </Reveal>

                  <ul className="mt-4">
                    {category.items.map((item, itemIndex) => {
                      counter += 1;
                      const number = String(counter).padStart(2, "0");

                      return (
                        <Reveal
                          as="li"
                          key={item.id}
                          delay={Math.min(itemIndex, 4) * 0.06}
                        >
                          {/*
                            Dar ekranda IKI kolon: soldaki dar serit sadece sira
                            numarasi, ad/aciklama/fiyat ikinci kolonda alt alta.
                            Kolon baslangiclari acikca yazili (col-start) —
                            aciklama ya da fiyat girilmediginde kalan hucreler
                            bosluga kaymasin diye.
                          */}
                          <div className="grid grid-cols-[32px_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-6 lg:grid-cols-[36px_minmax(0,1fr)_320px_100px]">
                            <span className={rowNumber} aria-hidden="true">
                              {number}
                            </span>

                            {/*
                              break-words: ad kolonu minmax(0,1fr) oldugu icin
                              track daralabiliyor, ama BOSLUKSUZ uzun bir urun
                              adi (bilesik yazilmis isimler) kendi hucresinden
                              tasip genis ekranda fiyat kolonunun uzerine
                              binerdi, dar ekranda da sayfayi yana kaydirirdi.
                            */}
                            <p className="brand-display text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.2] tracking-[-0.02em] break-words">
                              {item.name}
                              {item.isFeatured ? (
                                <span className={`${meta} brand-eyebrow ms-3`}>
                                  {t.menu.featured}
                                </span>
                              ) : null}
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
                </div>
              ))}
            </div>

            {/*
              Ana sayfaya donus. Tasarimda "buton" diye bir bicim yok; birincil
              eylem hero ve iletisimdeki gibi alt cizgili metin + ok. Ok RTL'de
              kendiliginden donuyor, bu yuzden geri baglantisinda da ayni ikon
              kullanilabiliyor.
            */}
            <div className="mt-16 border-t border-[var(--brand-border)] pt-8">
              <Link
                href={`/${content.locale}`}
                className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
              >
                {/* Uygun sozluk anahtari yok; isletme adi baglantiyi anlatiyor. */}
                <span>{content.name}</span>
                <ArrowIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
