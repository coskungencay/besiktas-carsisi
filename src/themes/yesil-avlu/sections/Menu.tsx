import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHeading, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kategoriler alt alta; her kategori adi ortada, urunler iki kolonlu ince liste.
 *
 * Kart YOK: bu tasarimda kutu sadece hero gorseli, galeri ve saat kartlarinda
 * var. Menude urunleri ayiran tek sey ince bir cizgi ve bosluk.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-16">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
              <h3 className="brand-display text-center text-2xl sm:text-3xl">
                {category.name}
              </h3>

              <ul className="mx-auto mt-8 grid max-w-5xl gap-x-16 sm:grid-cols-2">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="border-t border-[var(--brand-border)] py-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="brand-display text-lg">
                        {item.name}
                        {item.isFeatured ? (
                          <span className="brand-body brand-eyebrow ms-3 text-[0.6rem] text-[var(--brand-accent)]">
                            {t.menu.featured}
                          </span>
                        ) : null}
                      </h4>

                      {item.price ? (
                        <p
                          className="text-sm tabular-nums text-[var(--brand-ink-muted)]"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
