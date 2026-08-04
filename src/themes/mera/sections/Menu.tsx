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
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  MenuLine,
  SectionHead,
  cta,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/** Ana sayfada gosterilecek urun sayisi — tasarimdaki tek kolonluk ritim. */
const SHOWCASE_COUNT = 3;

/**
 * Menu VITRINI — tam liste artik kendi sayfasinda (/tr/menu).
 *
 * NEDEN VITRIN: menu buyudukce (30+ urun) ana sayfa okunamaz hale geliyordu;
 * dergi de ic sayfada tum menuyu basmaz, birkac kalemi one cikarip formaya
 * yollar.
 *
 * Tasarimin menu dili korunuyor — "ad ......... fiyat" satirlari, noktali
 * dolgu, ustune gelince isinan zemin — ama iki kolon yerine TEK kolon:
 * uc satir iki kolona bolununce bolum yarim kalmis bir tablo gibi gorunuyordu.
 *
 * Urun fotografi OPSIYONEL: musteri panelden fotograf eklerse satirin basinda
 * kucuk bir kare belirir, eklemezse tasarimin siki tipografik ritmi aynen
 * kalir. Karar musterinin (bkz. "Menude urun fotograflari" ayari).
 */
export default function Menu({ content }: SectionProps) {
  if (!hasMenu(content)) return null;

  const { t } = content;

  /*
   * Musteri hicbir urunu isaretlememis olabilir; o durumda bolum bos kalmasin
   * diye menunun ilk urunlerine duseriz. Isaretli urunler daima oncelikli.
   */
  const featured = featuredItems(content, SHOWCASE_COUNT);
  const items =
    featured.length > 0
      ? featured
      : allMenuItems(content).slice(0, SHOWCASE_COUNT);

  /*
   * Fotograf sutunu VITRINDEKI urunlere gore acilir: menunun baska bir yerinde
   * fotograf olmasi burada bos kare acmayi gerektirmez.
   */
  const withImages = anyItemHasImage(content, items);

  return (
    <section id="menu" aria-labelledby="menu-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
            /* Tasarimda kunye kolonunun altindaki kucuk not (13px / 1.6):
               burada menunun tamaminin baska bir sayfada oldugunu soyler. */
            aside={
              <p className="text-[0.8125rem] leading-[1.6] text-pretty text-[var(--brand-ink-faint)]">
                {t.menu.pageIntro}
              </p>
            }
          >
            <div className="max-w-[900px]">
              {/* One cikan rozeti BASILMIYOR: buradaki her satir zaten secilmis
                  urun, hepsine ayni etiketi vurmak gurultu olurdu. */}
              <ul>
                {items.map((item) => (
                  <MenuLine
                    key={item.id}
                    item={item}
                    thumb={itemThumb(content, item)}
                    reserveImage={withImages}
                  />
                ))}
              </ul>

              <Reveal delay={0.12}>
                {/* Temanin ana eylem bicimi (bkz. parts.tsx `cta`): bu
                    tasarimda dolgulu buton yok, marka renginde alt cizgili
                    kunye baglantisi var. */}
                <Link href={menuHref(content)} className={`${cta} mt-9`}>
                  <span>{t.menu.viewAll}</span>
                  <ArrowIcon className="size-3.5" />
                </Link>
              </Reveal>
            </div>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
