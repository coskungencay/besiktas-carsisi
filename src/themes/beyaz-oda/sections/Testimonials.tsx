import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  isSectionShown,
  meta,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import {
  Stars,
  TestimonialsCarousel,
} from "@/themes/beyaz-oda/sections/TestimonialsCarousel";
import type { SectionProps } from "@/themes/types";

/**
 * Yorumlar — Google puan rozeti + karusel.
 *
 * ONCEKI HALI ve NEDEN DEGISTI: yorumlar menu satirlarinin aynisi bir liste
 * halinde alt alta duruyordu; sayfadaki diger uc listeyle (magazalar, galeri,
 * SSS) ayni ritimde oldugu icin goz onlari atliyordu. Yorum, carsiya
 * gitmemis birine "burasi nasil bir yer" diyen tek bolum — kendi bicimini
 * hak ediyor.
 *
 * Rozet ile karusel AYRI iki seyi anlatiyor:
 *   - rozet   : Google'daki GENEL puan (4,3 / 7.568 degerlendirme)
 *   - karusel : sitede gosterilmek uzere secilmis birkac yorum
 * Ikisini karistirmamak onemli; secilmis uc yorumun ortalamasini "Google
 * puani" diye sunmak yaniltici olurdu.
 */
export default function Testimonials({ content }: SectionProps) {
  if (!isSectionShown(content, "yorumlar")) return null;

  const { testimonials, googleRating, googleRatingCount, googleReviewsUrl, t } =
    content;

  /* Sayilar ziyaretcinin diliyle: tr'de "4,3" ve "7.568". */
  const ratingText =
    googleRating !== null ? googleRating.toLocaleString(content.locale) : "";
  const countText =
    googleRatingCount !== null
      ? googleRatingCount.toLocaleString(content.locale)
      : "";

  return (
    <section id="yorumlar" aria-labelledby="testimonials-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          <SectionIndex
            index={sectionIndex(content, "yorumlar")}
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          >
            {googleRating !== null ? (
              <Reveal>
                {/*
                  Rozet: buyuk puan / yildizlar / degerlendirme sayisi.
                  Tasarimda dolgulu kutu yok — blok, ustundeki kalin cizgiyle
                  ve genis bosluklarla ayriliyor.
                */}
                <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-[var(--brand-border)] pb-9">
                  <div className="flex items-center gap-5">
                    <p
                      className="brand-display text-[clamp(2.75rem,6vw,4.25rem)] leading-[0.9] font-black tracking-[-0.04em] tabular-nums"
                      dir="ltr"
                    >
                      {ratingText}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Stars
                        value={googleRating}
                        label={fill(t.testimonials.ratingLabel, { rating: ratingText })}
                      />
                      <p className={`${meta} brand-eyebrow`}>
                        {t.testimonials.googleLabel}
                        {countText
                          ? ` · ${fill(t.testimonials.ratingCount, { count: countText })}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {googleReviewsUrl ? (
                    <a
                      href={googleReviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[14px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                    >
                      <span>{t.testimonials.readOnGoogle}</span>
                      <ArrowIcon className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={0.1}>
              <TestimonialsCarousel items={testimonials} messages={t} dir={content.dir}
                reviewsUrl={googleReviewsUrl || undefined}
              />
            </Reveal>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
