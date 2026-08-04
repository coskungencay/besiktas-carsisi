import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
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
  surface,
} from "@/themes/sicak-firin/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * TAM MENU SAYFASI — /{dil}/menu.
 *
 * Ana sayfadaki bolum artik yalnizca vitrin (uc urun + baglanti); butun
 * kategoriler ve fiyatlar burada. Satir dili AYNI: satirlar arasinda kesik
 * cizgi, ad ile fiyat arasinda noktali kilavuz, fiyat slab fontla marka
 * renginde.
 *
 * BURADA TEK BUYUK FARK: liste artik sayfa genisliginde AKMIYOR, elde tutulan
 * bir MENU KARTININ icinde duruyor. 2200px'lik govdede otuz urunluk bir liste
 * okunmuyordu — goz urun adindan fiyata varamiyor, kategoriler birbirine
 * karisiyordu. Kart tasarimin kendi kagit dilinden geliyor (hero'daki not
 * kagidinin buyugu): bal tonunda passe-partout + krem sayfa + ince kenarlik +
 * ayni not golgesi. Yeni bir bicim icat etmiyoruz, var olani buyutuyoruz.
 *
 * NEDEN metin krem sayfada kaliyor (bal zeminde degil): butun ton secimleri
 * (eyebrow bali, aciklamanin ink-muted'i) krem zemine gore kontrast
 * dogrulanmisti; govdeyi bal zemine tasimak bu iki ton icin kontrasti
 * 4.5:1'in altina dusuruyordu. Bal ton bu yuzden yalnizca cerceve.
 *
 * SAYFA ILE BOLUMUN DIGER FARKLARI:
 *  1. Baslik bir kademe buyuk (SectionHead "lg" = 46px): burada bu metin
 *     sayfanin adi, bir bolumun etiketi degil.
 *  2. Kategoriler arasi gezinme seridi var — otuz urunluk bir listede
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
   * kartin SAG YARISINI bombos birakiyordu; tek kolona duseriz.
   *
   * Kartin genisligi de buna bagli: iki kolonlu menude 1040px (iki kolonun
   * yan yana rahat durdugu olcu), tek kolonluda 900px. Tek kolonu 1040px'te
   * birakmak noktali kilavuzu gereksiz uzatiyor, gozu adin sonundan fiyata
   * kadar bos bir sahada yuruttuyordu.
   */
  const twoColumns = rightColumn.length > 0;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      {/*
        Sayfa kenar boslugu. Bolumlerin `shell` kabugu (20/48px) burada
        KULLANILMIYOR: kartin kendi max genisligi zaten var, ustune bir de
        48px kenar boslugu koymak 390px'te karti gereksiz daraltiyordu.
        Mobilde 16px birakilir, karti neredeyse ekran genisliginde tutar.

        Ust bosluk bolum ritminden (44/52px) BILEREK genis: sayfanin ustunde
        hero yok, kart ince ust seridin hemen altina yapisinca sayfa kesilmis
        gibi basliyordu.
      */}
      <div className="px-4 pt-10 pb-[var(--brand-section-py)] sm:px-6 sm:pt-16 sm:pb-[var(--brand-section-py-lg)]">
        <div
          className={`mx-auto w-full ${twoColumns ? "max-w-[65rem]" : "max-w-[56.25rem]"}`}
        >
          {/*
            PASSE-PARTOUT: bal tonunda ince bir cerceve, icinde krem sayfa.
            Golge hero'daki not kagidinin golgesiyle AYNI token — kart sayfadan
            bir tik yukarida, elde tutulan bir sey gibi dursun. Mobilde cerceve
            6px'e iner (10px kenar payi 358px'lik bir kartta kalinlik yapiyor).
          */}
          <div className="rounded-[var(--brand-radius-panel)] bg-[var(--brand-surface-alt)] p-1.5 shadow-[var(--brand-note-shadow)] sm:p-2.5">
            {/* Kagit. Ince kenarlik yine not kagidindan: bal cerceve ile krem
                sayfanin arasindaki gecisi keskinlestiriyor. */}
            <div className="brand-rounded border border-[var(--brand-hairline-soft)] bg-[var(--brand-surface)] px-5 py-9 sm:px-10 sm:py-12 lg:px-14">
              <SectionHead
                eyebrow={t.menu.eyebrow}
                title={t.menu.title}
                titleId="menu-page-title"
                intro={t.menu.pageIntro}
                size="lg"
                as="h1"
              />

              {showJumpLinks ? (
                // Sayfa ici capa listesi. <nav> cunku bu bir gezinme araci,
                // susleme degil; ekran okuyucu listeyi baslik olarak
                // duyurabilsin. flex-wrap: dar ekranda alt alta sarar,
                // yatay kaydirma cubugu birakmaz.
                <nav aria-label={t.menu.eyebrow} className="mt-8">
                  <ul className="flex flex-wrap gap-2.5">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <a
                          href={`#kategori-${category.id}`}
                          className={`${chip} transition-colors hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]`}
                        >
                          <Latin>{category.name}</Latin>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              {/*
                Kunye ile listeyi ayiran kesik cizgi — basili menu kartinda
                baslik bloguyla urunlerin arasindaki ayrac. Tasarimin tek
                cizgi turu.

                Icinde: iki BAGIMSIZ yigin; grid hucresi degil. Kategorileri
                tek izgaraya sirayla dizmek tek sayilarda sag kolonu yarim
                birakiyordu (bkz. splitColumns). Dar ekranda tek kolona iner.
              */}
              <div
                className={`mt-10 grid gap-12 border-t border-dashed border-[var(--brand-hairline)] pt-10 ${
                  twoColumns ? "lg:grid-cols-2 lg:gap-12" : ""
                }`}
              >
                {[leftColumn, rightColumn].map((column, columnIndex) =>
                  column.length > 0 ? (
                    <div key={columnIndex} className="flex flex-col gap-12">
                      {column.map((category, index) => {
                        /* Fotograf sutunu kategori bazinda acilir. */
                        const withImages = anyItemHasImage(
                          content,
                          category.items,
                        );

                        return (
                        <Reveal
                          key={category.id}
                          delay={columnIndex === 0 && index === 0 ? 0 : 0.06}
                        >
                          {/* scroll-mt: capadan gelindiginde baslik ekranin en
                              ust kenarina yapismasin. */}
                          <h2
                            id={`kategori-${category.id}`}
                            className="brand-display scroll-mt-8 text-[length:var(--brand-h4)] leading-[var(--brand-h4-leading)] tracking-[var(--brand-h3-tracking)]"
                          >
                            <Latin>{category.name}</Latin>
                          </h2>

                          <ul className="mt-6 flex flex-col">
                            {category.items.map((item) => (
                              <li
                                key={item.id}
                                className={`${dashedRow} flex items-start gap-4 py-4`}
                              >
                                {withImages ? (
                                  <span
                                    className={`brand-rounded relative block size-14 shrink-0 overflow-hidden sm:size-16 ${itemThumb(content, item) ? "bg-[var(--brand-surface-alt)]" : ""}`}
                                  >
                                    {itemThumb(content, item) ? (
                                      <Image
                                        src={itemThumb(content, item) as string}
                                        alt=""
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                      />
                                    ) : null}
                                  </span>
                                ) : null}

                                {/* min-w-0: uzun urun adi kolonu tasirip fiyati
                                    disari itmesin (390px'te kritik). */}
                                <div className="min-w-0 flex-1">
                                  {/*
                                    flex-wrap: dar kartta cok uzun bir urun adi
                                    fiyati sikistirmak yerine fiyati alt satira
                                    indirir — ad ile fiyat ust uste binmez.
                                  */}
                                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                    <p className="min-w-0 text-[length:var(--brand-lead)]">
                                      <Latin>{item.name}</Latin>
                                      {item.isFeatured ? (
                                        <span
                                          className={`${metaText} ms-3 whitespace-nowrap`}
                                        >
                                          {t.menu.featured}
                                        </span>
                                      ) : null}
                                    </p>

                                    <span
                                      aria-hidden="true"
                                      className={leaderLine}
                                    />

                                    {item.price ? (
                                      <p
                                        className="brand-display ms-auto shrink-0 text-[length:var(--brand-lead)] font-semibold tabular-nums text-[var(--brand-primary)]"
                                        dir="ltr"
                                      >
                                        {item.price}
                                      </p>
                                    ) : null}
                                  </div>

                                  {/* Aciklama sayfada TAM basilir; kirpma
                                      yalnizca ana sayfadaki vitrinde var. */}
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
                        );
                      })}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </div>

          {/*
            Donus. Sozlukte "ana sayfa" anahtari yok; tasarimin ust seridinde
            de marka adi zaten eve goturen baglanti, o yuzden burada da isletme
            adi kullaniliyor.

            Kartin DISINDA ve ustunde AYRAC YOK: kartin kendi kenari sayfayi
            zaten kapatiyor (kunye seridindeki ile ayni ilke), araya bir kesik
            cizgi daha koymak kapanisa ikinci bir kat cikariyordu. Baglanti
            kartla ayni kolonda, yani onun bas kenarina hizali.

            Ok BASTA ve 180 derece donuk: ileri degil geri gidiyoruz. RTL'de
            ikonun kendi -scale-x kurali ile birleserek dogru yone bakar.
          */}
          <div className="mt-8">
            <Link href={`/${locale}`} className={pillGhost}>
              <ArrowIcon className="size-4 rotate-180" />
              <span>{name}</span>
            </Link>
          </div>
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
