import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  SectionIndex,
  meta,
  rowNumber,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi bicimi: her satir "sira no / ad / aciklama / fiyat" seklinde
 * dort kolona oturur (tasarimda 36px · 1fr · 300px · 90px). Urun gorseli YOK —
 * tasarimin sadeligi bunu istiyor; panelden yuklenen urun gorselleri bu temada
 * gosterilmez.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  // Tasarimda urunler bastan sona numarali; numara kategoriye degil listeye ait.
  let counter = 0;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/*
            Baslik olarak uzun cumle degil KISA etiket kullaniliyor: tasarimda
            bu alan 2 kolonluk (~208px) dar bir serit ve metin 11px BUYUK harf.
            "Bugun tezgahta ne var?" orada dort satira bolunup ritmi bozardi.
            Ayrica ust seritteki nav linki de ayni etiketi kullaniyor.
          */}
          <SectionIndex index="02" title={t.menu.eyebrow} titleId="menu-title">
            <div className="flex flex-col gap-12">
              {categories.map((category, categoryIndex) => (
                <div key={category.id}>
                  <Reveal delay={categoryIndex === 0 ? 0 : 0.06}>
                    <h3 className={`${meta} brand-eyebrow`}>{category.name}</h3>
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
                          <div className="grid items-baseline gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-[22px] lg:grid-cols-[36px_minmax(0,1fr)_300px_90px]">
                            <span className={rowNumber} aria-hidden="true">
                              {number}
                            </span>

                            <p className="brand-display text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.2] tracking-[-0.02em]">
                              {item.name}
                              {item.isFeatured ? (
                                <span className={`${meta} brand-eyebrow ms-3`}>
                                  {t.menu.featured}
                                </span>
                              ) : null}
                            </p>

                            {/* Aciklama bos olsa da hucre basilir: dort kolonlu
                                izgarada fiyatin hizasi bozulmasin diye. */}
                            {item.description ? (
                              <p className="text-[13.5px] leading-[1.6] text-pretty text-[var(--brand-ink-muted)]">
                                {item.description}
                              </p>
                            ) : (
                              <span />
                            )}

                            {item.price ? (
                              <p
                                className="bo-mono text-[14px] tabular-nums lg:text-end"
                                dir="ltr"
                              >
                                {item.price}
                              </p>
                            ) : (
                              <span />
                            )}
                          </div>
                        </Reveal>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
