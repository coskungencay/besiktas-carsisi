import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  Sheet,
  SheetHead,
  edgeTop,
  hair,
  mono,
  shell,
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
      <div className={`${shell} pb-6 sm:pb-10`}>
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
                  className={`${mono} bg-[var(--brand-primary)] px-4 py-3 text-[var(--brand-primary-contrast)] sm:px-6`}
                >
                  {category.name}
                </h3>

                <ul>
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className={`${hair} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3.5 sm:px-6`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base">
                          {item.name}
                          {item.isFeatured ? (
                            <span
                              className={`${mono} ms-3 align-middle text-[var(--brand-primary)]`}
                            >
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>

                        {item.description ? (
                          <p className="mt-1 text-xs leading-relaxed text-pretty text-[var(--brand-ink-muted)] sm:text-sm">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      {item.price ? (
                        <p className="text-sm tabular-nums sm:text-base" dir="ltr">
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
