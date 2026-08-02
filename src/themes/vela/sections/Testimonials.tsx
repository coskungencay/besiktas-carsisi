import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  balancedColumns,
  Hairline,
  metaMuted,
  SectionHead,
  StarIcon,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Yorumlar, "deneyim" bolumundeki numarali kartlarin ayni izgarasini
 * kullanir: ustte kucuk altin bir isaret (orada 01/02/03, burada yildizlar),
 * altinda sac teli ayrac, sonra metin. Ayni ritim tekrar ettigi icin bolum
 * sayfaya sonradan eklenmis gibi durmuyor.
 *
 * Alinti metni SERIF: bu tasarimda serif "insan sesi", sans ise aciklama.
 * Yorumun kendisi bir cumle degil bir ses oldugu icin baslik ailesinde.
 *
 * Kart cercevesi yok — Vela'da ayirici her zaman bosluk ve tek bir cizgi.
 */
export default function Testimonials({ content }: SectionProps) {
  if (!content.isVisible("yorumlar")) return null;

  const { testimonials, t } = content;

  /*
   * Kolon sayisi yorum sayisina gore ("deneyim" bolumundeki kural ile ayni,
   * bkz. balancedColumns): sabit uc kolon 1 ya da 2 yorumda satiri yarim
   * birakiyordu.
   */
  const columns = balancedColumns(testimonials.length);

  return (
    <section id="yorumlar" aria-labelledby="testimonials-title" className={surface}>
      <div className={`${shell} ${sectionTop}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          />
        </Reveal>

        <Reveal delay={0.14}>
          {/* 58px ust bosluk, 52px kolon araligi — "deneyim" bolumuyle ayni. */}
          <ul
            className={`mt-[3.625rem] grid gap-x-[3.25rem] gap-y-12 ${columns}`}
          >
            {testimonials.map((item) => {
              /*
               * Puan panelden serbest sayi olarak gelebilir; cizim her zaman
               * 0-5 arasi tam sayi olmali yoksa yildiz sayisi tasar.
               */
              const stars =
                item.rating === null
                  ? 0
                  : Math.max(0, Math.min(5, Math.round(item.rating)));

              return (
                <li key={item.id}>
                  <figure>
                    {stars > 0 ? (
                      <div className="flex items-center gap-[0.3125rem] text-[var(--brand-primary)]">
                        {/*
                         * Yildizlar SUS: ekran okuyucu bunlari tek tek
                         * okumasin diye aria-hidden, puan ise yaninda tek bir
                         * cumle olarak veriliyor.
                         */}
                        {[1, 2, 3, 4, 5].map((step) => (
                          <StarIcon key={step} filled={step <= stars} />
                        ))}
                        {/*
                         * Okunan sayi CIZILEN yildizla ayni olmali: ham puan
                         * degil, yukarida kirpilmis deger veriliyor. Aksi
                         * halde bozuk bir kayit "7 / 5 yildiz" dedirtebilir.
                         */}
                        <span className="sr-only">
                          {fill(t.testimonials.ratingLabel, {
                            rating: String(stars),
                          })}
                        </span>
                      </div>
                    ) : null}

                    {/* Ayrac tasarimda 18px ust / 20px alt bosluk aliyor. */}
                    <Hairline
                      className={`mb-[1.25rem] ${stars > 0 ? "mt-[1.125rem]" : ""}`}
                    />

                    <blockquote className="brand-display text-[1.3125rem] leading-[1.5] text-pretty">
                      {item.text}
                    </blockquote>

                    <figcaption className={`${metaMuted} mt-6`}>
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
