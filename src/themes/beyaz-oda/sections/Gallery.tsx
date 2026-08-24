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
          <SectionIndex index={sectionIndex(content, "galeri")} title={t.gallery.eyebrow} titleId="gallery-title">
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {gallery.map((image, index) => {
                const number = String(index + 1).padStart(2, "0");
                const alt =
                  image.alt ||
                  fill(t.gallery.imageAlt, { name, index: String(index + 1) });

                return (
                  <Reveal
                    as="li"
                    key={image.id}
                    delay={Math.min(index, 5) * 0.1}
                  >
                    <div className="relative h-[200px] bg-[var(--brand-surface-alt)] sm:h-[300px]">
                      <Image
                        src={imageOrFallback(
                          image.thumbUrl || image.url,
                          SQUARE_FALLBACK,
                        )}
                        alt={alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        loading="lazy"
                        className="object-cover"
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
