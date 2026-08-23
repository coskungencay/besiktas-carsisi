import Link from "next/link";

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
  OrnamentDark,
  PriceRow,
  board,
  buttonSolid,
  shell,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Ana sayfadaki menu VITRINI — tam liste artik /menu sayfasinda.
 *
 * NEDEN VITRIN: menu buyudukce (30+ urun) ana sayfa okunamaz hale geliyordu.
 * Burada tasarimin koyu "fiyat listesi tabelasi" duruyor ama uzerinde yalnizca
 * uc satir var: bir kahvehanenin kapisina astigi gunun tahtasi gibi. Devami
 * icin belirgin bir cagri butonu.
 *
 * Tasarimdan gelen olculer: bolum 84px/92px dikey dolgu, koyu zemin
 * (--brand-ink) uzerine kagit rengi yazi, urun satiri 19px/300.
 *
 * Urun gorseli YOK: burasi bir menu KARTI, katalog degil.
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Once "one cikan" isaretli urunler. Musteri hicbirini isaretlememisse
   * bolum bos kalmasin diye menunun ilk uc urunune duseriz — vitrin her
   * kurulumda dolu gorunmeli.
   */
  const featured = featuredItems(content, 3);
  const items =
    featured.length > 0 ? featured : allMenuItems(content).slice(0, 3);

  return (
    <section id="menu" aria-labelledby="menu-title" className={board}>
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
              className="brand-display ky-h2 mt-3.5 text-balance"
            >
              {t.menu.title}
            </h2>

            <OrnamentDark className="mt-[18px]" />
          </div>
        </Reveal>

        {/*
          Vitrin DAR ve TEK kolon: uc satirlik bir liste 1000px'e yayilirsa ad
          ile fiyat arasindaki noktali dolgu metrelerce uzar ve satir okunmaz.
          Tam liste zaten iki kolonlu kendi sayfasinda.
        */}
        <Reveal delay={0.06}>
          <ul className="mx-auto mt-[46px] flex max-w-[46rem] flex-col divide-y divide-[var(--brand-surface)]/15">
            {items.map((item) => (
              <PriceRow
                key={item.id}
                item={item}
                thumb={itemThumb(content, item)}
                                  messages={t}
                reserveImage={anyItemHasImage(content, items)}
              />
            ))}
          </ul>
        </Reveal>

        {/*
          Cagri: hero'daki birincil buton bicimi (dolu bordo). Menu sayfasi ayri
          bir rota oldugu icin next/link ile istemci tarafi gecis yapilir.
        */}
        <Reveal delay={0.12}>
          <div className="mt-[46px] text-center">
            <Link href={menuHref(content)} className={buttonSolid}>
              {t.menu.viewAll}
            </Link>

            {/* Tasarimdaki italik not satirinin yeri: butonun altinda kunye. */}
            <p className="ky-note mt-4 text-[var(--brand-surface)]/65">
              {t.menu.pageIntro}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
