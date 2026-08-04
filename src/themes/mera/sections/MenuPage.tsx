import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  anyItemHasImage,
  hasMenu,
  itemThumb,
  menuWithItems,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  MenuLine,
  cta,
  labelAccent,
  labelBase,
  labelFaint,
  link,
  surface,
} from "@/themes/mera/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * Kategorileri iki kolona bolme noktasi.
 *
 * NEDEN ELLE: `grid-cols-2` kategorileri SIRAYLA dizer (1 sol, 2 sag, 3 sol…).
 * Tasarimda iki kategori yan yana ve iki kolon da ayni yerde bitiyor; uc
 * kategoride sirayla dizilim sag kolonu yarim birakip sayfayi asagi
 * dogru cekiyordu. Burada kolonlara SATIR SAYISINA gore boluyoruz: her
 * kategori bir baslik + urunleri kadar yer kaplar, boyle bakildiginda iki
 * kolonun boyu birbirine en yakin oldugu yerden kesiyoruz.
 *
 * Sira bozulmaz: sol kolon bastaki kategorileri, sag kolon kalanlari alir.
 */
function splitAt(categories: MenuCategory[]): number {
  // Baslik + 22px bosluk kabaca bir urun satiri kadar yer tutuyor.
  const rows = categories.map((category) => category.items.length + 1);
  const total = rows.reduce((sum, value) => sum + value, 0);

  let best = 1;
  let bestGap = Number.POSITIVE_INFINITY;
  let filled = 0;

  // Son kategoriden once kesilmeli, yoksa sag kolon bos kalir.
  for (let index = 0; index < rows.length - 1; index += 1) {
    filled += rows[index]!;
    const gap = Math.abs(total - 2 * filled);
    if (gap < bestGap) {
      bestGap = gap;
      best = index + 1;
    }
  }
  return best;
}

/** Dergi levha numarasi: 1 -> "01". */
function plate(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * TAM MENU SAYFASI (/tr/menu) — masaya birakilan BASILI MENU KARTI.
 *
 * NEDEN KAP: liste sayfanin tam genisliginde aktiginda (bu temanin container'i
 * 2200px) "ad ......... fiyat" satirinin noktali dolgusu bir metreye uzuyor,
 * goz adin sonundan fiyata varamiyor ve 30+ urunde kategoriler birbirine
 * karisiyordu. Bu yuzden menu, sayfa zemininin (--brand-surface) uzerine
 * konmus AYRI BIR KAGIT olarak duruyor:
 *
 *  - Kagit tonu bir kademe koyu (--brand-surface-alt) — sayfadan ayrilir ama
 *    beyaz jenerik bir kart olmaz, ayni murekkep/kagit ailesinde kalir.
 *  - Cift sac teli cerceve (passe-partout): temanin "kutu yok, sadece cizgi"
 *    kurali burada da gecerli — golge, radius ve dolgu yok, kabin kimligini
 *    yalnizca iki cizgi tasiyor. Radius zaten 0 (bkz. tokens.css).
 *  - Genislik: iki kolonda 1040px, tek kolonda 900px (temanin govde olcusu).
 *    Genis ekranda kagit BUYUMEZ, ortada durur; iki yanda sayfa zemini
 *    gorunur — dergi acilmis gibi.
 *
 * Ic duzen degismedi: dergi levha numaralari, italik serif kategori adlari ve
 * ortak `MenuLine` satirlari ana sayfadaki vitrinle ayni dili konusur.
 *
 * Sayfa, kagidin ALTINDA duran bir kunye baglantisiyla ana sayfaya doner —
 * baglanti kagida ait degil, sayfaya ait.
 */
export default function MenuPage({ content }: SectionProps) {
  // Menu bossa bu sayfanin govdesi de olmamali (route zaten 404 veriyor).
  if (!hasMenu(content)) return null;

  const { t, name } = content;
  const categories = menuWithItems(content);

  const cut = categories.length > 1 ? splitAt(categories) : categories.length;
  const columns = [categories.slice(0, cut), categories.slice(cut)].filter(
    (column) => column.length > 0,
  );
  const twoColumn = columns.length > 1;

  /*
   * Kagidin genisligi. Iki kolonda her kolon ~430px'e duser — basili menude
   * bir urun satirinin rahat okundugu olcu. Tek kategoride ikinci kolon
   * acilmaz, o zaman kagit da daralir: tek kolonluk bir liste 1040px'te
   * yeniden uzun satira donerdi.
   */
  const sheetWidth = twoColumn ? "max-w-[1040px]" : "max-w-[900px]";

  /*
   * Kolon araligi. Sac teli cizgi kolonlarin TAM ORTASINDA dursun diye grid
   * `gap` yerine kolonlarin ic dolgusu kullaniliyor (gap ile cizgi sag kolonun
   * kenarina yapisirdi). Tek kolonda dolgu da cizgi de yok.
   */
  function columnGutter(columnIndex: number): string {
    if (columnIndex > 0) {
      return "lg:border-s lg:border-[var(--mera-hair)] lg:ps-11";
    }
    return twoColumn ? "lg:pe-11" : "";
  }

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      {/*
       * Sayfa marji. Temanin `page` yardimcisi (2200px + 56px marj) burada
       * KULLANILMIYOR: kagidin kendi siniri var, ustune bir de 2200px'lik kap
       * koymak anlamsiz. 390px'de 14px kalir — kagit kenara yapismaz ama
       * ekranin tamamini kullanir.
       */}
      <div className="px-3.5 pt-12 pb-16 sm:px-8 sm:pt-16 lg:px-10 lg:pt-28 lg:pb-28">
        <div className={`mx-auto w-full ${sheetWidth}`}>
          {/* Dis cerceve: kagidin kenari. Ic dolgu = passe-partout araligi,
              dar ekranda 6px'e iner ki cerceve icerigi bogmasin. */}
          <div className="border border-[var(--mera-rule)] bg-[var(--brand-surface-alt)] p-1.5 sm:p-2 lg:p-2.5">
            {/* Ic cerceve + basim alani. Ic bosluk kademeli: 390px'de 18px,
                masaustunde 56px.

                break-words: `overflow-wrap` MIRAS ALINAN bir ozellik, bu yuzden
                tek yerde verilir ve kagidin icindeki her metni kapsar. Gerekce:
                bosluksuz uzun bir ad (Almanca bilesik kelime, hashtag'li bir
                urun adi) 310px'lik mobil kolonda kutusunu asip SAYFAYI yatay
                kaydiriyordu — olculdu: 390px ekranda belge genisligi 529px.
                Kagidin kendisi tasmiyordu, tasan yalniz metnin kendisiydi. */}
            <div className="border border-[var(--mera-hair)] px-[1.125rem] py-9 break-words sm:px-8 sm:py-12 lg:px-14 lg:py-16">
              {/* Kagidin kunyesi: dergide baslik daima baslangic kenarina
                  yaslanir, ortalanmaz. */}
              <header className="border-b border-[var(--mera-rule)] pb-7 lg:pb-9">
                <p className={`${labelAccent} mera-wide`}>{t.menu.eyebrow}</p>

                <h1
                  id="menu-page-title"
                  className="brand-display mt-5 text-[clamp(1.9rem,5.4vw,2.75rem)] leading-[1.16] tracking-[-0.02em] text-pretty"
                >
                  {t.menu.title}
                </h1>

                {/* Tasarimdaki kucuk kunye notu (13px / 1.6, en soluk ton):
                    menunun ne oldugunu soyler. Olcu ile sinirli, yoksa
                    kagidin tamamina yayilip basliktan agir gorunurdu. */}
                <p className="mt-4 max-w-[46ch] text-[0.8125rem] leading-[1.6] text-pretty text-[var(--brand-ink-faint)]">
                  {t.menu.pageIntro}
                </p>
              </header>

              {/* Icindekiler: tek kategoride anlamsiz — sayfanin tamami zaten o
                  kategori, capa listesi kendine isaret eden bir satir olurdu.
                  Dar ekranda sarar; yatay kaydirma yok, cunku sarmis bir kunye
                  seridi basili menude de dogal duruyor. */}
              {categories.length > 1 ? (
                <nav
                  aria-label={t.menu.eyebrow}
                  className="mt-6 border-b border-[var(--mera-hair)] pb-6 lg:mt-7 lg:pb-7"
                >
                  <ul className="flex flex-wrap gap-x-7 gap-y-3 lg:gap-x-9">
                    {categories.map((category, index) => (
                      <li key={category.id}>
                        {/* Alt cizgisi YOK (cta'dan farki bu): sekiz kategorilik
                            bir seritte sekiz alt cizgi, asagidaki tek eylem
                            baglantisini gorunmez kilardi. */}
                        <a
                          href={`#menu-${category.id}`}
                          className={`${labelBase} ${link} mera-caption inline-flex items-baseline gap-3 text-[0.75rem]`}
                        >
                          {/* Levha numarasi metin degil, dergi isareti: her
                              dilde ayni okunur ve ekran okuyucuyu mesgul
                              etmemesi icin gizli. */}
                          <span
                            aria-hidden="true"
                            dir="ltr"
                            className={labelFaint}
                          >
                            {plate(index)}
                          </span>
                          {/* wrap-anywhere: kagidin `break-words` mirasi bir
                              kelimeyi ancak satir tasiyorsa boler, ogenin
                              MIN-CONTENT olcusunu kucultmez. Bu serit
                              inline-flex (genisligi icerigine gore hesaplanir)
                              oldugu icin bosluksuz uzun bir kategori adi
                              seridi mobilde ekranin disina tasiriyordu —
                              olculdu: 390px'de belge 545px. `anywhere`
                              min-content'i de kucultur, tasma biter. */}
                          <span className="underline-offset-[6px] wrap-anywhere hover:underline">
                            {category.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              {/* Kolonlar: dar ekranda alt alta iner (kolon dolgusu ve aradaki
                  cizgi yalnizca lg'de acilir, bkz. columnGutter). */}
              <div
                className={`mt-10 grid gap-y-12 lg:mt-12 ${
                  twoColumn ? "lg:grid-cols-2" : ""
                }`}
              >
                {columns.map((column, columnIndex) => {
                  /* Levha numaralari kolonlar arasinda sifirlanmaz: sag kolon
                     kesim noktasindan devam eder, boylece icindekiler
                     seridindeki numara ile kategori basligindaki numara ayni
                     kalir. */
                  const start = columnIndex === 0 ? 0 : cut;

                  return (
                    <div
                      key={columnIndex}
                      className={`flex min-w-0 flex-col gap-12 ${columnGutter(columnIndex)}`}
                    >
                      {column.map((category, index) => (
                        <Reveal
                          key={category.id}
                          delay={columnIndex === 0 ? 0.06 : 0.12}
                        >
                          {/* scroll-mt: capadan gelindiginde kategori adi
                              ekranin en ust kenarina yapismasin. */}
                          <div
                            id={`menu-${category.id}`}
                            className="scroll-mt-10"
                          >
                            <div className="mb-[1.375rem] flex items-baseline gap-4">
                              <span
                                aria-hidden="true"
                                dir="ltr"
                                className={labelFaint}
                              >
                                {plate(start + index)}
                              </span>

                              {/* Kategori adi: tasarimda 23px italik serif.
                                  Agirlik yazmiyor, yani 400 — mera-regular
                                  brand-display'in 300'unu geri alir. */}
                              <h2 className="brand-display mera-regular min-w-0 text-[1.4375rem] italic rtl:not-italic">
                                {category.name}
                              </h2>
                            </div>

                            <ul>
                              {category.items.map((item) => (
                                <MenuLine
                                  key={item.id}
                                  item={item}
                                  badge={
                                    item.isFeatured
                                      ? t.menu.featured
                                      : undefined
                                  }
                                  thumb={itemThumb(content, item)}
                                  /* Sutun KATEGORI bazinda acilir: tatlilarin
                                     fotografi varken icecekler listesinde bos
                                     kare acmanin anlami yok. */
                                  reserveImage={anyItemHasImage(
                                    content,
                                    category.items,
                                  )}
                                />
                              ))}
                            </ul>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kapanis: kagidin DISINDA, sayfa zemininde duran kunye baglantisi.
              Sozlukte "ana sayfa" anahtari yok; dergi mantiginda dogru metin
              zaten mekanin ADI — okuyucu masthead'e doner. Ok ileri bakar cunku
              bu bir "geri al" degil, "su sayfaya git" baglantisi (tasarimdaki
              "Yol tarifi al →" ile ayni bicim). */}
          <Link href={`/${content.locale}`} className={`${cta} mt-9 lg:mt-11`}>
            <span>{name}</span>
            <ArrowIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
