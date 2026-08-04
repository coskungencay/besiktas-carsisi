import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import {
  ArrowIcon,
  secondaryButtonClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ayri menu sayfasinin govdesi (/tr/menu).
 *
 * NEDEN AYRI: ana sayfadaki "menu" bolumu artik yalnizca 3 urunluk bir vitrin.
 * Tam liste burada, kendi sayfasinda; 30+ urun ana sayfayi okunamaz kiliyordu.
 *
 * NEDEN KITAPCIK KABI: liste 1280px'lik sayfa kolonunda akinca goz urun adindan
 * fiyata varamiyordu. Icerik artik cerceveli, ortalanmis, en fazla 1040px'lik
 * bir "menu karti" icinde duruyor — basili menu metaforu hem satir uzunlugunu
 * okunabilir tutuyor hem de sayfaya kimlik veriyor.
 *
 * NEDEN SADE KAP: bu tema notr; kalin cerceve/desen dilini bozardi. Kap temanin
 * kendi malzemesiyle kuruluyor: ince surface-alt bir paspartu seridi + ustuste
 * iki brand-frame cercevesi. Baska bir sey (golge, desen, ikinci renk) yok.
 *
 * DUZEN: kategori basina blok, urun kartlari ana sayfadaki vitrinin AYNI dilinde
 * (brand-frame kart, gorsel + ad/fiyat ayni satirda, altta aciklama).
 */
export default function MenuPage({ content }: SectionProps) {
  // Menu bossa sayfa zaten 404; yine de bilesen tek basina guvenli olmali.
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  return (
    <section
      id="menu"
      aria-labelledby="menu-page-title"
      className={sectionClass}
    >
      {/*
       * Kenar boslugu tasiyicisi. containerClass (1280px / px-6) yerine dar bir
       * olcu: max-w 1088 - yatay padding = kap en fazla 1040px (paspartu dahil;
       * okuma kolonu ic dolgudan sonra ~900px). 2000px'te de ayni genislikte
       * kalir, buyumez; iki yanda sayfa zemini gorunur.
       * Mobilde px-3 (12px): kap kenara yapismadan tam genisligi kullanir.
       * Ust bosluk: bu sayfada hero yok, baslik tarayici cubuguna yapismasin.
       */}
      <div className="mx-auto w-full max-w-[1088px] px-3 pt-8 pb-14 sm:px-6 sm:pt-16 sm:pb-24">
        {/*
         * KAP: passe-partout (cift cerceve).
         *
         * NEDEN MAT: sayfa zemini de --brand-surface oldugu icin kaba yalnizca
         * 1px kenarlik vermek yetmiyordu — kap sayfadan ayrilmiyor, "dar kolon"
         * gibi duruyordu. Disdaki surface-alt serit gorunur bir zemin farki
         * yaratiyor; kagit, cerceveli bir paspartunun icinde duruyor.
         *
         * NEDEN GOLGE DEGIL: bu temanin dili duz — her yerde kenarlik + dolgu
         * var, hicbir yerde golge yok. Golge yerine ikinci bir cerceve.
         *
         * Mat 390px'te 6px'e iniyor (kalin serit dar ekranda alan yer),
         * lg'de 12px'e cikiyor.
         *
         * Reveal ile sarilmiyor: ic bloklarin kademeli belirmesi korunuyor,
         * yoksa tum kitapcik tek parca halinde fade olurdu.
         */}
        <div className="brand-frame bg-[var(--brand-surface-alt)] p-1.5 sm:p-2.5 lg:p-3">
          <div className="brand-frame bg-[var(--brand-surface)] px-4 py-10 sm:px-8 sm:py-14 lg:px-14 lg:py-16">
            <Reveal>
              {/* Kunye + baslik + ayrac kabin ICINDE: derginin kapak sayfasi gibi. */}
              <header className="border-b border-[var(--brand-border)] pb-8">
                <p className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                  {t.menu.eyebrow}
                </p>
                {/* Sayfanin tek h1'i: bu sayfada hero basligi yok. */}
                <h1
                  id="menu-page-title"
                  className="brand-display mt-4 text-3xl leading-tight text-balance sm:text-4xl"
                >
                  {t.menu.title}
                </h1>
                <p className="mt-5 max-w-prose text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)] sm:text-lg">
                  {t.menu.pageIntro}
                </p>
              </header>
            </Reveal>

            {/*
             * Kategori atlama listesi: uzun menude asagiya kaydirmadan istenen
             * bolume gitmek icin. Tek kategori varsa gereksiz gurultu, gizlenir.
             * flex-wrap: 390px'te capalar alt alta sarar, yatay tasma olmaz.
             */}
            {categories.length > 1 ? (
              <Reveal delay={0.05}>
                <nav aria-label={t.menu.eyebrow} className="mt-8">
                  <ul className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <a
                          href={`#${anchorId(category.id)}`}
                          className="brand-frame inline-flex px-4 py-2 text-sm transition-colors hover:bg-[var(--brand-surface-alt)]"
                        >
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            ) : null}

            <div className="mt-12 flex flex-col gap-14">
              {categories.map((category, ci) => {
                /* Fotograf sutunu kategori bazinda acilir. */
                const withImages = anyItemHasImage(content, category.items);

                return (
                <Reveal
                  as="section"
                  key={category.id}
                  delay={Math.min(ci, 4) * 0.05}
                >
                  {/* scroll-mt: capadan gelindiginde baslik ekranin tepesine yapismasin. */}
                  <h2
                    id={anchorId(category.id)}
                    className="brand-display scroll-mt-8 border-b border-[var(--brand-border)] pb-4 text-2xl sm:text-3xl"
                  >
                    {category.name}
                  </h2>

                  {/*
                   * Iki kolon lg'den itibaren: kap ekrandan dar oldugu icin
                   * md'de (768px) kolon basina ~340px kalir ve gorsel + ad + fiyat
                   * sikisirdi. 1024px'ten sonra kolon basina ~415px duser.
                   * Altinda tek kolon (grid varsayilani) — 390px'te de dogru.
                   */}
                  <ul className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-x-8">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className="brand-frame flex gap-4 bg-[var(--brand-surface-alt)] p-4 transition-colors hover:border-[var(--brand-primary)]"
                      >
                        {withImages ? (
                          <div
                            className={`brand-rounded relative aspect-square w-20 shrink-0 overflow-hidden ${itemThumb(content, item) ? "bg-[var(--brand-surface)]" : ""}`}
                          >
                            {itemThumb(content, item) ? (
                              <Image
                                src={itemThumb(content, item) as string}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                        ) : null}

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          {/*
                           * flex-wrap + gap: uzun urun adi fiyatin uzerine binmez,
                           * dar ekranda fiyat alt satira iner. Ad min-w-0 +
                           * break-words ile kirilir, fiyat shrink-0 ile bolunmez.
                           */}
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h3 className="brand-display min-w-0 text-base leading-snug break-words">
                              {item.name}
                            </h3>
                            {item.price ? (
                              <p className="shrink-0 text-sm font-medium tabular-nums text-[var(--brand-primary)]">
                                {item.price}
                              </p>
                            ) : null}
                          </div>

                          {item.description ? (
                            <p className="text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                              {item.description}
                            </p>
                          ) : null}

                          {item.isFeatured ? (
                            <p className="brand-rounded brand-eyebrow mt-1 inline-flex w-fit items-center bg-[var(--brand-primary)] px-2.5 py-1 text-[11px] text-[var(--brand-primary-contrast)]">
                              {t.menu.featured}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/*
         * Ana sayfaya donus KABIN DISINDA: kitapcik kendi icinde kapaniyor,
         * donus baglantisi sayfaya ait bir eylem olarak altinda duruyor.
         * Menu ayri bir sayfa oldugu icin ziyaretcinin tek cikisi tarayici
         * geri tusu olmamali. Uygun bir sozluk anahtari yok; isletme adi
         * kullaniliyor.
         */}
        <div className="mt-10">
          <Link href={`/${content.locale}`} className={secondaryButtonClass}>
            {/* rotate-180: ok geri yonu gosterir, RTL'de de dogru donuyor. */}
            <span className="inline-flex rotate-180">
              <ArrowIcon />
            </span>
            <span>{content.name}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
