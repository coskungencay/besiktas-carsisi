/*
 * LEGACY ORTAK BILESEN
 *
 * Bu klasordeki bilesenler, tasarimina gore HENUZ yeniden yazilmamis temalarin
 * ortak iskeletidir — dokuz temanin ayni gorunmesinin sebebi de buydu.
 *
 * YENI TEMA YAZARKEN KULLANMAYIN. Ornek yapi: src/themes/beyaz-oda/
 * Ortak MANTIK icin: src/themes/_shared/  (bkz. THEMING.md)
 */
import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/shared/parts";
import type { SectionProps } from "@/themes/types";

export default function Gallery({ content }: SectionProps) {
  const images = content.gallery;
  if (images.length === 0) return null;

  const { t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, i) => (
            <Reveal as="li" key={image.id} delay={Math.min(i, 8) * 0.04}>
              <div className="brand-rounded relative aspect-square overflow-hidden bg-[var(--brand-surface-alt)]">
                <Image
                  src={image.url}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, {
                      name: content.name,
                      index: i + 1,
                    })
                  }
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
