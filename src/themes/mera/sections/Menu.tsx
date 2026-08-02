import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  SectionHead,
  label,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

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

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          >
            <div className="grid gap-x-[4.5rem] gap-y-12 lg:grid-cols-2">
              {categories.map((category, index) => (
                <Reveal key={category.id} delay={index < 2 ? 0.08 : 0.16}>
                  {/* Kategori adi: tasarimda 23px italik serif, altinda 22px bosluk. */}
                  <h3 className="brand-display mb-[1.375rem] text-[1.4375rem] italic rtl:not-italic">
                    {category.name}
                  </h3>

                  <ul>
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className="border-b border-[var(--brand-border)] py-[0.9375rem] last:border-0"
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
                                className="mb-[5px] min-w-6 flex-1 border-b border-dotted border-[var(--brand-border)]"
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
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
