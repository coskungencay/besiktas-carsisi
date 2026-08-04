import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHead,
  metaText,
  shell,
  soft,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tezgaha birakilmis komsu notlari.
 *
 * Menu ve galeri gibi bir "vitrin" bolumu oldugu icin baslik kucuk olcekte
 * (size="md"). Hiza sol kenardan: tasarimda ortalanmis metin hic yok.
 *
 * Tasarimin tekrar eden bir hamlesi var: bir izgarada hucrelerden BIRI dolu
 * zemine donuyor (firin saatleri seridinde 3. kart marka renginde, "biz"
 * seridinde ortadaki kart koyu). Ayni el burada da surduruluyor — ikinci kart
 * firinin agzi gibi koyu. Grid basina tek vurgu; her karti boyamak tasarimi
 * satranc tahtasina cevirirdi.
 */
export default function Testimonials({ content }: SectionProps) {
  // Musteri panelden kapatmis ya da hic yorum yoksa bolum hic basilmaz.
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  return (
    <section id="yorumlar" aria-labelledby="testimonials-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
            size="md"
          />
        </Reveal>

        {/* Galeri ile ayni ritim: baslik ile izgara arasi 40px (tasarimdaki
            deger), Tailwind varsayilani 48px degil. */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            // Vurgulu hucre: tasarimdaki gibi izgarada tek bir koyu kart.
            const dark = index === 1;

            return (
              <Reveal
                key={item.id}
                as="li"
                delay={index === 0 ? 0 : 0.06}
                className={
                  dark
                    ? "brand-rounded flex h-full flex-col justify-between bg-[var(--brand-ink)] p-6 text-[var(--brand-on-ink)] sm:p-8"
                    : `${soft} flex h-full flex-col justify-between p-6 sm:p-8`
                }
              >
                <div>
                  {item.rating !== null ? (
                    <p className="flex items-center gap-1.5">
                      {/*
                        Yildizlar SUSLEME: ekran okuyucuya "yildiz yildiz
                        yildiz" diye tekrarlanmasin diye gizli, yaninda tek
                        satirlik okunabilir karsiligi duruyor.
                      */}
                      <span aria-hidden="true" className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((step) => (
                          <StarMark
                            key={step}
                            filled={step <= Math.round(item.rating ?? 0)}
                            dark={dark}
                          />
                        ))}
                      </span>
                      <span className="sr-only">
                        {fill(t.testimonials.ratingLabel, {
                          rating: String(item.rating),
                        })}
                      </span>
                    </p>
                  ) : null}

                  {/*
                    Alintinin kendisi slab ve italik: hero'daki not kagidiyla
                    ayni ses — el yazisi gibi, govde metninden ayrilsin diye.
                  */}
                  <blockquote
                    className={`brand-display mt-5 text-[length:var(--brand-lead)] leading-[var(--brand-lead-leading)] italic text-pretty ${
                      dark
                        ? "text-[var(--brand-on-ink)]"
                        : "text-[var(--brand-ink-soft)]"
                    }`}
                  >
                    {item.text}
                  </blockquote>
                </div>

                {item.author ? (
                  <p
                    className={
                      dark
                        ? "brand-body brand-eyebrow mt-6 text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-on-ink-eyebrow)]"
                        : `${metaText} mt-6`
                    }
                  >
                    <Latin>{item.author}</Latin>
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Tek yildiz. Ikonu _shared/icons.tsx yerine burada ciziyoruz: bu bicim
 * (yuvarlak uclu, dolu/bos ayrimi olan) yalnizca bu temanin yorum kartlarinda
 * kullaniliyor, ortak katmana tasimak digerlerini baglardi.
 */
function StarMark({ filled, dark }: { filled: boolean; dark: boolean }) {
  const tone = dark
    ? filled
      ? "text-[var(--brand-on-ink-eyebrow)]"
      : "text-[var(--brand-on-ink-hairline)]"
    : filled
      ? "text-[var(--brand-accent)]"
      : "text-[var(--brand-hairline-soft)]";

  return (
    <svg viewBox="0 0 24 24" className={`size-3.5 ${tone}`} fill="currentColor">
      <path d="M12 2.6l2.66 6.03 6.55.55-4.97 4.31 1.5 6.4L12 16.44 6.26 19.9l1.5-6.4-4.97-4.32 6.55-.55L12 2.6z" />
    </svg>
  );
}
