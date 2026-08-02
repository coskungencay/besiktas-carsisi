import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  CategoryHeading,
  SectionTitle,
  column,
  shell,
  surfaceAlt,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Eski fiyat listesi: tek kolon, kategori basligi iki yaninda cizgiyle ortada,
 * urun adi basta fiyat sonda, satirlar ince cizgiyle ayrilir.
 *
 * Urun gorseli YOK: bu tema bir menu KARTI taklit ediyor, katalog degil;
 * panelden yuklenen urun gorselleri burada gosterilmez.
 * Zemin bolum boyunca degisiyor ki kart sayfadan ayrilsin.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surfaceAlt}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div
          className={`${column} brand-frame mt-12 bg-[var(--brand-surface)] px-6 py-10 sm:px-12 sm:py-14`}
        >
          <div className="flex flex-col gap-12">
            {categories.map((category, index) => (
              <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
                <CategoryHeading>{category.name}</CategoryHeading>

                <ul className="mt-6 flex flex-col">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="border-b border-[var(--brand-border)] py-3.5 last:border-b-0"
                    >
                      <div className="ky-prose flex items-baseline gap-3">
                        <p>
                          {item.name}
                          {item.isFeatured ? (
                            <span className="brand-eyebrow ms-3 text-xs text-[var(--brand-accent)]">
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>

                        {/*
                          Noktali dolgu cizgisi: eski fiyat listelerinin imzasi.
                          flex-1 oldugu icin ad ile fiyat arasindaki bosluk ne
                          olursa olsun doluyor, RTL'de de dogru yonde uzuyor.
                        */}
                        {item.price ? (
                          <span
                            aria-hidden="true"
                            className="mb-1.5 flex-1 border-b border-dotted border-[var(--brand-border)]"
                          />
                        ) : null}

                        {item.price ? (
                          <p
                            className="shrink-0 tabular-nums text-[var(--brand-primary)]"
                            dir="ltr"
                          >
                            {item.price}
                          </p>
                        ) : null}
                      </div>

                      {item.description ? (
                        <p className="ky-note mt-1 text-pretty text-[var(--brand-ink-muted)]">
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
      </div>
    </section>
  );
}
