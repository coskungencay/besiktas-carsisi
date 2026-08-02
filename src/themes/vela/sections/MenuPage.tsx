import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import {
  goldButton,
  Hairline,
  meta,
  SectionHead,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/** Kategori capasi; hem sayfa ici gezinme hem panel id'si buradan uretilir. */
function anchorId(categoryId: number) {
  return `kategori-${categoryId}`;
}

/**
 * TAM MENU SAYFASI (/<dil>/menu) — bir bolum degil, bir sayfanin govdesi.
 *
 * Ana sayfadaki vitrin uc urun gosteriyor; burasi kartin tamami. Ustunde hero
 * olmadigi icin sayfa ust boslugu bolum ritminden (118px) belirgin daha genis:
 * baslik dogrudan ust seridin altina yapismasin diye.
 *
 * DUZEN: her kategori KABUK GENISLIGINDE BIR BANT — temanin yatay bant dili,
 * ana sayfadaki panellerle ayni kabuk (shell) icinde, yani bantlarin dis
 * hizasi diger bolumlerin hizasiyla birebir ayni. Bantlar sirayla koyu (altin
 * cerceveli) ve krem; tasarimdaki iki menu panelinin ayni kontrasti, sadece
 * yan yana degil alt alta.
 * Bandin icinde tasarimin "deneyim" izgarasi var: solda 280px'lik kategori
 * kolonu (genis ekranda kaydirmada YAPISKAN — uzun listede hangi kategoride
 * oldugun kaybolmasin), sagda urunler. Urunler cok genis ekranda iki kolona
 * bolunuyor; dar ekranda tek kolon.
 *
 * Satirlar tasarimdaki gibi: solda serif ad ve 13px aciklama, sagda ayni taban
 * cizgisinde fiyat, aralarinda sac teli ayrac.
 */
export default function MenuPage({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  return (
    <section aria-labelledby="menu-page-title" className={surface}>
      {/*
       * Ust bosluk bolum ritminin (4.5 / 7.375rem) yaklasik 1.3 kati: bu sayfa
       * bir bolum degil, kendi basina duran bir sayfa ve ustunde fotograf yok.
       */}
      <div className={`${shell} pt-[6rem] pb-16 sm:pt-[9.5rem]`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-page-title"
            note={t.menu.pageIntro}
          />
        </Reveal>

        {/*
         * Kategori capalari: tek kategori varsa gezinmeye gerek yok, liste
         * zaten tek parca. Ust seritteki nav ile ayni olcu ve ayni 34px aralik.
         */}
        {categories.length > 1 ? (
          <Reveal delay={0.08}>
            <nav aria-label={t.menu.eyebrow} className="mt-12">
              <Hairline tone="gold" />
              <ul className="flex flex-wrap items-baseline gap-x-[2.125rem] gap-y-3 pt-6">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${anchorId(category.id)}`}
                      className={`${meta} transition-colors hover:text-[var(--brand-accent)]`}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ) : null}

        {/*
         * Bantlar arasinda bosluk YOK: tasarimda paneller birbirine yapisik,
         * ayrim yalnizca renk kontrastindan geliyor. Ard arda iki KOYU bant
         * gelmedigi icin (siralama tek/cift) altin cerceveler ust uste binip
         * cift cizgi olusturmuyor.
         */}
        <div className="mt-16">
          {categories.map((category, index) => {
            // Tek sayili kategoriler krem banda dusuyor (tasarimdaki sag panel).
            const isLight = index % 2 === 1;

            const band = isLight
              ? "bg-[var(--brand-accent)] text-[var(--brand-surface)]"
              : "border border-[var(--brand-frame-gold)] bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]";
            const accentTone = isLight
              ? "text-[var(--brand-primary-deep)]"
              : "text-[var(--brand-primary)]";
            const ruleTone = isLight
              ? "border-[var(--brand-rule-on-accent)]"
              : "border-[var(--brand-rule-soft)]";
            const descTone = isLight
              ? "text-[var(--brand-ink-on-accent-muted)]"
              : "text-[var(--brand-ink-muted)]";

            return (
              <div
                key={category.id}
                id={anchorId(category.id)}
                /*
                 * scroll-mt: capadan gelindiginde kategori adi ekranin en ust
                 * kenarina yapismasin.
                 */
                className={`${band} scroll-mt-8 px-6 py-12 sm:px-[3.75rem] sm:py-16`}
              >
                <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr] lg:gap-[4.375rem]">
                  {/*
                   * Kategori kolonu genis ekranda yapiskan: 20 urunluk bir
                   * listede sayfa kaydikca hangi kategoride oldugun gorunur
                   * kalir. self-start olmadan sticky calismaz (izgara hucresi
                   * varsayilan olarak bandin tamamini kaplar).
                   */}
                  <div className="lg:sticky lg:top-8 lg:self-start">
                    <h3 className={`brand-body brand-eyebrow text-[0.6875rem] leading-[1.6] ${accentTone}`}>
                      {category.name}
                    </h3>
                    <div
                      aria-hidden="true"
                      className={`mt-4 border-t ${ruleTone}`}
                    />
                  </div>

                  {/*
                   * Urunler: cok genis ekranda iki kolon (uzun listeler tek
                   * kolonda gereksiz uzuyor), altinda tek kolona iner.
                   * gap-y YOK — dikey ritmi satirlarin kendi dolgusu ve ust
                   * ayraci kuruyor.
                   */}
                  <ul className="grid gap-x-[3.75rem] xl:grid-cols-2">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-baseline justify-between gap-6 border-t py-[1.1875rem] sm:gap-8 ${ruleTone}`}
                      >
                        {/* min-w-0: uzun ad sarsin, fiyatin uzerine binmesin. */}
                        <div className="min-w-0">
                          <p className="brand-display text-[1.3125rem] leading-[1.3] text-pretty">
                            {item.name}
                          </p>

                          {item.isFeatured ? (
                            <p
                              className={`brand-body brand-eyebrow mt-[0.3125rem] text-[0.6875rem] leading-[1.6] ${accentTone}`}
                            >
                              {t.menu.featured}
                            </p>
                          ) : null}

                          {item.description ? (
                            <p
                              className={`mt-[0.3125rem] text-[0.8125rem] leading-[1.6] text-pretty ${descTone}`}
                            >
                              {item.description}
                            </p>
                          ) : null}
                        </div>

                        {item.price ? (
                          <p
                            className={`brand-display shrink-0 text-[1.1875rem] leading-[1.3] tabular-nums ${accentTone}`}
                            dir="ltr"
                          >
                            {item.price}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/*
         * Sayfanin kapanisi: ana sayfaya donus.
         *
         * NEDEN ISLETME ADI: sozlukte "geri don" karsiligi yok ve uydurma metin
         * yazmak yasak. Isletme adi zaten ust seritteki marka baglantisinin
         * ayni isi yapiyor; burada temanin buton bicimiyle tekrarlaniyor.
         */}
        <div className="mt-16">
          <Hairline tone="gold" />
          <div className="pt-12">
            <Link href={`/${content.locale}`} className={goldButton}>
              <span className="tracking-[var(--brand-wordmark-tracking)]">
                {content.name}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
