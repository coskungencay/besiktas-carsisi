import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import {
  SectionIndex,
  isSectionShown,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Uclu izgara: 300px yuksekliginde gorseller, altlarinda 10.5px mono kunye.
 * Kunyede sira numarasi her zaman var; aciklama (alt) girilmisse yanina eklenir.
 *
 * Galeri bossa ya da panelden kapatildiysa bolum hic basilmaz.
 */
export default function Gallery({ content }: SectionProps) {
  if (!isSectionShown(content, "galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          <SectionIndex index={sectionIndex(content, "galeri")} eyebrow={t.gallery.eyebrow}
            title={t.gallery.title} titleId="gallery-title">
            {/*
              TELEFONDA TEK SUTUN. Ikili izgarada her kare ~170px genisligindeydi
              ve altyazi BUYUK harf monospace: "01 / ÇARŞININ ÜÇ KAT GALERİ VE
              ORTASINDAN YÜKSELEN AĞAÇ" dort satira boluniyor, kare kadar yer
              tutuyor ve fotografla altyazi birbirini bogyordu. Ustelik 170px
              bir vitrin fotografini gostermek icin fazla kucuk — galerinin
              tek isi zaten fotografi GOSTERMEK.

              Tek sutunda kare tam genislige cikiyor, altyazi iki satira
              iniyor. Sayfa uzuyor ama bu bolumde uzunluk zaten beklenen sey.
            */}
            <ul className="grid gap-6 sm:grid-cols-3">
              {gallery.map((image, index) => {
                const number = String(index + 1).padStart(2, "0");
                const alt =
                  image.alt ||
                  fill(t.gallery.imageAlt, { name, index: String(index + 1) });

                return (
                  <Reveal
                    as="li"
                    key={image.id}
                    variant="clip"
                    delay={Math.min(index, 5) * 0.09}
                  >
                    {/*
                      overflow-hidden + group: fotograf uzerine gelindiginde
                      cercevesinin ICINDE hafifce yaklasiyor. Cerceve sabit
                      kaldigi icin izgara ritmi bozulmuyor.
                    */}
                    <div className="group relative h-[260px] overflow-hidden bg-[var(--brand-surface-alt)] sm:h-[300px]">
                      <Image
                        src={imageOrFallback(
                          image.thumbUrl || image.url,
                          SQUARE_FALLBACK,
                        )}
                        alt={alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        loading="lazy"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,0.8,0.24,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>

                    <p className="bo-index-sm brand-eyebrow mt-[10px]">
                      {image.alt ? `${number} / ${image.alt}` : number}
                    </p>
                  </Reveal>
                );
              })}
            </ul>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
