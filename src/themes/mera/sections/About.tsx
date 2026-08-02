import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { paragraphs } from "@/themes/_shared/data";
import {
  SectionHead,
  bodyText,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi yazisi duzeni: tasarimdaki gibi metin UC ince kolona bolunur
 * (15px / 1.7), ilk paragraf "drop cap" ile acilir.
 *
 * BURADA CALISMA SAATLERI YOK. Tasarimda saatler kapanis (iletisim) bolumunun
 * orta kolonunda duruyor; yedi satirlik dokum bu yazi bolumunun ortasina
 * konuldugunda bolumu iki katina cikariyor ve dergi yazisinin akisini
 * kesiyordu. Tek yer: Contact.
 *
 * Paragraf sayisi kolon sayisini belirler: tek paragrafi uc kolona bolmek
 * sayfayi bos gosterirdi, bu yuzden az metinde izgara daralir.
 *
 * Drop cap sadece LTR'de: Arapca'da ilk harfi buyutup ayirmak kelimenin
 * bitisik yazimini bozar.
 */
export default function About({ content }: SectionProps) {
  const { about, name, t } = content;
  // Metin yoksa bolum hic basilmaz: saatler artik kapanis bolumunde oldugu
  // icin geriye gosterilecek bir sey kalmiyor.
  if (!about) return null;

  const body = paragraphs(about);

  const columns =
    body.length >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : body.length === 2
        ? "sm:grid-cols-2"
        : "max-w-[620px]";

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${page} ${sectionPad}`}>
        <Reveal>
          <SectionHead
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            titleId="about-title"
          >
            <Reveal delay={0.08}>
              {body.length > 0 ? (
                <div className={`grid gap-10 ${columns}`}>
                  {body.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? `${bodyText} ltr:first-letter:float-start ltr:first-letter:mt-1.5 ltr:first-letter:pe-2.5 ltr:first-letter:text-[2.9em] ltr:first-letter:leading-[0.8] ltr:first-letter:text-[var(--brand-primary)] ltr:first-letter:brand-display`
                          : bodyText
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className={`${bodyText} max-w-[620px]`}>
                  {fill(t.about.placeholder, { name })}
                </p>
              )}
            </Reveal>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
