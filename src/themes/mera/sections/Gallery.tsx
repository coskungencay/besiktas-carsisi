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
 * fotograf blogu hissi bu dar cizgiden geliyor. Yukseklik sabit, gorseller
 * object-cover: farkli en-boy oranlarindaki fotograflarda bile satirlar duz
 * bir taban cizgisinde kalir.
 */
export default function Gallery({ content }: SectionProps) {
  // isVisible hem "gorsel var mi" hem "panelden kapatilmis mi" sorusunu
  // birlikte cevaplar; header'daki nav linki de ayni kosula bagli.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

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
            genisligine takilip tasabilir; sifir tabanli minmax bunu keser. */}
        <ul className="mt-9 grid grid-cols-2 gap-3.5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {gallery.map((image, index) => (
            <Reveal
              key={image.id}
              as="li"
              delay={index === 0 ? 0.08 : 0.14}
              className="relative h-[220px] bg-[var(--brand-surface-alt)] sm:h-[320px] lg:h-[420px]"
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
