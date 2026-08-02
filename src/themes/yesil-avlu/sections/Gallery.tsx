import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHeading, shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Uclu izgara. Tasarimdaki ritim kolon bazli: kenar kolonlar KEMERLI (ust
 * kenari yarim daire), ortadaki duz koseli ve 44px asagi kaydirilmis. Boylece
 * izgara duz bir tugla duvari degil, sekmeli bir avlu dosemesi gibi okunuyor.
 *
 * Gorunurluk tek yerden: isVisible("galeri") hem "gorsel yok" halini hem de
 * musterinin panelden kapatmasini kapsiyor (Header'daki link ayni kosulda).
 */
export default function Gallery({ content }: SectionProps) {
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

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
          {/* items-start: ortadaki kolonun kaydirmasi satir yuksekligini bozmasin. */}
          <ul className="mt-12 grid grid-cols-2 items-start gap-4 sm:grid-cols-3 sm:gap-[1.375rem]">
            {gallery.map((image, index) => {
              // Tasarimda orta kolon duz koseli ve asagi kaydirilmis.
              const isMiddleColumn = index % 3 === 1;

              return (
                <li
                  key={image.id}
                  className={`relative aspect-[4/5] overflow-hidden bg-[var(--brand-surface-alt)] sm:aspect-[5/4] ${
                    isMiddleColumn
                      ? "brand-rounded sm:mt-11"
                      : "ya-arch-sm"
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
