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
                {/*
                  TELEFONDA ORTALANIR. Sayfanin tamami ortali bir duzen;
                  bu blok tek basina sola dayaliydi ve bolum basliginin
                  hemen altinda goz hizasini kiriyordu. Genis ekranda ise
                  sola dayali kalmali: orada puan solda, Google baglantisi
                  sagda, aralarindaki bosluk bilgiyi ayiriyor.
                */}
                <div className="mb-12 flex flex-col items-center gap-y-6 border-b border-[var(--brand-border)] pb-9 text-center sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-10 sm:text-start">
                  {/*
                    Telefonda UC SATIR: puan / yildizlar / etiket. Yan yana
                    dizildiginde "4,3" tek basina ~160px yiyor ve geriye kalan
                    yerde "GOOGLE PUANI · 7.568 DEĞERLENDİRME" iki satira
                    boluniyor, ikinci satir da ortalanmis olarak asili
                    kaliyordu. Alt alta gelince etiket tam genisligi buluyor
                    ve tek satirda okunuyor.
                  */}
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <p
                      className="brand-display text-[clamp(2.75rem,6vw,4.25rem)] leading-[0.9] font-black tracking-[-0.04em] tabular-nums"
                      dir="ltr"
                    >
                      {ratingText}
                    </p>
                    <div className="flex flex-col items-center gap-2 sm:items-start">
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
                      /*
                        Dokunma alani GORUNMEZ bir katmanla buyutuluyor
                        (`bo-tap`, bkz. tokens.css): metnin ust ve altina
                        10'ar piksel ekliyor, 25px'lik hedef 45px'e cikiyor.
                        Dolgu vermek olmazdi — alt cizgi bu tasarimin
                        baglanti isareti ve dolguyla metinden kopardi.
                      */
                      className="bo-tap inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[14px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
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
