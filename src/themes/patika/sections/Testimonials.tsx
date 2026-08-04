import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Tasarimdaki yildiz dizisi hep bes haneli; eksikler bos yildizla tamamlanir. */
const MAX_RATING = 5;

/**
 * "Dedikodu" panosu: tasarimda uc kolonlu, 20px yuvarlak, 2px cerceveli kartlar.
 *
 * KART ZEMINI YOK — menu kartlarindan ayrilan tek nokta bu. Tasarimda yorum
 * kartlari yalnizca cerceve; icleri koyu zeminle doldurulsaydi menu izgarasinin
 * tekrari gibi okunur, iki bolum birbirine karisirdi. TEK ISTISNA ucuncu kart:
 * tasarimda dolu turuncu ve diziyi kiran vurgu odur.
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
        {/*
          BASLIK GORUNMEZ. Tasarimda bu bolum bastan asagi kartlardan ibaret:
          ustunde ne etiket ne baslik var. Yildizlar, alintilar ve imzalar
          bolumun ne oldugunu zaten soyluyor; bir baslik daha koymak sayfanin
          "tek dev baslik menude" hiyerarsisini bozuyordu. Baslik yine de
          isaretlemede duruyor — bolumun ekran okuyucudaki adi ve sayfa anahat
          yapisi bozulmasin diye.
        */}
        <h2 id="testimonials-title" className="sr-only">
          {t.testimonials.title}
        </h2>

        <Reveal delay={0.08}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => {
              /*
               * Ucuncu kart DOLU TURUNCU — tasarimin imzasi. Uc kolonlu
               * izgarada birbirinin ayni uc cerceve sirali bir liste gibi
               * okunuyordu; diziyi kiran tek renk blok bolume afis karakterini
               * veriyor. Ucuncu sira: ilk satirin sonu, yani gozun dinlendigi
               * yer. Sonraki satirlar yeniden cerceve olarak devam eder ki
               * vurgu tekrarlayip siradanlasmasin.
               */
              const isAccent = index === 2;
              /* Panelden bozuk bir puan gelirse izgarayi bozmasin diye kirpilir. */
              const rating =
                item.rating === null
                  ? null
                  : Math.min(MAX_RATING, Math.max(0, Math.round(item.rating)));

              return (
                <li
                  key={item.id}
                  className={`flex flex-col p-[1.875rem] transition-colors ${
                    isAccent
                      ? "rounded-[var(--brand-radius)] bg-[var(--brand-accent)] text-[var(--brand-primary-contrast)]"
                      : "brand-frame hover:border-[var(--brand-primary)]"
                  }`}
                >
                  <figure className="flex flex-1 flex-col">
                    {rating !== null ? (
                      <p>
                        {/*
                          Yildizlar SADECE gorsel: ekran okuyucu "yildiz yildiz
                          yildiz" diye tek tek okumasin diye aria-hidden, puan
                          yaninda tek cumlelik sr-only metinle veriliyor.

                          Dolu turuncu kartta yildiz NEON KALAMAZ (turuncu
                          uzeri lime okunmuyor); orada murekkep rengine duser,
                          bos yildizlar opaklikla ayrilir.
                        */}
                        <span aria-hidden="true" className="pk-stars">
                          <span
                            className={
                              isAccent
                                ? "text-[var(--brand-primary-contrast)]"
                                : "text-[var(--brand-primary)]"
                            }
                          >
                            {"★".repeat(rating)}
                          </span>
                          <span
                            className={
                              isAccent
                                ? "text-[var(--brand-primary-contrast)] opacity-35"
                                : "text-[var(--brand-ink-muted)] opacity-45"
                            }
                          >
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

                    {/*
                      Imza satiri tasarimda 12px / 400 / .14em ve govde
                      metninden bir kademe soluk (#8C8A80): kunye satiriyla
                      (11px/500/.16em) ayni degil, o yuzden kendi sinifi var.
                    */}
                    <figcaption
                      className={`pk-attr mt-auto pt-5 ${
                        isAccent ? "opacity-70" : "text-[var(--brand-ink-dim)]"
                      }`}
                    >
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
