import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK_DARK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kare izgara: tasarimda genis ekranda 5 kolon, 14px aralik, 16px yuvarlak kose.
 *
 * Kareler cerceve DEGIL sadece yuvarlak: menu kartlarinin kalin kenarligi burada
 * tekrar etseydi izgara tel orgu gibi gorunurdu.
 */
export default function Gallery({ content }: SectionProps) {
  // Gorsel yoksa ya da musteri panelden kapattiysa bolum hic basilmaz.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-[var(--brand-radius-media)] bg-[var(--brand-surface-alt)]"
              >
                <Image
                  src={imageOrFallback(
                    image.thumbUrl || image.url,
                    SQUARE_FALLBACK_DARK,
                  )}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, {
                      name,
                      index: String(index + 1),
                    })
                  }
                  fill
                  sizes="(min-width: 1024px) 17rem, (min-width: 640px) 30vw, 45vw"
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
