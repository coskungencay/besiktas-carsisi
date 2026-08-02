import { Reveal } from "@/components/motion/Reveal";
import {
  SectionHeading,
  bodyText,
  column,
  shell,
  surface,
} from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dar bir kolonda, ince cizgilerle ayrilmis soru-cevap listesi.
 *
 * Menu'deki satir ritminin aynisi: kart yok, kutu yok; ayiran tek sey ust
 * kenarlik ve bosluk. Kolon `column` ile dar tutuluyor cunku bu tasarimda
 * uzun satirlar sakinligi bozuyor.
 *
 * <details>: acilip kapanma icin JavaScript gerekmiyor, klavye ve ekran
 * okuyucu davranisi tarayicidan geliyor, kapali cevap yine de HTML'de oldugu
 * icin arama motoru goruyor. Ucgen isareti .ya-faq ile gizlenip yerine
 * temanin ince cizgili arti/eksi isareti konuyor (bkz. tokens.css).
 */
export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHeading
            eyebrowText={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          />
        </Reveal>

        <Reveal delay={0.08}>
          {/* Alt kenarlik listeyi kapatir; satirlarin kendisi ust kenarlik tasir. */}
          <ul className={`${column} mt-12 border-b border-[var(--brand-border)]`}>
            {faq.map((item) => (
              <li
                key={item.id}
                className="border-t border-[var(--brand-border)]"
              >
                <details className="ya-faq">
                  <summary className="flex items-center justify-between gap-6 py-5 text-start">
                    {/* Menudeki urun adiyla ayni olcek: 15px, 300 agirlik. */}
                    <h3 className="brand-body text-[0.9375rem] font-light">
                      {item.question}
                    </h3>
                    <span aria-hidden="true" className="ya-faq-mark" />
                  </summary>

                  {/* Cevap sorunun altinda ayni kolonda; sag bosluk isaretin yerini korur. */}
                  <p className={`${bodyText} pb-6 pe-10`}>
                    {item.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
