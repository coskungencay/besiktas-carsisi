import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import {
  Passepartout,
  SectionTitle,
  shell,
  surface,
} from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Simetrik izgara; her kare passe-partout cerceve icinde — duvara asilmis
 * eski fotograflar gibi. Galeri bossa bolum hic basilmaz.
 */
export default function Gallery({ content }: SectionProps) {
  // isVisible hem "gorsel var mi" hem "musteri panelden kapatmis mi" sorusunu
  // birlikte cevapliyor; gallery.length kontrolu ikincisini kaciriyordu.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionTitle
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7">
            {gallery.map((image, index) => (
              <li key={image.id}>
                <Passepartout>
                  <div className="relative aspect-square bg-[var(--brand-surface-alt)]">
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
                  </div>
                </Passepartout>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
