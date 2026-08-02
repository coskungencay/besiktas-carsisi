import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import {
  Plate,
  edgeBottom,
  hair,
  label,
  shell,
  tableHead,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin "liste" paftasi: bir fiyat cetveli.
 *
 * Sutunlar tasarimdaki gibi: sira no (60px) · urun (1.4 pay) · not (1 pay) ·
 * fiyat (110px). Urun adi Anton, not ve numara ince monospace, fiyat sagda
 * hizali. Kategori adi tasarimdaki KOYU baslik seridinin yerini tutar —
 * tasarimda liste tek parcaydi, bizde kategorilere bolunuyor.
 *
 * Sira numarasi kategoriler boyunca KESINTISIZ artar: cetvel tek bir belge,
 * her kategoride bire donmesi numarayi anlamsizlastiriyordu.
 *
 * Urun gorseli YOK: bu tasarim teknik bir liste; panelden yuklenen urun
 * gorselleri bu temada gosterilmez.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  // Kategoriler arasinda devam eden sayac.
  let row = 0;

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="02"
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          >
            {categories.map((category) => (
              <div key={category.id}>
                <h3
                  className={`${tableHead} bg-[var(--brand-accent)] px-4 py-3 text-[var(--brand-primary-contrast)] sm:px-[14px]`}
                >
                  {category.name}
                </h3>

                <ul>
                  {category.items.map((item) => {
                    row += 1;

                    return (
                      <li
                        key={item.id}
                        /*
                         * Dar ekranda uc sutun (no · ad · fiyat) kalir, not
                         * alt satira gecer; sm ustunde tasarimin dort sutunlu
                         * cetveli acilir. Hucre yerlesimi acikca yazildi ki
                         * DOM sirasi (no, ad, fiyat, not) iki duzende de
                         * dogru okunsun.
                         */
                        className={`${hair} grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 px-4 py-[15px] transition-colors hover:bg-[var(--ts-row-hover)] sm:grid-cols-[60px_minmax(0,1.4fr)_minmax(0,1fr)_110px] sm:gap-0 sm:p-0`}
                      >
                        {/* Sira numarasi: sadece gorsel bir cetvel isareti. */}
                        <span
                          className="col-start-1 row-start-1 text-[length:var(--ts-body)] font-light tabular-nums text-[var(--brand-ink-muted)] sm:px-[14px] sm:py-[15px]"
                          aria-hidden="true"
                        >
                          {String(row).padStart(2, "0")}
                        </span>

                        <p className="col-start-2 row-start-1 brand-display text-[length:var(--ts-item)] leading-[1.25] tracking-[0.01em] uppercase sm:px-[14px] sm:py-[15px]">
                          {item.name}
                          {item.isFeatured ? (
                            <span
                              className={`${label} ms-3 align-middle text-[var(--brand-primary)]`}
                            >
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </p>

                        {item.price ? (
                          <p
                            className="col-start-3 row-start-1 text-[length:var(--ts-body)] font-medium tabular-nums sm:col-start-4 sm:px-[14px] sm:py-[15px] sm:text-end"
                            dir="ltr"
                          >
                            {item.price}
                          </p>
                        ) : null}

                        {item.description ? (
                          <p className="col-start-2 col-end-4 row-start-2 text-[length:var(--ts-body-sm)] leading-[var(--ts-body-sm-leading)] font-light text-pretty text-[var(--brand-ink-muted)] sm:col-start-3 sm:col-end-4 sm:row-start-1 sm:px-[14px] sm:py-[15px]">
                            {item.description}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
