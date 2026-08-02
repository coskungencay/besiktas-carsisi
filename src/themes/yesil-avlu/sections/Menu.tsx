import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHeading, shell } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kategoriler alt alta; her kategori adi ortada, urunler iki kolonlu ince liste.
 *
 * Kart YOK: bu tasarimda kutu sadece hero gorseli, galeri ve saat kartlarinda
 * var. Menude urunleri ayiran tek sey ince bir cizgi ve bosluk.
 *
 * ZEMIN: tasarimda menu tam genislikte KOYU bir serit — sayfanin tek nefes
 * kesen yeri orasi. Renkler .ya-grove kapsaminda token'lar yeniden
 * tanimlanarak veriliyor, boylece burada sabit renk yazmiyoruz.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className="ya-grove">
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
              {/* Tasarimda kategori adi italik serif, 26px. */}
              <h3 className="brand-display ya-serif-book text-center text-[1.625rem] italic sm:text-[1.75rem]">
                {category.name}
              </h3>

              <ul className="mx-auto mt-8 grid max-w-5xl gap-x-16 sm:grid-cols-2">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    /* Tasarimdaki satir ritmi: 13px alt-ust, ince ayrac. */
                    className="border-t border-[var(--brand-border)] py-[0.8125rem]"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="brand-body text-[0.9375rem] font-light">
                        {item.name}
                        {item.isFeatured ? (
                          <span className="brand-body brand-eyebrow ms-3 text-[0.6rem] text-[var(--brand-accent)]">
                            {t.menu.featured}
                          </span>
                        ) : null}
                      </h4>

                      {item.price ? (
                        <p
                          className="text-[0.9375rem] font-light tabular-nums text-[var(--brand-accent)]"
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
