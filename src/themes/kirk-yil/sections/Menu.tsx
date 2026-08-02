import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { shell } from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat listesi — TASARIMIN EN CARPICI BOLUMU.
 *
 * Tasarimda bu bolum sayfanin tek KOYU alani: kahve zemin (--brand-ink) uzerine
 * kagit rengi yazi (--brand-surface). Sayfa boyunca akan acik krem ritmi burada
 * kesiliyor ve menu bir "tabela" gibi one cikiyor. Onceki hali acik zeminde bir
 * kart icindeydi; bolum sayfadan ayrilmiyordu.
 *
 * Olculer tasarimdan: bolum 84px/92px dikey dolgu, ic kap 1000px, iki kolon
 * 70px araliki, urun satiri 19px/300 agirlik ve 14px dikey dolgu.
 *
 * Urun gorseli YOK: burasi bir menu KARTI, katalog degil.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  /*
   * Kategorileri IKI KOLONA elle dagitiyoruz.
   *
   * NEDEN: grid-cols-2 kategorileri sirayla yerlestiriyor; uc kategoride
   * (3+2+2 urun) sag kolon yarim kaliyor ve tasarimin dengeli iki sutunu
   * bozuluyordu. Burada urun sayisina gore boluyoruz: her kolona yaklasik
   * ayni sayida SATIR dusuyor.
   */
  const totalRows = categories.reduce(
    (sum, category) => sum + category.items.length + 1,
    0,
  );
  const left: typeof categories = [];
  const right: typeof categories = [];
  let filled = 0;
  for (const category of categories) {
    const rows = category.items.length + 1;
    if (filled + rows / 2 <= totalRows / 2 || left.length === 0) {
      left.push(category);
      filled += rows;
    } else {
      right.push(category);
    }
  }

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-[var(--brand-ink)] text-[var(--brand-surface)]"
    >
      <div className={`${shell} py-[84px] sm:py-[92px]`}>
        {/*
          Bolum basligi ortada. SectionTitle kullanilmiyor: o bilesen acik
          zemin icin yazildi (ink rengi baslik, muted eyebrow); burada zemin
          ters oldugu icin renkler de ters.
        */}
        <Reveal>
          <div className="mx-auto max-w-[1000px] text-center">
            <p className="ky-eyebrow text-[var(--brand-accent)]">
              {t.menu.eyebrow}
            </p>
            <h2
              id="menu-title"
              className="brand-display mt-3.5 text-[clamp(2rem,4vw,3.5rem)] leading-[1.06] text-balance"
            >
              {t.menu.title}
            </h2>

            {/* Elmas ayrac: acik zemindeki surumun kagit rengi karsiligi. */}
            <div
              className="mt-[18px] flex items-center justify-center gap-4"
              aria-hidden="true"
            >
              <span className="h-px w-20 bg-[var(--brand-surface)]/30" />
              <span className="text-[13px] text-[var(--brand-accent)]">✦</span>
              <span className="h-px w-20 bg-[var(--brand-surface)]/30" />
            </div>
          </div>
        </Reveal>

        {/*
          Iki kolon: tasarimda kategoriler yan yana duruyor (KAHVELER |
          FIRIN & TATLI). Tek kolon liste sayfayi gereksiz uzatiyordu.
          Kategori sayisi tekse ikinci kolon bos kalmasin diye tek kolona
          duser; ikiden fazlaysa siraya dizilir.
        */}
        <div className="mx-auto mt-[52px] grid max-w-[1000px] items-start gap-x-[70px] gap-y-12 md:grid-cols-2">
          {[left, right].map((group, groupIndex) =>
            group.length === 0 ? null : (
              <div key={groupIndex} className="flex flex-col gap-12">
                {group.map((category, index) => (
                  <Reveal key={category.id} delay={Math.min(index, 3) * 0.06}>
              <h3 className="ky-eyebrow border-b border-[var(--brand-surface)]/25 pb-3 text-[var(--brand-accent)]">
                {category.name}
              </h3>

              <ul className="mt-1.5 flex flex-col">
                {category.items.map((item) => (
                  <li key={item.id} className="py-3.5">
                    <div className="flex items-baseline gap-2.5 text-[19px] font-light">
                      <p>
                        {item.name}
                        {item.isFeatured ? (
                          <span className="ky-eyebrow ms-3 text-[var(--brand-accent)]">
                            {t.menu.featured}
                          </span>
                        ) : null}
                      </p>

                      {/*
                        Noktali dolgu: eski fiyat listelerinin imzasi. flex-1
                        oldugu icin ad ile fiyat arasi ne olursa olsun doluyor,
                        RTL'de de dogru yonde uzuyor.
                      */}
                      {item.price ? (
                        <span
                          aria-hidden="true"
                          className="mb-1.5 flex-1 border-b border-dotted border-[var(--brand-surface)]/30"
                        />
                      ) : null}

                      {item.price ? (
                        <p className="shrink-0 tabular-nums" dir="ltr">
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {item.description ? (
                      <p className="ky-note mt-1 text-pretty text-[var(--brand-surface)]/65">
                        {item.description}
                      </p>
                    ) : null}
                  </li>
                ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
