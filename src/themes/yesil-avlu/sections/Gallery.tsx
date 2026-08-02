import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHeading, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Uclu izgara, ama kare degil: siralar donusumlu olarak dikey (4/5) ve kare
 * oranda. Boylece izgara sabit bir tugla duvari gibi degil, sekmeli bir avlu
 * dosemesi gibi okunuyor. Galeri bossa bolum hic basilmaz.
 */
export default function Gallery({ content }: SectionProps) {
  const { gallery, name, t } = content;
  if (gallery.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
            {gallery.map((image, index) => {
              const isTallRow = Math.floor(index / 3) % 2 === 0;

              return (
                <li
                  key={image.id}
                  className={`brand-rounded relative overflow-hidden bg-[var(--brand-surface-alt)] ${
                    isTallRow ? "aspect-[4/5]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={imageOrFallback(
                      image.thumbUrl || image.url,
                      SQUARE_FALLBACK,
                    )}
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
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
