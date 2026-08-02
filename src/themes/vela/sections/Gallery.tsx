import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { HERO_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { CenteredHeading, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kare izgara YOK: gorseller kenardan kenara uzanan cok yatay bantlar halinde
 * alt alta duruyor. Sinema seridi hissi veriyor ve sayfanin dikey ritmini
 * bozmuyor.
 */
export default function Gallery({ content }: SectionProps) {
  const { gallery, name, t } = content;
  if (gallery.length === 0) return null;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} pt-16 sm:pt-24`}>
        <Reveal>
          <CenteredHeading
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <ul className="mt-16 flex flex-col gap-2 pb-16 sm:mt-20 sm:gap-3 sm:pb-24">
          {gallery.map((image, index) => (
            <li
              key={image.id}
              className="relative aspect-[16/9] w-full bg-[var(--brand-surface-alt)] sm:aspect-[21/9]"
            >
              <Image
                src={imageOrFallback(image.url || image.thumbUrl, HERO_FALLBACK)}
                alt={
                  image.alt ||
                  fill(t.gallery.imageAlt, { name, index: String(index + 1) })
                }
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
