import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Hairline,
  MenuLine,
  cta,
  labelAccent,
  labelBase,
  labelFaint,
  link,
  page,
  ruled,
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
 * TAM MENU SAYFASI (/tr/menu) — derginin ortasindaki katlanir menu formasi.
 *
 * Ana sayfadaki bolumle AYNI dili konusur (iki kolon, italik serif kategori
 * adi, "ad ......... fiyat" satirlari), yalnizca daha genis nefes alir:
 *
 *  - Ustunde hero YOK, bu yuzden sayfa girisi bolum boslugundan (120px) daha
 *    genis (144px) ve baslik bolum basligindan bir kademe buyuk — sayfanin
 *    tipografik agirligini tasiyan tek oge o.
 *  - Kategorilerin ustune "icindekiler" seridi konuyor: uzun bir menude
 *    ziyaretci once neyin var oldugunu gormek, sonra ilgili yere atlamak
 *    istiyor. Numaralar hero'daki "Fig. 01" levha isaretiyle ayni dilde.
 *  - Aciklama ve fiyat burada TAM gosterilir; kisaltma yok, sayfanin isi bu.
 *
 * Sayfa, ana sayfaya donen bir kunye baglantisiyla kapanir.
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

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={surface}>
      <div className={`${page} pt-20 pb-[4.5rem] lg:pt-36 lg:pb-[7.5rem]`}>
        {/* Sayfa kunyesi: tasarimin bolum izgarasi (220px kunye kolonu +
            govde), ama basligi bir kademe buyuk. */}
        <div
          className={`${ruled} grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16`}
        >
          <div>
            <p className={`${labelAccent} mera-wide`}>{t.menu.eyebrow}</p>

            {/* Tasarimda kunye kolonunun altindaki kucuk not (13px / 1.6,
                en soluk ton): burada menunun ne oldugunu soyler. */}
            <p className="mt-5 text-[0.8125rem] leading-[1.6] text-pretty text-[var(--brand-ink-faint)]">
              {t.menu.pageIntro}
            </p>
          </div>

          <div className="min-w-0">
            <h1
              id="menu-page-title"
              className="brand-display max-w-[900px] text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.12] tracking-[-0.02em] text-pretty"
            >
              {t.menu.title}
            </h1>

            {/* Icindekiler: tek kategoride anlamsiz — sayfanin tamami zaten o
                kategori, capa listesi kendine isaret eden bir satir olurdu. */}
            {categories.length > 1 ? (
              <nav
                aria-label={t.menu.eyebrow}
                className="mt-[1.875rem] border-t border-[var(--mera-hair)] pt-5"
              >
                <ul className="flex flex-wrap gap-x-9 gap-y-3">
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
                        <span className="underline-offset-[6px] hover:underline">
                          {category.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        {/* Menunun kendisi kunye kolonunun ALTINDAN degil, sayfanin tamamindan
            baslar: 30+ urunlu bir liste 220px'lik kolonun sagina sikistirilinca
            satirlar daraliyor ve noktali dolgu icin yer kalmiyordu. */}
        <div
          className={`mt-14 grid gap-x-[5.5rem] gap-y-14 lg:mt-20 ${
            /* Tek kategoride ikinci kolon acilmaz. Ama o zaman liste sayfanin
               tamamini (genis ekranda 2000px+) kaplardi: "ad ......... fiyat"
               satirinin noktali dolgusu bir metreye uzar, goz adin sonundan
               fiyata varamaz. Bu yuzden temanin govde olcusune (900px, bkz.
               parts.tsx) sabitlenir — iki kolonda zaten her kolon o civarda. */
            columns.length > 1 ? "lg:grid-cols-2" : "max-w-[900px]"
          }`}
        >
          {columns.map((column, columnIndex) => {
            /* Levha numaralari kolonlar arasinda sifirlanmaz: sag kolon
               kesim noktasindan devam eder, boylece icindekiler seridindeki
               numara ile kategori basligindaki numara ayni kalir. */
            const start = columnIndex === 0 ? 0 : cut;

            return (
              <div key={columnIndex} className="flex flex-col gap-14">
                {column.map((category, index) => (
                  <Reveal
                    key={category.id}
                    delay={columnIndex === 0 ? 0.06 : 0.12}
                  >
                    {/* scroll-mt: capadan gelindiginde kategori adi ekranin
                        en ust kenarina yapismasin. */}
                    <div id={`menu-${category.id}`} className="scroll-mt-10">
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
                              item.isFeatured ? t.menu.featured : undefined
                            }
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

        {/* Kapanis: dergi formasindan ana sayfaya donus. Sozlukte "ana sayfa"
            anahtari yok; dergi mantiginda dogru metin zaten mekanin ADI —
            okuyucu masthead'e doner. Ok ileri bakar cunku bu bir "geri al"
            degil, "su sayfaya git" baglantisi (tasarimdaki "Yol tarifi al →"
            ile ayni bicim). */}
        <Hairline className="mt-16 mb-8 lg:mt-24" />

        <Link href={`/${content.locale}`} className={cta}>
          <span>{name}</span>
          <ArrowIcon className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
