import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SQUARE_FALLBACK, imageOrFallback, menuWithItems } from "@/themes/_shared/data";
import { SectionHead, metaText, shell, soft, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Her kategori ayri bir yumusak kart; urunler kartin icinde satirlar.
 *
 * Urun gorseli VARSA kucuk yuvarlak thumb olarak satirin basinda duruyor —
 * tezgahta duran urune bakar gibi. Gorseli olmayan urun satiri thumb'siz akar,
 * bos kare birakmak vitrini seyreltirdi.
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
            align="center"
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-6">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
              <div className={`${soft} p-6 sm:p-8`}>
                <h3 className="brand-display text-2xl">{category.name}</h3>

                <ul className="mt-6 flex flex-col gap-6">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-4">
                      {item.thumbUrl ? (
                        <Image
                          src={imageOrFallback(item.thumbUrl, SQUARE_FALLBACK)}
                          alt={item.name}
                          width={64}
                          height={64}
                          loading="lazy"
                          className="brand-rounded size-16 shrink-0 bg-[var(--brand-surface)] object-cover"
                        />
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                          <p className="text-base">
                            {item.name}
                            {item.isFeatured ? (
                              <span
                                className={`${metaText} ms-3 whitespace-nowrap`}
                              >
                                {t.menu.featured}
                              </span>
                            ) : null}
                          </p>

                          {item.price ? (
                            <p className="text-sm tabular-nums" dir="ltr">
                              {item.price}
                            </p>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className="mt-1 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
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
