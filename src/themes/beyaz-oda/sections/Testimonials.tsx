import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionIndex,
  meta,
  rowNumber,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps, Testimonial } from "@/themes/types";

/** Puanin gorsel karsiligi: bes hucreli hairline serit. */
const RATING_CELLS = [1, 2, 3, 4, 5];

/**
 * Puan gostergesi.
 *
 * Tasarimda hicbir yerde ikon/glif yok — her sey 1px cizgi ve dolu kutu. Bu
 * yuzden yildiz karakteri yerine bes hucreli bir serit ciziliyor: dolu hucreler
 * ink, bos hucreler yalnizca cerceve. Serit tamamen dekoratif (aria-hidden);
 * ekran okuyucu yanindaki sr-only metni okur, boylece puan iki kez duyulmaz.
 */
function Rating({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {RATING_CELLS.map((cell) => (
          <span
            key={cell}
            className={
              cell <= rating
                ? "size-[7px] bg-[var(--brand-ink)]"
                : "size-[7px] border border-[var(--brand-border)]"
            }
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Yorumlar: menu listesiyle AYNI satir bicimi — 36px indeks / metin / kunye.
 * Yorum metni tasarimin orta punto kademesinde (menu urun adiyla ayni aile),
 * yazar adi ve puan sagda mono kunye olarak durur. Satirlar ince alt cizgiyle
 * ayrilir; sayfadaki diger listelerle ayni ritim.
 */
export default function Testimonials({ content }: SectionProps) {
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  return (
    <section
      id="yorumlar"
      aria-labelledby="testimonials-title"
      className={surface}
    >
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          <SectionIndex
            index="04"
            title={t.testimonials.eyebrow}
            titleId="testimonials-title"
          >
            <ul>
              {testimonials.map((item: Testimonial, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    delay={Math.min(index, 4) * 0.06}
                  >
                    <figure className="grid items-baseline gap-x-6 gap-y-3 border-b border-[var(--brand-border)] py-[26px] lg:grid-cols-[36px_minmax(0,1fr)_240px]">
                      <span className={rowNumber} aria-hidden="true">
                        {number}
                      </span>

                      <blockquote className="brand-display text-[clamp(1.0625rem,1.5vw,1.375rem)] leading-[1.5] tracking-[-0.015em] text-pretty">
                        {item.text}
                      </blockquote>

                      {/*
                        Yazar ve puan tek kunye hucresinde: tasarimda sag kolon
                        her zaman mono ve kucuk puntolu (menude fiyat, galeride
                        numara). Puan yoksa hucre sadece adi tasir.
                      */}
                      <figcaption
                        className={`${meta} flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-end`}
                      >
                        <span className="brand-eyebrow">{item.author}</span>
                        {item.rating ? (
                          <Rating
                            rating={item.rating}
                            label={fill(t.testimonials.ratingLabel, {
                              rating: String(item.rating),
                            })}
                          />
                        ) : null}
                      </figcaption>
                    </figure>
                  </Reveal>
                );
              })}
            </ul>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
