import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Tasarimdaki yildiz dizisi hep bes haneli; eksikler bos yildizla tamamlanir. */
const MAX_RATING = 5;

/**
 * "Dedikodu" panosu: tasarimda uc kolonlu, 20px yuvarlak, 2px cerceveli kartlar.
 *
 * KART ZEMINI YOK — menu kartlarindan ayrilan tek nokta bu. Tasarimda yorum
 * kartlari yalnizca cerceve; icleri koyu zeminle doldurulsaydi menu izgarasinin
 * tekrari gibi okunur, iki bolum birbirine karisirdi.
 *
 * Yazar satiri karta DIBE yaslaniyor (mt-auto): yorumlar farkli uzunlukta olsa
 * bile imzalar tek bir cizgide bitiyor, izgara dagilmiyor.
 */
export default function Testimonials({ content }: SectionProps) {
  // Musteri panelden kapattiysa ya da hic yorum yoksa bolum hic basilmaz.
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  return (
    <section
      id="yorumlar"
      aria-labelledby="testimonials-title"
      className={surface}
    >
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => {
              /* Panelden bozuk bir puan gelirse izgarayi bozmasin diye kirpilir. */
              const rating =
                item.rating === null
                  ? null
                  : Math.min(MAX_RATING, Math.max(0, Math.round(item.rating)));

              return (
                <li
                  key={item.id}
                  className="brand-frame flex flex-col p-[1.875rem] transition-colors hover:border-[var(--brand-primary)]"
                >
                  <figure className="flex flex-1 flex-col">
                    {rating !== null ? (
                      <p>
                        {/*
                          Yildizlar SADECE gorsel: ekran okuyucu "yildiz yildiz
                          yildiz" diye tek tek okumasin diye aria-hidden, puan
                          yaninda tek cumlelik sr-only metinle veriliyor.
                        */}
                        <span aria-hidden="true" className="pk-stars">
                          <span className="text-[var(--brand-primary)]">
                            {"★".repeat(rating)}
                          </span>
                          <span className="text-[var(--brand-ink-muted)] opacity-45">
                            {"☆".repeat(MAX_RATING - rating)}
                          </span>
                        </span>
                        <span className="sr-only">
                          {fill(t.testimonials.ratingLabel, {
                            rating: String(rating),
                          })}
                        </span>
                      </p>
                    ) : null}

                    <blockquote
                      className={`pk-quote text-pretty ${rating !== null ? "mt-4" : ""}`}
                    >
                      <p>{item.text}</p>
                    </blockquote>

                    <figcaption className="pk-meta mt-auto pt-5 text-[var(--brand-ink-muted)]">
                      {item.author}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
