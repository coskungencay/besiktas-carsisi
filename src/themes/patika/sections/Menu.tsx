import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  allMenuItems,
  featuredItems,
  menuHref,
  menuWithItems,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { SectionHead, pillSolid, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/* Vitrinde kac kart var: tasarimin 4'lu izgarasindan bir hucre CTA'ya kaldi. */
const SHOWCASE_COUNT = 3;

/**
 * Ana sayfadaki menu VITRINI — tam liste degil.
 *
 * NEDEN: menu buyudukce (30+ urun) ana sayfa okunamaz hale geliyordu. Burada
 * yalnizca birkac urun duruyor, tam liste kendi sayfasinda (/tr/menu).
 * Tasarimin afis kartlari (60px'lik bilincli bosluk, 32px ad, 26px fiyat) tam
 * da bu is icin: az sayida urunu buyuk gostermek. Katalog isini cetvel yapar,
 * o da menu sayfasinda.
 *
 * KATEGORI BASLIGI YOK: tasarimda menu tek bir izgara ve kategori adi kartin
 * ustundeki numara satirinda ("01 · Espresso bazli"). Vitrinde bu daha da
 * dogru — uc urun icin uc kategori basligi acmak bolumu kalabaliklastirirdi.
 */
export default function Menu({ content }: SectionProps) {
  const categories = menuWithItems(content);
  if (categories.length === 0) return null;

  const { t } = content;

  /*
   * Once musterinin isaretledigi urunler; hic isaretlenmemisse menunun ilk
   * urunlerine duseriz. Bolum bos kalirsa ana sayfada menuye giden hicbir kapi
   * kalmiyor — vitrin her zaman dolu olmali.
   */
  const featured = featuredItems(content, SHOWCASE_COUNT);
  const items =
    featured.length > 0 ? featured : allMenuItems(content).slice(0, SHOWCASE_COUNT);

  /*
   * Kartin numara satiri kategori adini gosteriyor; featuredItems duz bir urun
   * listesi dondurdugu icin ad buradan geri bulunuyor.
   */
  const categoryOf = new Map<number, string>();
  for (const category of categories) {
    for (const item of category.items) categoryOf.set(item.id, category.name);
  }

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
          {/*
            Uc kart, uc kolon: tasarimin 4'lu izgarasindan kart sayisi dustugu
            icin kolon sayisi da dusuyor. 4 kolonda kalsaydi son sutun bos
            kalir, izgara yarim gorunurdu.
          */}
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              const categoryName = categoryOf.get(item.id) ?? "";

              return (
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
                    {String(index + 1).padStart(2, "0")}
                    {categoryName ? <> &middot; {categoryName}</> : null}
                  </p>

                  {/* Tasarimdaki 60px'lik bosluk: kart ustu ile ad arasi. */}
                  <h3 className="pk-title mt-15 text-balance">{item.name}</h3>

                  {/*
                    Aciklama rengi `opacity` ile veriliyor, sabit muted renkle
                    DEGIL: fare ustundeyken kart neon zemine donuyor ve
                    devralinan renk kendiliginden okunur kaliyor.
                  */}
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
              );
            })}
          </ul>
        </Reveal>

        {/*
          Vitrinin cikisi: tam menuye giden dolu neon rozet — temanin ana buton
          bicimi (kapanis blogundaki "yol tarifi" butonuyla ayni). Izgaranin
          altinda tek basina duruyor ki kartlarin arasinda kaybolmasin.
          next/link: ayni site icinde tam sayfa yenilemeden gecis.
        */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={menuHref(content)}
              className={`${pillSolid} transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]`}
            >
              <span>{t.menu.viewAll}</span>
              <ArrowIcon className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
