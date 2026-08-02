import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  SectionHead,
  label,
  page,
  sectionPad,
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

/**
 * Dergi ilan sayfasi duzeni: kategoriler iki kolona bolunur (tasarimda kolon
 * araligi 72px), her urun tek satirda "ad ......... fiyat" olarak okunur.
 * Noktali cizgi ayri bir <span> olarak esner — basili menulerin leader-dot
 * alistirmasini taklit eder ve fiyati daima satirin sonuna yaslar.
 *
 * Urun gorseli YOK: iki kolonlu bu siki ritim gorselle bozulur.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  const cut = categories.length > 1 ? splitAt(categories) : categories.length;
  const columns = [categories.slice(0, cut), categories.slice(cut)].filter(
    (column) => column.length > 0,
  );

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          >
            {/* Tek kategoride ikinci kolon acilmaz: bos yarim sayfa yerine
                tek kolonda okunur. */}
            <div
              className={`grid gap-x-[4.5rem] gap-y-12 ${
                columns.length > 1 ? "lg:grid-cols-2" : ""
              }`}
            >
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-12">
                  {column.map((category) => (
                    <Reveal
                      key={category.id}
                      delay={columnIndex === 0 ? 0.08 : 0.16}
                    >
                      {/* Kategori adi: tasarimda 23px italik serif, altinda
                          22px bosluk. Agirlik yazmiyor, yani 400 —
                          mera-regular brand-display'in 300'unu geri alir. */}
                      <h3 className="brand-display mera-regular mb-[1.375rem] text-[1.4375rem] italic rtl:not-italic">
                        {category.name}
                      </h3>

                      <ul>
                        {category.items.map((item) => (
                          <li
                            key={item.id}
                            /* Ustune gelince satir isinir (tasarim: marka
                               renginin %5'i). Yatay dolgu YOK — tasarimda da
                               zemin satirin tam genisligini kapliyor. */
                            className="border-b border-[var(--mera-hair-soft)] py-[0.9375rem] transition-colors last:border-0 hover:bg-[var(--mera-row-hover)]"
                          >
                            <div className="flex items-baseline gap-3">
                              <span className="text-base">{item.name}</span>

                              {item.isFeatured ? (
                                <span className={label}>{t.menu.featured}</span>
                              ) : null}

                              {/* Noktali dolgu: yalnizca fiyat varsa anlamli. */}
                              {item.price ? (
                                <>
                                  <span
                                    aria-hidden="true"
                                    className="mb-[5px] min-w-6 flex-1 border-b border-dotted border-[var(--mera-dot)]"
                                  />
                                  <span
                                    className="text-[0.875rem] tabular-nums text-[var(--brand-ink-body)]"
                                    dir="ltr"
                                  >
                                    {item.price}
                                  </span>
                                </>
                              ) : null}
                            </div>

                            {item.description ? (
                              <p className="mt-1.5 max-w-md text-[0.8125rem] leading-[1.6] text-pretty italic text-[var(--brand-ink-faint)] rtl:not-italic">
                                {item.description}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
