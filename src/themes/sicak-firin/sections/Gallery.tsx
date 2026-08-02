import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yuvarlak koseli yatay kareler, aralarinda 20px bosluk.
 *
 * Olculer tasarimdan: uc kolon, 4:3 oran (tasarimda 320px yukseklik), 20px
 * aralik. Kare yerine yatay oran, vitrin fotografini daha genis gosteriyor.
 *
 * Gorunurluk tek yerden soruluyor: isVisible("galeri") hem "gorsel yok" halini
 * hem musterinin panelden kapatmasini kapsiyor.
 */
export default function Gallery({ content }: SectionProps) {
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
            align="center"
            size="md"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className="brand-rounded relative aspect-[4/3] overflow-hidden bg-[var(--brand-surface-alt)]"
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
