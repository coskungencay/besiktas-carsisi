import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHead, label, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi ilan sayfasi duzeni: kategoriler iki kolona bolunur, her urun tek
 * satirda "ad ......... fiyat" olarak okunur. Noktali alt cizgi, basili
 * menulerin leader-dot alistirmasini taklit eder.
 *
 * Urun gorseli YOK: iki kolonlu bu siki ritim gorselle bozulur.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div
        className={`${page} brand-section border-t border-[var(--brand-border)]`}
      >
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index < 2 ? 0 : 0.08}>
              <h3 className="brand-display border-b border-[var(--brand-ink)] pb-3 text-2xl">
                {category.name}
              </h3>

              <ul>
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-dotted border-[var(--brand-border)] py-3.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <p className="brand-display flex flex-wrap items-baseline gap-x-3 text-lg">
                        <span>{item.name}</span>
                        {item.isFeatured ? (
                          <span className={label}>{t.menu.featured}</span>
                        ) : null}
                      </p>

                      {item.price ? (
                        <p
                          className="brand-display text-base tabular-nums text-[var(--brand-primary)]"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {item.description ? (
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-pretty italic text-[var(--brand-ink-muted)] rtl:not-italic">
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
