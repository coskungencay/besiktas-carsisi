import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import {
  DoubleRuleDark,
  OrnamentDark,
  PriceRow,
  board,
  buttonGhostDark,
  shell,
} from "@/themes/kirk-yil/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * Kategorileri IKI KOLONA elle dagitir.
 *
 * NEDEN: grid-cols-2 kategorileri sirayla yerlestiriyor; 3+2+2 urunluk uc
 * kategoride sag kolon yarim kaliyor ve tasarimin dengeli iki sutunu
 * bozuluyordu. Burada SATIR sayisina gore boluyoruz (baslik da bir satir),
 * boylece iki kolon yaklasik ayni yukseklikte bitiyor.
 */
function splitIntoColumns(
  categories: MenuCategory[],
): [MenuCategory[], MenuCategory[]] {
  const totalRows = categories.reduce(
    (sum, category) => sum + category.items.length + 1,
    0,
  );

  const left: MenuCategory[] = [];
  const right: MenuCategory[] = [];
  let filled = 0;

  for (const category of categories) {
    const rows = category.items.length + 1;
    if (filled + rows / 2 <= totalRows / 2 || left.length === 0) {
      left.push(category);
      filled += rows;
    } else {
      right.push(category);
    }
  }

  return [left, right];
}

/** Kategori basliginin capa adresi; sayfa ici gezinme listesi buna baglanir. */
function anchorId(category: MenuCategory): string {
  return `menu-kategori-${category.id}`;
}

/**
 * TAM MENU SAYFASI (/tr/menu).
 *
 * DUZEN KARARI: sayfanin TAMAMI koyu. Tasarimda menu zaten sayfanin tek koyu
 * alani — kagit ritmini kesip one cikan bir "fiyat listesi tabelasi". Menu
 * kendi sayfasina tasindiginda o tabela buyuyup sayfanin kendisi oluyor;
 * ustunde acik zeminli serit, altinda acik zeminli kapanis kaliyor, yani
 * tasarimdaki kontrast korunuyor.
 *
 * Ana sayfadaki bolumden FARKI: ustunde hero yok, bu yuzden ust bosluk
 * belirgin sekilde genis (104/140px); kategori sayisi ikiden fazlaysa basliktan
 * hemen sonra sayfa ici capa listesi cikiyor; en altta ana sayfaya donus var.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { name, t } = content;
  const categories = menuWithItems(content);
  const [left, right] = splitIntoColumns(categories);

  /*
   * Tek kategorili menude ikinci kolon bos kalir; 1000px'lik izgaranin sol
   * yarisinda duran bir liste bu tasarimin tam simetrisini bozuyor. O durumda
   * iki kolon hic acilmaz, liste vitrinle ayni dar kolonda ORTALANIR.
   */
  const twoColumns = right.length > 0;

  return (
    <section aria-labelledby="menu-page-title" className={board}>
      <div
        className={`${shell} pt-[104px] pb-[110px] sm:pt-[140px] sm:pb-[128px]`}
      >
        {/*
          Baslik bloku ana sayfadakiyle AYNI: kunye, dev serif baslik, elmas
          ayrac. Sayfa ile bolum arasindaki bag bu tekrarla kuruluyor.
          SectionTitle kullanilmiyor cunku o parca acik zemin icin yazildi.
        */}
        <Reveal>
          <div className="mx-auto max-w-[1000px] text-center">
            <p className="ky-eyebrow text-[var(--brand-accent)]">
              {t.menu.eyebrow}
            </p>

            <h1
              id="menu-page-title"
              className="brand-display ky-h2 mt-3.5 text-balance"
            >
              {t.menu.title}
            </h1>

            <OrnamentDark className="mt-[18px]" />

            {/* Tasarimda menu bandinin altinda italik bir not var; onun yeri. */}
            <p className="ky-note mt-6 text-[var(--brand-surface)]/65">
              {t.menu.pageIntro}
            </p>
          </div>
        </Reveal>

        {/*
          Sayfa ici gezinme yalnizca liste uzadiginda anlamli: iki kategoride
          hepsi zaten ilk ekranda goruluyor ve capa listesi gereksiz gurultu.
        */}
        {categories.length > 2 ? (
          <Reveal delay={0.06}>
            <nav
              aria-label={t.menu.eyebrow}
              className="mx-auto mt-10 max-w-[1000px]"
            >
              <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${anchorId(category)}`}
                      className="ky-strip text-[var(--brand-surface)]/70 underline-offset-[6px] transition-colors hover:text-[var(--brand-accent)] hover:underline"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ) : null}

        {/*
          Iki kolon: tasarimda kategoriler yan yana duruyor (KAHVELER |
          FIRIN & TATLI). 390px'te tek kolona iner (md: esigi), yani uzun
          liste dar ekranda ust uste akar.
        */}
        <div
          className={`mx-auto mt-[60px] grid items-start gap-x-[70px] gap-y-14 ${
            twoColumns ? "max-w-[1000px] md:grid-cols-2" : "max-w-[46rem]"
          }`}
        >
          {[left, right].map((group, groupIndex) =>
            group.length === 0 ? null : (
              <div key={groupIndex} className="flex flex-col gap-14">
                {group.map((category, index) => (
                  <Reveal key={category.id} delay={Math.min(index, 3) * 0.06}>
                    {/*
                      scroll-mt: capadan gelindiginde baslik ekranin en ust
                      kenarina yapismasin, ustunde nefes kalsin.
                    */}
                    <h2
                      id={anchorId(category)}
                      className="ky-eyebrow scroll-mt-8 border-b border-[var(--brand-surface)]/25 pb-3 text-[var(--brand-accent)]"
                    >
                      {category.name}
                    </h2>

                    <ul className="mt-1.5 flex flex-col">
                      {category.items.map((item) => (
                        <PriceRow
                          key={item.id}
                          item={item}
                          featuredLabel={t.menu.featured}
                        />
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            ),
          )}
        </div>

        {/*
          Kapanis: cift cizgi + ana sayfaya donus. Sozlukte "geri don" karsiligi
          yok; isletme adi bu tasarimda zaten tabelanin kendisi, dolayisiyla
          adin uzerine basmak "tabelaya don" demek oluyor.
        */}
        <div className="mx-auto mt-[80px] max-w-[1000px] text-center">
          <DoubleRuleDark />

          <div className="pt-12">
            <Link href={`/${content.locale}`} className={buttonGhostDark}>
              {name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
