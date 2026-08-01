import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionIndex, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Bosluksuz uclu izgara: gorseller arasinda sadece ince cizgi kalir.
 * Galeri bossa bolum hic basilmaz.
 */
export default function Gallery({ content }: SectionProps) {
  const { gallery, name, t } = content;
  if (gallery.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section border-t border-[var(--brand-border)]`}>
        <Reveal>
          <SectionIndex
            index="03"
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-12 grid grid-cols-2 gap-px bg-[var(--brand-border)] sm:grid-cols-3">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className="relative aspect-square bg-[var(--brand-surface-alt)]"
              >
                <Image
                  src={imageOrFallback(image.thumbUrl || image.url, SQUARE_FALLBACK)}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, {
                      name,
                      index: String(index + 1),
                    })
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
