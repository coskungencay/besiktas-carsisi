import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yuvarlak koseli kareler, aralarinda genis bosluk.
 *
 * Bosluk bilerek genis: kareler birbirine degdiginde izgara "duvar" gibi
 * gorunuyor, bu tema ise havadar ve sicak duracak. Galeri bossa bolum basilmaz.
 */
export default function Gallery({ content }: SectionProps) {
  const { gallery, name, t } = content;
  if (gallery.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-8">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className="brand-rounded relative aspect-square overflow-hidden bg-[var(--brand-surface-alt)]"
              >
                <Image
                  src={imageOrFallback(image.thumbUrl || image.url, SQUARE_FALLBACK)}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, { name, index: String(index + 1) })
                  }
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
