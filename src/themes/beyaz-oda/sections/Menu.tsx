import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SQUARE_FALLBACK,
  allMenuItems,
  featuredItems,
  menuHref,
  menuWithItems,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  isSectionShown,
  meta,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { MenuCategory, MenuItem, SectionProps } from "@/themes/types";

/** Ana sayfada gosterilen vitrin magazasi sayisi — uclu izgara. */
const SHOWCASE_COUNT = 3;

/**
 * Ana sayfanin magaza VITRINI — tam liste /<dil>/magazalar sayfasinda.
 *
 * ONCEKI HALI ve NEDEN DEGISTI: uc magaza alt alta, yalnizca ADLARIYLA
 * listeleniyordu. 87 esnafli bir carsinin ana sayfasinda "Arkabahce / Kemah
 * Cay Ocagi / PTT" seklinde uc satir, ne carsinin buyuklugunu ne karakterini
 * anlatiyordu. Simdi uc KART yan yana: fotograf, ad ve kategori.
 *
 * Fotograf onceligi: magazanin kendi fotografi > kategorisinin kapak gorseli
 * > notr yer tutucu. Boylece carsi yonetimi her magazaya tek tek fotograf
 * eklemek zorunda kalmadan da vitrin dolu gorunur.
 */
export default function Menu({ content }: SectionProps) {
  if (!isSectionShown(content, "magazalar")) return null;

  const { t } = content;
  const categories = menuWithItems(content);

  /*
   * Musteri hicbir magazayi "one cikan" isaretlemediyse bolum bos kalmasin
   * diye listenin ilk magazalarina duseriz.
   */
  const featured = featuredItems(content, SHOWCASE_COUNT);
  const items =
    featured.length > 0 ? featured : allMenuItems(content).slice(0, SHOWCASE_COUNT);

  /** Bir magazanin kategorisi — kart kunyesi ve gorsel yedegi icin. */
  const categoryOf = (item: MenuItem): MenuCategory | undefined =>
    categories.find((category) => category.items.some((i) => i.id === item.id));

  const shopCount = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <section id="magazalar" aria-labelledby="magazalar-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          <SectionIndex
            index={sectionIndex(content, "magazalar")}
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="magazalar-title"
            lead={fill(t.menu.lead, {
              categories: String(categories.length),
              shops: String(shopCount),
            })}
          >
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
              {items.map((item, index) => {
                const category = categoryOf(item);
                const image = item.thumbUrl || category?.thumbUrl || SQUARE_FALLBACK;

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    variant="clip"
                    delay={Math.min(index, 3) * 0.1}
                  >
                    {/*
                      Kartin TAMAMI magazalar sayfasina giden tek baglanti.
                      Ayri bir "detay" baglantisi yok: carsinin magaza basina
                      detay sayfasi yok, olmayan bir sayfaya ok koymak yanlis
                      beklenti yaratirdi.
                    */}
                    <Link href={menuHref(content)} className="group block">
                      <div className="relative aspect-4/5 overflow-hidden bg-[var(--brand-surface-alt)]">
                        <Image
                          src={image}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </div>

                      <p className={`${meta} brand-eyebrow mt-5 text-center`}>
                        {category?.name ?? t.menu.eyebrow}
                      </p>

                      <p className="brand-display mt-2 text-center text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.25] tracking-[-0.02em] text-balance transition-colors group-hover:text-[var(--brand-accent)]">
                        <Latin>{item.name}</Latin>
                      </p>

                      {item.description ? (
                        <p className="mt-3 text-center text-[13.5px] leading-[1.6] text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.28}>
              <div className="mt-16 text-center">
                <Link
                  href={menuHref(content)}
                  className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[14px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                >
                  <span>{t.menu.viewAll}</span>
                  <ArrowIcon className="size-3.5" />
                </Link>
              </div>
            </Reveal>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
