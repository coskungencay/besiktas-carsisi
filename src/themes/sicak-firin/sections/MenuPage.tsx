import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  SQUARE_FALLBACK,
  hasMenu,
  imageOrFallback,
  menuWithItems,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  chip,
  dashedRow,
  leaderLine,
  metaText,
  pillGhost,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * TAM MENU SAYFASI — /{dil}/menu.
 *
 * Ana sayfadaki bolum artik yalnizca vitrin (uc urun + baglanti); butun
 * kategoriler ve fiyatlar burada. Tasarim dili AYNI: kart yok, satirlar
 * dogrudan krem zeminde akiyor, aralarinda kesik cizgi, ad ile fiyat arasinda
 * noktali kilavuz, fiyat slab fontla marka renginde.
 *
 * SAYFA ILE BOLUMUN FARKI uc yerde:
 *  1. Ust bosluk daha genis (48/80px) — ustunde hero yok, baslik dogrudan
 *     seridin altina yapismasin.
 *  2. Baslik bir kademe buyuk (SectionHead "lg" = 46px): burada bu metin
 *     sayfanin adi, bir bolumun etiketi degil.
 *  3. Kategoriler arasi gezinme seridi var — otuz urunluk bir listede
 *     "kahveler nerede" sorusunun cevabi tek tiklik olmali. Serit tasarimin
 *     hap rozet dilini kullaniyor (hero'daki chip ile ayni bicim).
 *
 * Sayfanin sonunda ana sayfaya donus var; menu sayfasi cikmaz sokak olmamali.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t, name, locale } = content;
  const categories = menuWithItems(content);
  const [leftColumn, rightColumn] = splitColumns(categories);

  // Tek kategoride gezinme seridi gereksiz: liste zaten tek parca.
  const showJumpLinks = categories.length > 1;

  /*
   * Sag kolon yalnizca tek kategorili menude bos kalir (splitColumns ikinci
   * kategoriyi her zaman saga tasir). O durumda iki kolonlu izgarayi kurmak
   * 2200px'lik kabin SAG YARISINI bombos birakiyordu. Tek kolona dusup
   * genisligi iki kolonlu duzendeki bir kolonun olcusune sabitliyoruz: satir
   * ritmi, noktali kilavuzun uzunlugu ve fiyat hizasi kategori sayisindan
   * bagimsiz olarak ayni kaliyor.
   */
  const twoColumns = rightColumn.length > 0;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      {/*
        Ust bosluk bolum ritminden (44/52px) BILEREK genis: sayfanin ustunde
        hero yok, baslik ince ust seridin hemen altina yapisinca sayfa
        kesilmis gibi basliyordu. Alt bosluk ise bolum ritmiyle ayni kalir —
        altta footer var.
      */}
      <div
        className={`${shell} pt-12 pb-[var(--brand-section-py)] sm:pt-20 sm:pb-[var(--brand-section-py-lg)]`}
      >
        <SectionHead
          eyebrow={t.menu.eyebrow}
          title={t.menu.title}
          titleId="menu-page-title"
          intro={t.menu.pageIntro}
          size="lg"
          as="h1"
        />

        {showJumpLinks ? (
          // Sayfa ici capa listesi. <nav> cunku bu bir gezinme araci, susleme
          // degil; ekran okuyucu listeyi baslik olarak duyurabilsin.
          <nav aria-label={t.menu.eyebrow} className="mt-8">
            <ul className="flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#kategori-${category.id}`}
                    className={`${chip} transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]`}
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/*
          Iki BAGIMSIZ yigin; grid hucresi degil. Kategorileri tek izgaraya
          sirayla dizmek tek sayilarda sag kolonu yarim birakiyordu (bkz.
          splitColumns). Dar ekranda tek kolona iner.
        */}
        <div
          className={`mt-12 grid gap-12 ${
            twoColumns ? "lg:grid-cols-2 lg:gap-16" : "max-w-[64rem]"
          }`}
        >
          {[leftColumn, rightColumn].map((column, columnIndex) =>
            column.length > 0 ? (
              <div key={columnIndex} className="flex flex-col gap-12">
                {column.map((category, index) => (
                  <Reveal
                    key={category.id}
                    delay={columnIndex === 0 && index === 0 ? 0 : 0.06}
                  >
                    {/* scroll-mt: capadan gelindiginde baslik ekranin en ust
                        kenarina yapismasin. */}
                    <h2
                      id={`kategori-${category.id}`}
                      className="brand-display scroll-mt-8 text-[length:var(--brand-h4)] leading-[var(--brand-h4-leading)] tracking-[var(--brand-h3-tracking)]"
                    >
                      {category.name}
                    </h2>

                    <ul className="mt-6 flex flex-col">
                      {category.items.map((item) => (
                        <li
                          key={item.id}
                          className={`${dashedRow} flex items-start gap-4 py-4`}
                        >
                          {item.thumbUrl ? (
                            <Image
                              src={imageOrFallback(item.thumbUrl, SQUARE_FALLBACK)}
                              alt={item.name}
                              width={64}
                              height={64}
                              loading="lazy"
                              className="brand-rounded size-16 shrink-0 bg-[var(--brand-surface-alt)] object-cover"
                            />
                          ) : null}

                          {/* min-w-0: uzun urun adi kolonu tasirip fiyati
                              disari itmesin (390px'te kritik). */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-3">
                              <p className="min-w-0 text-[length:var(--brand-lead)]">
                                {item.name}
                                {item.isFeatured ? (
                                  <span
                                    className={`${metaText} ms-3 whitespace-nowrap`}
                                  >
                                    {t.menu.featured}
                                  </span>
                                ) : null}
                              </p>

                              <span aria-hidden="true" className={leaderLine} />

                              {item.price ? (
                                <p
                                  className="brand-display shrink-0 text-[length:var(--brand-lead)] font-semibold tabular-nums text-[var(--brand-primary)]"
                                  dir="ltr"
                                >
                                  {item.price}
                                </p>
                              ) : null}
                            </div>

                            {/* Aciklama sayfada TAM basilir; kirpma yalnizca
                                ana sayfadaki vitrinde var. */}
                            {item.description ? (
                              <p className="mt-1.5 text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-muted)]">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            ) : null,
          )}
        </div>

        {/*
          Donus. Sozlukte "ana sayfa" anahtari yok; tasarimin ust seridinde de
          marka adi zaten eve goturen baglanti, o yuzden burada da isletme adi
          kullaniliyor. Ustundeki kesik cizgi temanin tek ayrac turu.

          Ok BASTA ve 180 derece donuk: ileri degil geri gidiyoruz. RTL'de
          ikonun kendi -scale-x kurali ile birleserek dogru yone bakar.
        */}
        <div className="mt-14 border-t border-dashed border-[var(--brand-hairline)] pt-8">
          <Link href={`/${locale}`} className={pillGhost}>
            <ArrowIcon className="size-4 rotate-180" />
            <span>{name}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Kategorileri iki kolona URUN SAYISINA gore bolusturur.
 *
 * NEDEN elle: `grid-cols-2` kategorileri sirayla dizer, yani uc kategoride sag
 * kolon yarim kalir ve sayfanin altinda kocaman bir bosluk olusur. Burada
 * kategorinin ORTASI hala ilk yariya dusuyorsa sol kolonda kaliyor; boylece iki
 * yigin yaklasik ayni yukseklikte bitiyor.
 *
 * Sira KORUNUR: bir kategori saga tasindiktan sonra kalanlar da sagda kalir,
 * yoksa musterinin panelde verdigi siralama bozulurdu.
 */
function splitColumns(categories: MenuCategory[]): [MenuCategory[], MenuCategory[]] {
  const total = categories.reduce((sum, category) => sum + category.items.length, 0);
  const half = total / 2;

  const left: MenuCategory[] = [];
  const right: MenuCategory[] = [];
  let filled = 0;
  let spilled = false;

  for (const category of categories) {
    const fitsLeft = filled + category.items.length / 2 <= half;
    if (!spilled && (left.length === 0 || fitsLeft)) {
      left.push(category);
      filled += category.items.length;
    } else {
      spilled = true;
      right.push(category);
    }
  }

  return [left, right];
}
