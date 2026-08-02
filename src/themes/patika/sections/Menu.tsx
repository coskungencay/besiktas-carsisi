import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  SectionHead,
  card,
  pillAccent,
  shell,
  surface,
} from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi degil, KART IZGARASI.
 *
 * Fiyat kartin ust kosesine yapistirilmis bir "sticker" gibi cerceveyi keser
 * (-top-3). Bu yuzden izgaranin dikey araligi yataydan buyuk: rozetler ustteki
 * kartin kenarina degmesin.
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
            centered
          />
        </Reveal>

        <div className="mt-14 flex flex-col gap-16">
          {categories.map((category, index) => (
            <div key={category.id}>
              <Reveal delay={index === 0 ? 0 : 0.06}>
                <h3 className="brand-display text-[clamp(1.75rem,5vw,3rem)] leading-[0.95] text-balance text-[var(--brand-primary)]">
                  {category.name}
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <ul className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => (
                    <li key={item.id} className={`${card} relative flex flex-col`}>
                      {item.price ? (
                        <p
                          className="brand-display brand-rounded absolute -top-3 end-4 bg-[var(--brand-primary)] px-3 py-1 text-sm tabular-nums text-[var(--brand-primary-contrast)]"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}

                      {item.isFeatured ? (
                        <p className={`${pillAccent} mb-3 self-start`}>
                          {t.menu.featured}
                        </p>
                      ) : null}

                      <h4
                        className={`brand-display text-xl leading-tight text-balance ${
                          item.price ? "pe-20" : ""
                        }`}
                      >
                        {item.name}
                      </h4>

                      {item.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
