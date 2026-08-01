import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionIndex, meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi bicimi: kategori adi monospace kunye, urunler ince cizgilerle
 * ayrilmis satirlar. Urun gorseli YOK — tasarimin sadeligi bunu istiyor;
 * panelden yuklenen urun gorselleri bu temada gosterilmez.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} brand-section border-t border-[var(--brand-border)]`}>
        <Reveal>
          <SectionIndex index="02" title={t.menu.title} titleId="menu-title" />
        </Reveal>

        <div className="mt-12 flex flex-col gap-14">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                <h3 className={`${meta} brand-eyebrow lg:col-span-2`}>
                  {category.name}
                </h3>

                <ul className="lg:col-span-10">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-[var(--brand-border)] py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-base">
                          {item.name}
                          {item.isFeatured ? (
                            <span className={`${meta} brand-eyebrow ms-3`}>
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>
                        {item.description ? (
                          <p className="mt-1 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      {item.price ? (
                        <p className="brand-body text-sm tabular-nums" dir="ltr">
                          {item.price}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
