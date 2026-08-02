import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin menusu iki PANEL: biri koyu ve altin cerceveli, digeri krem
 * zeminli. Kategoriler sirayla bu iki panel arasinda donuyor; boylece kac
 * kategori olursa olsun kontrast korunuyor.
 *
 * Urunler satir halinde: solda ad ve aciklama, sagda fiyat, ayni taban
 * cizgisinde ve aralarinda sac teli ayraclar. Olculer tasarimdan: panel
 * dolgusu 64/60px, satir dolgusu 19px, ad 21px, fiyat 19px, aciklama 13px.
 *
 * Urun gorselleri bilerek gosterilmiyor; bosluk bu tasarimin malzemesi.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        {/*
         * gap YOK: paneller tasarimda birbirine yapisik duruyor, aradaki
         * ayrim renk kontrastindan geliyor.
         */}
        <div
          className={`mt-16 grid ${categories.length > 1 ? "lg:grid-cols-2" : ""}`}
        >
          {categories.map((category, index) => {
            // Tek sayili kategoriler krem panele dusuyor (tasarimdaki sag blok).
            const isLight = index % 2 === 1;

            const panel = isLight
              ? "bg-[var(--brand-accent)] text-[var(--brand-surface)]"
              : "bg-[var(--brand-surface-alt)] text-[var(--brand-ink)] border border-[var(--brand-frame-gold)]";
            const eyebrowTone = isLight
              ? "text-[var(--brand-primary-deep)]"
              : "text-[var(--brand-primary)]";
            const priceTone = eyebrowTone;
            const ruleTone = isLight
              ? "border-[var(--brand-rule-on-accent)]"
              : "border-[var(--brand-rule-soft)]";
            const descTone = isLight
              ? "text-[var(--brand-ink-on-accent-muted)]"
              : "text-[var(--brand-ink-muted)]";

            return (
              <Reveal key={category.id} delay={index === 0 ? 0 : 0.12}>
                <div className={`${panel} h-full px-8 py-12 sm:px-[3.75rem] sm:py-16`}>
                  <h3
                    className={`brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] ${eyebrowTone}`}
                  >
                    {category.name}
                  </h3>

                  <ul className="mt-[1.625rem]">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={item.id}
                        className={`flex items-baseline justify-between gap-8 py-[1.1875rem] ${
                          itemIndex === category.items.length - 1
                            ? ""
                            : `border-b ${ruleTone}`
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="brand-display text-[1.3125rem] leading-[1.3] text-pretty">
                            {item.name}
                          </p>

                          {item.isFeatured ? (
                            <p
                              className={`brand-body brand-eyebrow mt-[0.3125rem] text-[0.6875rem] leading-[1.6] ${eyebrowTone}`}
                            >
                              {t.menu.featured}
                            </p>
                          ) : null}

                          {item.description ? (
                            <p
                              className={`mt-[0.3125rem] text-[0.8125rem] leading-[1.6] text-pretty ${descTone}`}
                            >
                              {item.description}
                            </p>
                          ) : null}
                        </div>

                        {item.price ? (
                          <p
                            className={`brand-display shrink-0 text-[1.1875rem] leading-[1.3] tabular-nums ${priceTone}`}
                            dir="ltr"
                          >
                            {item.price}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
