import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Izgara degil, YATAY SERIT: kareler snap ile tek tek duruyor.
 *
 * NEDEN: afis dilinde galeri bir "film seridi"; dikey izgara sayfayi uzatip
 * menunun kart ritmini tekrarlardi. Galeri bossa bolum hic basilmaz.
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
          />
        </Reveal>

        <Reveal delay={0.08}>
          {/* snap-x kaydirma KABINDA olmali; seride verilirse etkisiz kalir. */}
          <div className="-mx-5 mt-10 snap-x snap-mandatory overflow-x-auto px-5 sm:-mx-8 sm:px-8">
            <ul className="flex w-max gap-4">
              {gallery.map((image, index) => (
                <li
                  key={image.id}
                  className="brand-frame relative aspect-square w-[72vw] shrink-0 snap-start overflow-hidden bg-[var(--brand-surface-alt)] sm:w-[20rem]"
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
                    sizes="(min-width: 640px) 20rem, 72vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
