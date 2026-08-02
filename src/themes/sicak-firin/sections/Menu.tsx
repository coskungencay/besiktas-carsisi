import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SQUARE_FALLBACK, imageOrFallback, menuWithItems } from "@/themes/_shared/data";
import {
  SectionHead,
  dashedRow,
  leaderLine,
  metaText,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { MenuCategory, SectionProps } from "@/themes/types";

/**
 * Iki kolon, KART YOK: satirlar dogrudan sayfa zemininde akiyor.
 *
 * Tasarimda menu sayfanin en sade yeri — krem panel de kart da yok, yalnizca
 * baslik ve altinda kesik cizgilerle ayrilmis satirlar. Kategorileri ayri
 * kartlara koymak bolumu kutu koleksiyonuna cevirip tezgah tabelasi hissini
 * siliyordu.
 *
 * Satir ritmi tasarimdan birebir: 16px alt-ust bosluk, aralarinda kesik cizgi,
 * urun adi ile fiyat arasinda NOKTALI kilavuz cizgi. Fiyatlar slab fontla ve
 * marka renginde — sayfadaki tek "kalin" tipografi.
 *
 * Urun adi 400 agirlikta (tasarimda agirlik YAZMIYOR, yani varsayilan);
 * yalnizca aciklama satirlari 300.
 *
 * Urun gorseli VARSA kucuk yuvarlak thumb olarak satirin basinda duruyor.
 * Gorseli olmayan urun satiri thumb'siz akar, bos kare birakmak vitrini
 * seyreltirdi.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;
  const columns = splitColumns(categories);

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
            size="md"
          />
        </Reveal>

        {/*
          Iki BAGIMSIZ yigin; grid hucresi degil. Kategorileri tek bir izgaraya
          sirayla dizmek tek sayilarda sag kolonu yarim birakiyordu (bkz.
          splitColumns).
        */}
        {/* Baslik ile ilk satir arasi tasarimda 24px (h2 margin-bottom). Tailwind
            varsayilani mt-12 (48px) araligi ikiye katlayip bolumun uzerine
            gereksiz bir nefes koyuyordu. */}
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {columns.map((column, columnIndex) =>
            column.length > 0 ? (
              <div key={columnIndex} className="flex flex-col gap-10">
                {column.map((category, index) => (
                  <Reveal
                    key={category.id}
                    delay={columnIndex === 0 && index === 0 ? 0 : 0.06}
                  >
                    <h3 className="brand-display text-[length:var(--brand-h4)] tracking-[var(--brand-h3-tracking)]">
                      {category.name}
                    </h3>

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
      </div>
    </section>
  );
}

/**
 * Kategorileri iki kolona URUN SAYISINA gore bolusturur.
 *
 * NEDEN elle: `grid-cols-2` kategorileri sirayla dizer, yani uc kategoride sag
 * kolon yarim kalir ve bolumun altinda kocaman bir bosluk olusur. Burada
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
