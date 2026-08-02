import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi degil, KART IZGARASI (tasarimda 4 kolon, 16px aralik).
 *
 * KATEGORI BASLIGI YOK, IZGARA TEK: tasarimda menu tek bir 4'lu izgara ve
 * kategori adi kartin ustundeki numara satirinda duruyor ("01 · Espresso
 * bazli"). Her kategoriye ayri bir izgara acmak iki sorun cikariyordu:
 * uc urunlu bir kategoride dorduncu sutun bos kaliyor (izgara yarim gorunuyor)
 * ve dev kategori basliklari bolum basligiyla ayni sesi tekrar ediyordu.
 * Numara TUM menu boyunca akar; sayfa tek bir vitrin gibi okunur.
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

  /* Kategori adi kartin icine tasindigi icin urunler tek listeye duzlestirilir. */
  const items = categories.flatMap((category) =>
    category.items.map((item) => ({ item, category: category.name })),
  );

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            title={t.menu.title}
            titleId="menu-title"
            /* Tasarimin TEK dev basligi (76px) burada; digerleri 56px. */
            size="lg"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ item, category }, index) => (
              <li
                key={item.id}
                /*
                 * Ic bosluk tasarimdaki gibi asimetrik: 26px ust, 24px yan,
                 * 22px alt.
                 *
                 * One cikan urunler turuncuya, digerleri neona donuyor:
                 * tasarimda da izgaradaki kartlarin hover rengi ayni degil,
                 * diziyi kiran tekil vurgular var.
                 */
                className={`brand-frame flex flex-col bg-[var(--brand-surface-alt)] px-6 pt-[1.625rem] pb-[1.375rem] transition-colors hover:text-[var(--brand-primary-contrast)] ${
                  item.isFeatured
                    ? "hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]"
                    : "hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]"
                }`}
              >
                <p className="pk-caps opacity-55">
                  {String(index + 1).padStart(2, "0")} &middot; {category}
                </p>

                {/* Tasarimdaki 60px'lik bosluk: kart ustu ile ad arasi. */}
                <h3 className="pk-title mt-15 text-balance">{item.name}</h3>

                {item.description ? (
                  <p className="mt-2 text-sm leading-[1.5] text-pretty opacity-70">
                    {item.description}
                  </p>
                ) : null}

                {item.price ? (
                  <p className="pk-price mt-[1.125rem] tabular-nums" dir="ltr">
                    {item.price}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
