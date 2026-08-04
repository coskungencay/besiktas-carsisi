import Image from "next/image";
import Link from "next/link";

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
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  dashedRow,
  leaderLine,
  pillSolid,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI — tam liste degil.
 *
 * NEDEN VITRIN: menu buyudukce (30+ urun) ana sayfa okunamaz hale geliyordu.
 * Tam liste artik kendi sayfasinda (/{dil}/menu); burada tezgahin onunden
 * gecerken gorulen uc sey duruyor.
 *
 * DUZEN tasarimin menu izgarasini KORUR: iki kolon, kart yok, satirlar
 * dogrudan krem zeminde. Tek fark kolonlarin isi — solda baslik, sagda
 * satirlar. Uc satiri iki kolona bolmek sag kolonu yarim birakirdi; basligi
 * ustune almak ise 2200px'lik govdede kilavuz cizgileri sayfa boyu uzatiyordu.
 *
 * Baglanti kolonun ALTINDA (ustunde degil): dar ekranda kolonlar alt alta
 * inince "once urunler, sonra tum menu" sirasi bozulmasin.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hic urun isaretlemediyse bolum bos kalmasin: menunun ilk uc
   * urunune duseriz. Panelde "one cikan" kutusu isaretlenmemis olmasi
   * "vitrin istemiyorum" demek degil, cogu zaman fark edilmemis olmasi demek.
   */
  const featured = featuredItems(content, 3);
  const items = featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  const withImages = anyItemHasImage(content, items);

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHead
              eyebrow={t.menu.eyebrow}
              title={t.menu.title}
              titleId="menu-title"
              intro={t.menu.pageIntro}
              size="md"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="flex flex-col">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`${dashedRow} flex items-start gap-4 py-4`}
                >
                  {/*
                    Fotograf artik panelden kapatilabiliyor; ayrica listedeki
                    hicbir urunde fotograf yoksa sutun hic acilmaz. Fotografi
                    olmayan TEKIL urunde yer bos birakilir, yoksa satirlar
                    farkli girintilerden baslar.
                  */}
                  {withImages ? (
                    <span
                      className={`brand-rounded relative block size-16 shrink-0 overflow-hidden ${itemThumb(content, item) ? "bg-[var(--brand-surface-alt)]" : ""}`}
                    >
                      {itemThumb(content, item) ? (
                        <Image
                          src={itemThumb(content, item) as string}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                  ) : null}

                  {/* min-w-0: uzun urun adi kolonu tasirip fiyati disari
                      itmesin (390px'te kritik). */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      {/*
                        "One cikan" etiketi burada YOK: bu bolumdeki her satir
                        zaten one cikan urun, her satira rozet takmak vitrini
                        bir uyari listesine cevirirdi.
                      */}
                      <p className="min-w-0 text-[length:var(--brand-lead)]">
                        <Latin>{item.name}</Latin>
                      </p>

                      <span aria-hidden="true" className={leaderLine} />

                      {item.price ? (
                        <p
                          className="brand-display shrink-0 text-[length:var(--brand-lead)] font-semibold tabular-nums text-[var(--brand-primary)]"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {/* Vitrinde aciklama iki satirda kesilir; tamami menu
                        sayfasinda duruyor. */}
                    {item.description ? (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            {/* Hero'daki dolu hap ile AYNI bicim: sayfadaki asil eylem bu. */}
            <Link href={menuHref(content)} className={`${pillSolid} mt-8`}>
              <span>{t.menu.viewAll}</span>
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
