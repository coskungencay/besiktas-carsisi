import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SectionTitle, shell, surface } from "@/themes/kirk-yil/parts";
import type { SectionProps, Testimonial } from "@/themes/types";

/** Puan gostergesinin bes basamagi. */
const STEPS = [0, 1, 2, 3, 4];

/**
 * Cerceveli alinti karti: ustte altin tirnak, ortada yorum, altta kucuk ve
 * genis harf arali imza. Tasarimin "soz" bolumunun aynisi; tek fark metnin
 * ortalanmis olmasi — bu temada hicbir sey kenara yaslanmaz.
 *
 * AYRI BILESEN: puanin null olmadigini map geri cagrisi icinde tasimak
 * gerekiyordu; prop olarak alinca daralma dogal yoldan korunuyor.
 */
function QuoteCard({
  item,
  ratingLabel,
}: {
  item: Testimonial;
  ratingLabel: string;
}) {
  const rating = item.rating;

  return (
    <figure className="brand-frame flex h-full flex-col bg-[var(--brand-surface-alt)] px-7 py-8 text-center sm:px-8 sm:py-9">
      {/*
        Buyuk tirnak isareti tasarimin imzasi: Abril'in kendi glifi, altin
        renkte. Noktalama oldugu icin sozlukte yeri yok, ekran okuyucuya da
        okutulmaz.
      */}
      <span
        aria-hidden="true"
        className="brand-display block text-[2.5rem] leading-[0.6] text-[var(--brand-accent)]"
      >
        &ldquo;
      </span>

      <blockquote className="ky-prose mt-4 flex-1 text-pretty">
        {item.text}
      </blockquote>

      {rating !== null ? (
        <p className="mt-6 flex items-center justify-center gap-2">
          {/*
            Yildiz YERINE ELMAS: yildiz bu tasarimin sozlugunde yok, ayracta ve
            muhurde kullanilan cevrilmis kare var. Dolusu verilen puan.
          */}
          <span aria-hidden="true" className="flex items-center gap-2">
            {STEPS.map((step) => (
              <span
                key={step}
                className={`size-1.5 rotate-45 border border-[var(--brand-accent)] ${
                  step < rating ? "bg-[var(--brand-accent)]" : ""
                }`}
              />
            ))}
          </span>

          {/* Isaretler aria-hidden; puan ekran okuyucuya bir kez, yazi olarak. */}
          <span className="sr-only">
            {fill(ratingLabel, { rating: String(rating) })}
          </span>
        </p>
      ) : null}

      {/* Imza satiri tasarimda 12-13px / .18em — kunye serit olcusu. */}
      <figcaption className="brand-body ky-strip mt-5 text-[var(--brand-ink-muted)]">
        {item.author}
      </figcaption>
    </figure>
  );
}

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
          <SectionTitle
            eyebrow={t.testimonials.eyebrow}
            title={t.testimonials.title}
            titleId="testimonials-title"
          />
        </Reveal>

        {/*
          Sabit kolonlu izgara DEGIL (bkz. Contact): iki yorum, uc kolonlu bir
          izgarada yana yaslanip simetriyi bozardi. Saran flex + justify-center
          ile kac yorum olursa olsun her satir ortada kalir.
        */}
        <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
          {testimonials.map((item, index) => (
            <Reveal
              key={item.id}
              as="li"
              // Tasarimdaki kademe ~100ms; ucuncuden sonra sabit kaliyor ki
              // uzun listelerde son kartlar gorunmek icin beklemesin.
              delay={Math.min(index, 2) * 0.08}
              className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <QuoteCard item={item} ratingLabel={t.testimonials.ratingLabel} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
