import Link from "next/link";

import { ImageZoom } from "@/components/site/ImageZoom";
import { fill } from "@/i18n";
import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  anyItemHasImage,
  featuredItems,
  hasMenu,
  itemThumb,
  menuHref,
} from "@/themes/_shared/data";
import {
  ArrowIcon,
  SectionHeader,
  containerClass,
  primaryButtonClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI.
 *
 * NEDEN VITRIN: tam liste artik /[locale]/menu sayfasinda. Burada yalnizca
 * birkac urun ve "tum menuyu gor" baglantisi var; boylece ana sayfa menu
 * buyudukce okunamaz hale gelmiyor.
 *
 * Bolum id'si "menu" KALIYOR: nav capalari ve isVisible mantigi buna bagli.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hic urunu "one cikan" isaretlemediyse bolum bos kalmasin diye
   * menunun ilk urunlerine duseriz.
   */
  const featured = featuredItems(content, 3);
  const items = featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  const withImages = anyItemHasImage(content, items);

  return (
    <section id="menu" aria-labelledby="menu-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={Math.min(i, 4) * 0.05}>
              <article className="brand-frame flex h-full flex-col gap-4 bg-[var(--brand-surface-alt)] p-4 transition-colors hover:border-[var(--brand-primary)]">
                {/* Fotograf panelden kapatilabiliyor; kart izgarasinda
                    hizalama korunsun diye fotografsiz urunde de ayni yer
                    ayrilir. */}
                {withImages ? (
                  <div
                    className={`brand-rounded relative aspect-4/3 w-full overflow-hidden ${itemThumb(content, item) ? "bg-[var(--brand-surface)]" : ""}`}
                  >
                    {itemThumb(content, item) ? (
                      /*
                        Kucuk kare TIKLANABILIR: bu boyuttan urunun neye benzedigi
                        anlasilmiyor. ImageZoom yerinde bir <button> basar (kutu ayni
                        kalir) ve tiklaninca tarayicinin kendi <dialog>'unda buyutur.
                      */
                      <ImageZoom
                        thumbSrc={itemThumb(content, item) as string}
                        fullSrc={item.imageUrl}
                        alt={item.name}
                        openLabel={fill(t.menu.enlarge, { name: item.name })}
                        closeLabel={t.menu.closeImage}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : null}
                  </div>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {/*
                   * flex-wrap + gap: uzun urun adi fiyatin uzerine binmez,
                   * 390px'te fiyat alt satira iner.
                   */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="brand-display text-base leading-snug">
                      <Latin>{item.name}</Latin>
                    </h3>
                    {item.price ? (
                      <p className="text-sm font-medium tabular-nums text-[var(--brand-primary)]">
                        {item.price}
                      </p>
                    ) : null}
                  </div>

                  {item.description ? (
                    // Vitrinde kisa tutuluyor; tam aciklama menu sayfasinda.
                    <p className="line-clamp-2 text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        {/*
         * Bolumun asil isi: tam menuye gonderen belirgin cagri.
         * Hero'nun birincil buton bicimiyle AYNI sinif kaynagini kullanir.
         */}
        <Reveal delay={0.1}>
          <div className="mt-10">
            <Link href={menuHref(content)} className={primaryButtonClass}>
              <span>{t.menu.viewAll}</span>
              <ArrowIcon />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
