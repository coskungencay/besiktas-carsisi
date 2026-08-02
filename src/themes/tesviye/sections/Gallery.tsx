import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { Sheet, SheetHead, edgeTop, meta, shell } from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kalin cizgili kontak foyu: her gorsel kendi cerceveli hucresinde, altinda
 * numarali monospace serit. Numara sadece gorsel bir isaret oldugu icin
 * ekran okuyuculardan gizli.
 *
 * NEDEN her hucreye ayri cerceve: galeri adedi degisken; ortak zemin hilesi
 * kullanilsaydi eksik kalan son satir koyu bir blok olarak gorunurdu.
 */
export default function Gallery({ content }: SectionProps) {
  // Musteri galeriyi panelden kapatabilir; kosul tek yerde (isVisible).
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section
      id="galeri"
      aria-labelledby="gallery-title"
      className="bg-[var(--brand-surface)]"
    >
      <div
        className={`${shell} pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <Sheet>
          <Reveal>
            <SheetHead
              code="03"
              eyebrow={t.gallery.eyebrow}
              title={t.gallery.title}
              titleId="gallery-title"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="grid grid-cols-2 gap-[var(--brand-border-width)] p-4 sm:grid-cols-3 sm:p-[var(--ts-pad)] lg:grid-cols-4">
              {gallery.map((image, index) => (
                <li key={image.id} className="brand-frame">
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
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>

                  <p
                    className={`${meta} px-3 py-2 tabular-nums text-[var(--brand-ink-muted)]`}
                    style={edgeTop}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Sheet>
      </div>
    </section>
  );
}
