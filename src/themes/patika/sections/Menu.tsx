import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi degil, KART IZGARASI (tasarimda 4 kolon, 16px aralik).
 *
 * Kart tasarimda su ritimde: ustte kucuk numara etiketi, uzun bir bosluk,
 * sonra 32px urun adi, aciklama ve en altta 26px fiyat. Bosluk bilincli —
 * kartlari afis boyuna cikarip izgaraya nefes veriyor.
 *
 * Aciklama rengi `opacity` ile veriliyor, sabit muted renkle DEGIL: fare
 * ustundeyken kart neon zemine donuyor ve devralinan renk kendiliginden
 * okunur kaliyor.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div className="mt-10 flex flex-col gap-16">
          {categories.map((category, categoryIndex) => (
            <div key={category.id}>
              <Reveal delay={categoryIndex === 0 ? 0 : 0.06}>
                <h3 className="pk-h3 text-balance text-[var(--brand-primary)]">
                  {category.name}
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {category.items.map((item, index) => (
                    <li
                      key={item.id}
                      className="brand-frame flex flex-col bg-[var(--brand-surface-alt)] px-6 pt-6 pb-[1.375rem] transition-colors hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-contrast)]"
                    >
                      <p className="pk-caps opacity-55">
                        {String(index + 1).padStart(2, "0")}
                        {item.isFeatured ? ` · ${t.menu.featured}` : ""}
                      </p>

                      {/* Tasarimdaki 60px'lik bosluk: kart ustu ile ad arasi. */}
                      <h4 className="pk-title mt-15 text-balance">
                        {item.name}
                      </h4>

                      {item.description ? (
                        <p className="mt-2 text-sm leading-[1.5] text-pretty opacity-70">
                          {item.description}
                        </p>
                      ) : null}

                      {item.price ? (
                        <p
                          className="pk-price mt-[1.125rem] tabular-nums"
                          dir="ltr"
                        >
                          {item.price}
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
