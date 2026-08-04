import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHead,
  labelFaint,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/** Puanin gorsel karsiligi: bes kutucuk. */
const MARKS = [1, 2, 3, 4, 5];

/**
 * Dergi "okur mektuplari" sayfasi: yorumlar menudeki gibi iki kolona bolunur,
 * her biri kendi ince cizgisiyle acilir. Alinti metni serif ve italik (menu
 * kategori adlari ile ayni el), imza ise fotograf altyazisiyla ayni soluk,
 * genis araliklı kunye seridi.
 *
 * Puan yildiz simgesiyle degil, bes kucuk kutucukla veriliyor: temanin
 * radius'u 0 ve gorsel sozlugu "cizgi + damga" — yildiz burada yabanci bir
 * simge olurdu. Ayni damga konum bolumundeki harita isaretcisinde tekrar eder.
 *
 * Kutucuklar aria-hidden: ekran okuyucuya bes bos kutu okutmak yerine yaninda
 * sr-only olarak "{rating} / 5 yildiz" metni veriliyor.
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
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          >
            {/* Menu ile ayni kolon araligi (72px): iki bolum alt alta
                geldiginde ayni dikey ritmi surdursun. */}
            <ul className="grid gap-x-[4.5rem] gap-y-11 lg:grid-cols-2">
              {testimonials.map((item, index) => (
                <Reveal
                  key={item.id}
                  as="li"
                  delay={index < 2 ? 0.08 : 0.16}
                  className="border-t border-[var(--mera-rule)] pt-6"
                >
                  <figure>
                    {item.rating !== null ? (
                      <p className="mb-5 flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="flex items-center gap-1.5"
                        >
                          {MARKS.map((mark) => (
                            <span
                              key={mark}
                              className={`size-[7px] ${
                                mark <= item.rating!
                                  ? "bg-[var(--brand-primary)]"
                                  : "bg-[var(--brand-border)]"
                              }`}
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

                    {/* mera-regular: bu tasarimda 300 agirlik yalnizca dev
                        basliklara ait; bagimsiz duran italik serif metinler
                        (menu kategorileri, mekan notu) 400. */}
                    <blockquote className="brand-display mera-regular text-[1.1875rem] leading-[1.55] text-pretty italic text-[var(--brand-ink-body)] rtl:not-italic">
                      {item.text}
                    </blockquote>

                    <figcaption className={`${labelFaint} mt-5`}>
                      <Latin>{item.author}</Latin>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
