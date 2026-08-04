import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHeading,
  Sprig,
  eyebrow,
  shell,
  surface,
} from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/** Yildiz sayisi 1-5 disina tasarsa izgara bozulmasin diye siniri burada tutuyoruz. */
const MAX_RATING = 5;

/**
 * Ortalanmis alinti kartlari.
 *
 * Yorum metni italik serif: bu tasarimda "fisilti" tonundaki her satir
 * (hero'nun ikinci satiri, menu kategorileri, footer'in kapanisi) ayni eli
 * kullaniyor. Kart cercevesi Iletisim'deki bilgi panelinin aynisi: dolgusuz,
 * ince kenarlikli. Yazar adiyla alinti arasinda temanin botanik ayraci durur.
 *
 * PUAN: yildiz yerine ayractaki yaprak (45 derece dondurulmus kare) tekrar
 * ediliyor; boylece puan da temanin kendi isaretiyle okunuyor.
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
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          {/*
            items-stretch + h-full: yan yana kartlarin kenarliklari ayni boyda
            bitsin. Izgara galerinin genisligiyle AYNI: onceki max-w-5xl siniri
            ayni sayfada kah kenardan kenara (galeri) kah ortalanmis dar
            (yorumlar) iki farkli ritim uretiyordu.
          */}
          <ul className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 sm:gap-[1.375rem] lg:grid-cols-3">
            {testimonials.map((item) => {
              /*
               * Panelden gelen puan tam sayi olmayabilir; hem yuvarlanip hem
               * 0-5 arasina sikistiriliyor ki dizi uzunlugu her zaman tutsun.
               */
              const stars =
                item.rating === null
                  ? null
                  : Math.max(0, Math.min(MAX_RATING, Math.round(item.rating)));

              return (
                <li key={item.id} className="h-full">
                  <figure className="brand-frame flex h-full flex-col px-8 py-9 text-center">
                    {/* Tasarimdaki italik serif fisilti olcegi: 17-19px. */}
                    <blockquote className="brand-display ya-serif-book text-[1.0625rem] leading-[1.7] text-pretty italic sm:text-[1.1875rem]">
                      {item.text}
                    </blockquote>

                    {/* mt-auto: alinti kisa olsa da imza kartin dibine oturur. */}
                    <Sprig className="mt-auto pt-7" />

                    <figcaption className="mt-6">
                      <span className={eyebrow}><Latin>{item.author}</Latin></span>

                      {stars !== null ? (
                        <span className="mt-3 flex items-center justify-center gap-1.5">
                          {/*
                           * Yapraklar yalnizca gorsel: ekran okuyucu ayni puani
                           * iki kez okumasin diye isaretler gizli, metin sr-only.
                           */}
                          <span
                            aria-hidden="true"
                            className="flex items-center gap-1.5"
                          >
                            {Array.from({ length: MAX_RATING }, (_, index) => (
                              <span
                                key={index}
                                className={`size-1.5 rotate-45 ${
                                  index < stars
                                    ? "bg-[var(--brand-accent)]"
                                    : "bg-[var(--brand-border)]"
                                }`}
                              />
                            ))}
                          </span>
                          <span className="sr-only">
                            {fill(t.testimonials.ratingLabel, {
                              rating: String(stars),
                            })}
                          </span>
                        </span>
                      ) : null}
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
