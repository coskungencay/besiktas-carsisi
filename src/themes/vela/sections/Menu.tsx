import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  CenteredHeading,
  Hairline,
  label,
  labelMuted,
  prose,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tek kolon, ortalanmis ve dar. Urunler SATIR degil BLOK: ad ustte, aciklama
 * ve fiyat altinda. Nokta nokta uzayan fiyat satirlari bu temada yok, cunku
 * bakilan sey urunun adi — fiyat sessizce altinda duruyor.
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
          <CenteredHeading
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div className="mx-auto mt-20 flex max-w-3xl flex-col gap-24">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index === 0 ? 0 : 0.06}>
              <div className="flex flex-col items-center text-center">
                <h3 className="brand-display text-2xl leading-[1.3]">
                  {category.name}
                </h3>
                <Hairline className="mt-8" />

                <ul className="mt-12 flex w-full flex-col gap-12">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex flex-col items-center gap-3">
                      <p className="brand-display text-xl leading-[1.35] text-balance">
                        {item.name}
                      </p>

                      {item.isFeatured ? (
                        <p className={label}>{t.menu.featured}</p>
                      ) : null}

                      {item.description ? (
                        <p className={`max-w-xl ${prose}`}>{item.description}</p>
                      ) : null}

                      {item.price ? (
                        <p className={`${labelMuted} tabular-nums`} dir="ltr">
                          {item.price}
                        </p>
                      ) : null}
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
