import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  Sheet,
  SheetHead,
  edgeTop,
  hair,
  label,
  shell,
  tableHead,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat cetveli: tek pafta icinde kategori seritleri vurgu renginde zemin,
 * urunler ince cizgilerle ayrilmis satirlar, fiyatlar sagda hizali rakamlar.
 *
 * Urun gorseli YOK: bu tasarim teknik bir liste; panelden yuklenen urun
 * gorselleri bu temada gosterilmez.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <Sheet>
          <Reveal>
            <SheetHead
              code="02"
              eyebrow={t.menu.eyebrow}
              title={t.menu.title}
              titleId="menu-title"
            />
          </Reveal>

          <Reveal delay={0.08}>
            {categories.map((category, index) => (
              <div key={category.id} style={index > 0 ? edgeTop : undefined}>
                <h3
                  className={`${tableHead} bg-[var(--brand-accent)] px-4 py-3 text-[var(--brand-primary-contrast)] sm:px-[18px]`}
                >
                  {category.name}
                </h3>

                <ul>
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className={`${hair} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-[15px] sm:px-[18px]`}
                    >
                      <div className="min-w-0 flex-1">
                        {/* Tasarimda urun adi da Anton: liste bir cetvel gibi okunuyor. */}
                        <p className="brand-display text-[var(--ts-item)] leading-[1.25] tracking-[0.01em] uppercase">
                          {item.name}
                          {item.isFeatured ? (
                            <span
                              className={`${label} ms-3 align-middle text-[var(--brand-primary)]`}
                            >
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>

                        {item.description ? (
                          <p className="mt-1 text-[var(--ts-body-sm)] leading-[var(--ts-body-sm-leading)] font-light text-pretty text-[var(--brand-ink-muted)]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      {item.price ? (
                        <p
                          className="text-[var(--ts-body)] font-medium tabular-nums"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </Sheet>
      </div>
    </section>
  );
}
