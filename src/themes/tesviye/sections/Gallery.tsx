import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  Plate,
  actionLabel,
  cellEdge,
  edgeBottom,
  gridBleed,
  gridClip,
  label,
  padSm,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin "saha" paftasi: dort esit hucre, her biri 300px yuksekliginde,
 * aralarinda 2px cizgi ve etrafinda DOLGU YOK — gorseller paftanin kendisi.
 *
 * Son hucre gorsel degil, mavi bir eylem karti: tasarimda diziyi kiran tek
 * vurgu bu (ustte kucuk etiket, ortada dev Anton satiri, altta alt cizgili
 * baglanti). Konum bolumu kapaliysa veya semt girilmemisse basilmaz.
 *
 * Gorsel altinda numara seridi YOK: tasarimda hucreler duz gorsel; serit
 * hucre yuksekligini bozup dizinin ritmini kaydiriyordu.
 */
export default function Gallery({ content }: SectionProps) {
  // Musteri galeriyi panelden kapatabilir; kosul tek yerde (isVisible).
  if (!content.isVisible("galeri")) return null;

  const { gallery, contact, name, t } = content;

  // Mavi kart bir baglanti; hedef bolum yoksa kart da yok.
  const promo = content.isVisible("konum") && contact.locality;

  return (
    <section
      id="galeri"
      aria-labelledby="gallery-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="03"
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          >
            <div className={gridClip}>
              <ul
                className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${gridBleed}`}
              >
                {gallery.map((image, index) => (
                  <li
                    key={image.id}
                    className="relative h-[13rem] bg-[var(--brand-surface-alt)] sm:h-[16rem] lg:h-[18.75rem]"
                    style={cellEdge}
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
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </li>
                ))}

                {promo ? (
                  <li
                    className={`${padSm} flex h-[13rem] flex-col justify-between gap-4 bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)] sm:h-[16rem] lg:h-[18.75rem]`}
                    style={cellEdge}
                  >
                    <p className={label}>{t.location.eyebrow}</p>

                    <p className="brand-display text-[length:var(--ts-card-title)] leading-[var(--ts-title-leading)] text-balance uppercase">
                      {contact.locality}
                    </p>

                    <a
                      href="#konum"
                      /*
                       * Olcu actionLabel (12px/600): kartin ust etiketiyle
                       * ayni `label` degil — tasarimda bu satir bir tik buyuk
                       * ve harf araligi dar, cunku tiklanacak hedef o.
                       *
                       * Alt cizgi kalinligi cerceve token'indan: tasarimda bu
                       * baglantinin alti 2px, hucre cizgileriyle ayni kalemle
                       * cizilmis gibi durur.
                       */
                      className={`${actionLabel} inline-flex items-center gap-2 self-start pb-[3px] transition-colors hover:text-[var(--brand-accent)]`}
                      style={{
                        borderBottomWidth: "var(--brand-border-width)",
                        borderBottomStyle: "solid",
                        borderBottomColor: "currentColor",
                      }}
                    >
                      {t.location.directions}
                      <ArrowIcon className="size-3.5" />
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
