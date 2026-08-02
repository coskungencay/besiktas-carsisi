import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SQUARE_FALLBACK, imageOrFallback, menuWithItems } from "@/themes/_shared/data";
import {
  SectionHead,
  dashedRow,
  metaText,
  shell,
  soft,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Her kategori ayri bir yumusak kart; urunler kartin icinde satirlar.
 *
 * Satir ritmi tasarimdan birebir: 16px alt-ust bosluk, aralarinda kesik cizgi,
 * urun adi ile fiyat arasinda NOKTALI kilavuz cizgi (tezgah tabelasi hissi).
 * Fiyatlar slab fontla ve marka renginde — sayfadaki tek "kalin" tipografi.
 *
 * Urun gorseli VARSA kucuk yuvarlak thumb olarak satirin basinda duruyor.
 * Gorseli olmayan urun satiri thumb'siz akar, bos kare birakmak vitrini
 * seyreltirdi.
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
            size="md"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
              <div className={`${soft} h-full p-6 sm:p-8`}>
                <h3 className="brand-display text-[length:var(--brand-h4)] tracking-[var(--brand-h3-tracking)]">
                  {category.name}
                </h3>

                <ul className="mt-6 flex flex-col">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className={`${dashedRow} flex items-start gap-4 py-4`}
                    >
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
                        <div className="flex items-baseline gap-3">
                          <p className="min-w-0 text-[length:var(--brand-lead)]">
                            {item.name}
                            {item.isFeatured ? (
                              <span
                                className={`${metaText} ms-3 whitespace-nowrap`}
                              >
                                {t.menu.featured}
                              </span>
                            ) : null}
                          </p>

                          {/* Noktali kilavuz: ad ile fiyati birbirine bagliyor.
                              mb-1 tasarimdaki gibi cizgiyi taban cizgisinin
                              biraz uzerine oturtuyor. */}
                          <span
                            aria-hidden="true"
                            className="mb-1 hidden h-0 flex-1 border-b border-dotted border-[var(--brand-hairline-soft)] sm:block"
                          />

                          {item.price ? (
                            <p
                              className="brand-display shrink-0 text-[length:var(--brand-lead)] font-semibold tabular-nums text-[var(--brand-primary)]"
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
