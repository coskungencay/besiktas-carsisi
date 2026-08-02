import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { hasMenu, menuWithItems } from "@/themes/_shared/data";
import {
  ArrowIcon,
  containerClass,
  secondaryButtonClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ayri menu sayfasinin govdesi (/tr/menu).
 *
 * NEDEN AYRI: ana sayfadaki "menu" bolumu artik yalnizca 3 urunluk bir vitrin.
 * Tam liste burada, kendi sayfasinda; 30+ urun ana sayfayi okunamaz kiliyordu.
 *
 * DUZEN: ana sayfadaki kart dilinin AYNISI (brand-frame kart, gorsel + ad/fiyat
 * ayni satirda, altta aciklama) ama daha genis nefes aliyor: kategori basina
 * blok, ust boslugu daha buyuk ve kolon sayisi 3 yerine 2. Aciklamalar burada
 * kirpilmadan gosterildigi icin dar kolon satir uzunlugunu kotu kiliyordu.
 */
export default function MenuPage({ content }: SectionProps) {
  // Menu bossa sayfa zaten 404; yine de bilesen tek basina guvenli olmali.
  if (!hasMenu(content)) return null;

  const categories = menuWithItems(content);
  const { t } = content;

  const anchorId = (categoryId: number) => `menu-kategori-${categoryId}`;

  return (
    <section id="menu" aria-labelledby="menu-page-title" className={sectionClass}>
      {/*
       * Ustunde hero yok: sayfa basligi tarayici cubuguna yapismasin diye
       * bolum boslugunun uzerine ek bir ust bosluk konuyor.
       */}
      <div className={`${containerClass} brand-section pt-12 sm:pt-20`}>
        <Reveal>
          <header className="max-w-2xl">
            <p className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
              {t.menu.eyebrow}
            </p>
            {/* Sayfanin tek h1'i: bu sayfada hero basligi yok. */}
            <h1
              id="menu-page-title"
              className="brand-display mt-4 text-3xl leading-tight text-balance sm:text-5xl"
            >
              {t.menu.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
              {t.menu.pageIntro}
            </p>
          </header>
        </Reveal>

        {/*
         * Kategori atlama listesi: uzun menude asagiya kaydirmadan istenen
         * bolume gitmek icin. Tek kategori varsa gereksiz gurultu, gizlenir.
         */}
        {categories.length > 1 ? (
          <Reveal delay={0.05}>
            <nav aria-label={t.menu.eyebrow} className="mt-10">
              <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`#${anchorId(category.id)}`}
                      className="brand-frame inline-flex px-4 py-2 text-sm transition-colors hover:bg-[var(--brand-surface-alt)]"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ) : null}

        <div className="mt-14 flex flex-col gap-16">
          {categories.map((category, ci) => (
            <Reveal
              as="section"
              key={category.id}
              delay={Math.min(ci, 4) * 0.05}
            >
              {/* scroll-mt: capadan gelindiginde baslik ekranin tepesine yapismasin. */}
              <h2
                id={anchorId(category.id)}
                className="brand-display scroll-mt-8 border-b border-[var(--brand-border)] pb-4 text-2xl sm:text-3xl"
              >
                {category.name}
              </h2>

              {/*
               * Iki kolon: uzun listeyi kisaltir ama aciklamayi bogmaz.
               * 390px'te tek kolona iner (grid varsayilani).
               */}
              <ul className="mt-8 grid gap-5 md:grid-cols-2 md:gap-x-8">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="brand-frame flex gap-4 bg-[var(--brand-surface-alt)] p-4 transition-colors hover:border-[var(--brand-primary)]"
                  >
                    {item.thumbUrl ? (
                      <div className="brand-rounded relative aspect-square w-20 shrink-0 overflow-hidden">
                        <Image
                          src={item.thumbUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      {/*
                       * flex-wrap + gap: uzun urun adi fiyatin uzerine binmez,
                       * dar ekranda fiyat alt satira iner.
                       */}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="brand-display text-base leading-snug">
                          {item.name}
                        </h3>
                        {item.price ? (
                          <p className="text-sm font-medium tabular-nums text-[var(--brand-primary)]">
                            {item.price}
                          </p>
                        ) : null}
                      </div>

                      {item.description ? (
                        <p className="text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}

                      {item.isFeatured ? (
                        <p className="brand-rounded brand-eyebrow mt-1 inline-flex w-fit items-center bg-[var(--brand-primary)] px-2.5 py-1 text-[11px] text-[var(--brand-primary-contrast)]">
                          {t.menu.featured}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/*
         * Sayfanin sonunda ana sayfaya donus: menu ayri bir sayfa oldugu icin
         * ziyaretcinin tek cikisi tarayici geri tusu olmamali.
         * Uygun bir sozluk anahtari yok; isletme adi kullaniliyor.
         */}
        <div className="mt-16 border-t border-[var(--brand-border)] pt-8">
          <Link href={`/${content.locale}`} className={secondaryButtonClass}>
            {/* rotate-180: ok geri yonu gosterir, RTL'de de dogru donuyor. */}
            <span className="inline-flex rotate-180">
              <ArrowIcon />
            </span>
            <span>{content.name}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
