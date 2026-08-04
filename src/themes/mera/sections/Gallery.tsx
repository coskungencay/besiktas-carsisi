import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import {
  SectionHeadRow,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Gorsel bolumu tasarimda sayfanin TAMAMINI kaplar; bu yuzden 220px'lik kunye
 * izgarasini kullanmaz, basligi tek satirlik genis surumdur.
 *
 * Kolonlar esit degil (1.4fr / 1fr / 1fr) ve aralik yalnizca 14px — dergi
 * fotograf blogu hissi bu dar cizgiden geliyor.
 *
 * MOZAIK: tasarimda uc kolonun ortasi TEK bir 420px'lik gorsel degil, alt alta
 * iki 203px'lik gorsel (203+14+203=420). Uc esit yukseklikte kolon bu bolumu
 * duz bir seride ceviriyordu. Desen dortlu bir modul olarak tekrar eder:
 * genis · (kucuk + kucuk) · genis.
 *
 * Her gorsele yalnizca KOLONU ve kac satir kaplayacagi soyleniyor, satir
 * numarasi verilmiyor — satir numarasi modul sirasina gore hesaplansaydi sinif
 * adlari dinamik olurdu ve Tailwind bunlari uretemezdi. Satiri tarayici
 * seciyor; `grid-flow-row-dense` her gorseli en ustteki bos gozden baslatarak
 * arar, boylece her modul kendi iki satirina oturur.
 *
 * Kolon numaralari yazi yonune baglidir: RTL'de 1. kolon en sagdaki olur,
 * yani duzen kendiliginden aynalanir.
 */

/** Dortlu modulde bir gorselin izgaradaki yeri. */
const MOSAIC = [
  "lg:col-start-1 lg:row-span-2",
  "lg:col-start-2 lg:row-span-1",
  "lg:col-start-2 lg:row-span-1",
  "lg:col-start-3 lg:row-span-2",
];

/**
 * Artan gorseller (dortluye tamamlanmayan son 1-3 tane).
 *
 * NEDEN AYRI: modul deseni her gorsele SABIT bir kolon veriyor, yani artan
 * gorseller de kendi kolonlarina yapisir ve yanlarinda bos izgara gozu kalirdi
 * (5 gorselde sagda iki bos goz gibi). Artanlar bunun yerine kalan genisligi
 * paylasir: tek kalan tam genislikte bir bant, iki kalan 2+1 kolon, uc kalan
 * uc esit kolon olur — satir her durumda kapanir.
 *
 * Dizinin sirasi kalan sayisidir; sifirinci yer hic kullanilmaz.
 */
const TAIL = [
  [],
  ["lg:col-span-3 lg:row-span-2"],
  ["lg:col-span-2 lg:row-span-2", "lg:col-start-3 lg:row-span-2"],
  [
    "lg:col-start-1 lg:row-span-2",
    "lg:col-start-2 lg:row-span-2",
    "lg:col-start-3 lg:row-span-2",
  ],
];

export default function Gallery({ content }: SectionProps) {
  // isVisible hem "gorsel var mi" hem "panelden kapatilmis mi" sorusunu
  // birlikte cevaplar; header'daki nav linki de ayni kosula bagli.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;
  const mosaic = gallery.length >= 4;
  /* Kac gorsel tam modullere giriyor, kac tanesi artiyor. */
  const full = Math.floor(gallery.length / 4) * 4;
  const tail = TAIL[gallery.length - full]!;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHeadRow
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        {/* minmax(0,…): tasarimdaki gibi. Yalin `1.4fr` en az icerik
            genisligine takilip tasabilir; sifir tabanli minmax bunu keser.
            Mozaik yalnizca dort ve uzeri gorselde acilir: uc gorselde modul
            tamamlanmadigi icin izgarada bos bir goz kalirdi. */}
        <ul
          className={`mt-9 grid grid-cols-2 gap-3.5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] ${
            mosaic ? "lg:auto-rows-[203px] lg:grid-flow-row-dense" : ""
          }`}
        >
          {gallery.map((image, index) => (
            <Reveal
              key={image.id}
              as="li"
              delay={index === 0 ? 0.08 : 0.14}
              className={`relative h-[220px] bg-[var(--brand-surface-alt)] sm:h-[320px] ${
                mosaic
                  ? `lg:h-auto ${index < full ? MOSAIC[index % 4] : tail[index - full]}`
                  : "lg:h-[420px]"
              }`}
            >
              <Image
                src={imageOrFallback(image.thumbUrl || image.url, SQUARE_FALLBACK)}
                alt={
                  image.alt ||
                  fill(t.gallery.imageAlt, { name, index: String(index + 1) })
                }
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                loading="lazy"
                className="object-cover"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
