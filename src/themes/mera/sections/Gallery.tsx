import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, page, surface } from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Asimetrik mozaik: ilk kare dergi acilis fotografi gibi iki kolonu kaplar
 * ve yatay durur, digerleri dikey portrelerdir.
 *
 * items-start sart: izgara varsayilan olarak hucreleri satir yuksekligine
 * gerdiginde aspect-ratio devre disi kalir ve oranlar bozulur.
 */
export default function Gallery({ content }: SectionProps) {
  const { gallery, name, t } = content;
  if (gallery.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div
        className={`${page} brand-section border-t border-[var(--brand-border)]`}
      >
        <Reveal>
          <SectionHead
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 items-start gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.map((image, index) => (
            <Reveal
              key={image.id}
              as="li"
              delay={index === 0 ? 0 : 0.06}
              className={`relative bg-[var(--brand-surface-alt)] ${
                index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[3/4]"
              }`}
            >
              <Image
                src={imageOrFallback(image.thumbUrl || image.url, SQUARE_FALLBACK)}
                alt={
                  image.alt ||
                  fill(t.gallery.imageAlt, { name, index: String(index + 1) })
                }
                fill
                sizes={
                  index === 0
                    ? "(min-width: 1024px) 66vw, 100vw"
                    : "(min-width: 1024px) 33vw, 50vw"
                }
                loading="lazy"
                className="object-cover"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
