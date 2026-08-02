import { Reveal } from "@/components/motion/Reveal";
import { menuWithItems } from "@/themes/_shared/data";
import { SectionHeading, shell } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Her kategori bir KOLON: italik serif baslik, altinda ince cizgi, sonra
 * urunler alt alta.
 *
 * NEDEN KOLON: tasarimda menu uc esit kolon (64px bosluk) ve her kolon bir
 * kategori. Onceki hali kategorileri alt alta diziyor, her kategorinin
 * urunlerini iki kolona boluyordu; boylece bolum tasarimdakinin iki katindan
 * uzun oluyor ve tek nefeslik koyu serit sayfaya yayiliyordu. Kolon basina bir
 * kategori oldugu icin kolonlar da kendiliginden dengeli doluyor.
 *
 * Kart YOK: bu tasarimda kutu sadece hero gorseli, galeri ve saat kartinda
 * var. Menude urunler arasinda cizgi de yok — ayiran tek sey bosluk; tek cizgi
 * kategori basliginin altinda.
 *
 * ZEMIN: tasarimda menu tam genislikte KOYU bir serit — sayfanin tek nefes
 * kesen yeri orasi. Renkler .ya-grove kapsaminda token'lar yeniden
 * tanimlanarak veriliyor, boylece burada sabit renk yazmiyoruz.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className="ya-grove">
      {/*
        Bolum boslugu burada .brand-section DEGIL, elle veriliyor.
        .brand-section komsu iki bolumun 130px'lik arasini yariya bolme
        kuralidir; koyu serit ise tasarimda hem o 130px'i (kendinden onceki
        bolumun bosluguyla) hem de KENDI 96/100px'lik ic boslugunu tasiyor.
        Yarim degeri kullanmak koyu zemini tasarimdakinden belirgin dar,
        "sikismis" bir serit haline getiriyordu.
      */}
      <div className={`${shell} py-[var(--brand-section-py)] sm:pt-24 sm:pb-25`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        {/*
          1180px tasarimdan geliyor: sayfanin geri kalani kenardan kenara
          aksa da menu izgarasi ortada bu genislikte duruyor. Uc kolonun
          arasindaki 64px'lik bosluk fiyat sutununun okunurlugunu tasiyor.
        */}
        <div className="mx-auto mt-14 grid max-w-[73.75rem] gap-x-16 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            /* Tasarimdaki kolon merdiveni: 0 / 100 / 200ms, sonra tekrar. */
            <Reveal key={category.id} delay={(index % 3) * 0.1}>
              {/* Tasarimda kategori adi italik serif, 26px, altinda ince cizgi. */}
              <h3 className="brand-display ya-serif-book border-b border-[var(--brand-border)] pb-3.5 text-[1.625rem] italic">
                {category.name}
              </h3>

              <ul className="mt-2">
                {category.items.map((item) => (
                  /* Tasarimdaki satir ritmi: 13px alt-ust. */
                  <li key={item.id} className="py-[0.8125rem]">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="brand-body text-[0.9375rem] font-light">
                        {item.name}
                        {item.isFeatured ? (
                          <span className="brand-body brand-eyebrow ms-3 text-[0.6rem] text-[var(--brand-accent)]">
                            {t.menu.featured}
                          </span>
                        ) : null}
                      </h4>

                      {item.price ? (
                        <p
                          className="text-[0.9375rem] font-light tabular-nums text-[var(--brand-accent)]"
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
