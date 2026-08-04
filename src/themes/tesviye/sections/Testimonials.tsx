import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  Plate,
  bodyTextSm,
  cellEdge,
  edgeBottom,
  gridBleed,
  gridClip,
  mono,
  padSm,
  padStrip,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/** Puan da bir olcek: bes kutucukluk sabit cetvel. */
const SCALE = [1, 2, 3, 4, 5];

/**
 * Muayene fisi: her yorum kalin cizgilerle ayrilmis bir hucre, tepesinde
 * numara ve puan seridi, altinda metin ile imza. Tasarimin "kayit" bolumundeki
 * kutucuk dizisiyle ayni dil.
 *
 * NEDEN yildiz cizilmedi: bu temada dekoratif ikon yok — hero'daki "acik"
 * gostergesi bile kucuk bir kareydi. Puan, temanin kendi dilinde dolu/bos
 * kutucuklu bir olcek satiri olarak veriliyor.
 */
export default function Testimonials({ content }: SectionProps) {
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  return (
    <section
      id="yorumlar"
      aria-labelledby="testimonials-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="04"
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          >
            <div className={gridClip}>
              <ul className={`grid sm:grid-cols-2 lg:grid-cols-3 ${gridBleed}`}>
                {testimonials.map((item, index) => {
                  /*
                   * Puan yerel bir sabite aliniyor: dogrudan item.rating
                   * kullanilsaydi null kontrolu asagidaki geri cagrinin icinde
                   * gecersiz sayilir ve "!" yazmak gerekirdi.
                   */
                  const rating = item.rating;

                  return (
                    <li
                      key={item.id}
                      className="flex flex-col bg-[var(--brand-surface)]"
                      style={cellEdge}
                    >
                      <div
                        className={`${padStrip} flex items-center justify-between gap-4`}
                        style={edgeBottom}
                      >
                        {/* Numara sadece gorsel bir isaret; okunmasi gereksiz. */}
                        <p
                          className={`${mono} tabular-nums text-[var(--brand-primary)]`}
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        {rating !== null ? (
                          <p className="flex items-center gap-[3px]">
                            {/*
                             * Kutucuklar aria-hidden: ekran okuyucu puani
                             * yanindaki sr-only cumleden TEK sefer duysun,
                             * bes ayri kutu olarak degil.
                             */}
                            <span
                              className="flex items-center gap-[3px]"
                              aria-hidden="true"
                            >
                              {SCALE.map((step) => (
                                <span
                                  key={step}
                                  className={
                                    step <= rating
                                      ? "size-2 bg-[var(--brand-primary)]"
                                      : "size-2 border border-[var(--brand-ink-muted)]"
                                  }
                                />
                              ))}
                            </span>
                            <span className="sr-only">
                              {fill(t.testimonials.ratingLabel, {
                                rating: String(rating),
                              })}
                            </span>
                          </p>
                        ) : null}
                      </div>

                      <blockquote
                        className={`${padSm} flex flex-1 flex-col gap-5 text-[var(--brand-ink-muted)]`}
                      >
                        <p className={bodyTextSm}>{item.text}</p>

                        {item.author ? (
                          /* mt-auto: metin kisa olsa da imza hucrenin dibine oturur. */
                          <footer className="mt-auto">
                            <cite className="brand-display text-[length:var(--ts-item)] leading-[1.25] tracking-[0.01em] not-italic uppercase text-[var(--brand-ink)]">
                              <Latin>{item.author}</Latin>
                            </cite>
                          </footer>
                        ) : null}
                      </blockquote>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
