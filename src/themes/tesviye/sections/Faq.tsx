import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import { paragraphs } from "@/themes/_shared/data";
import {
  Plate,
  bodyTextSm,
  edgeBottom,
  hair,
  mono,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Fiyat cetvelinin (Menu) kardesi: numarali satirlar, kalin cizgilerle
 * ayrilmis, soru adi urun adiyla ayni Anton olcusunde. Boylece SSS pafta
 * icinde ayri bir kutu gibi degil, ayni cetvelin devami gibi okunuyor.
 *
 * NEDEN <details>: acilir-kapanir davranis icin JavaScript gerekmiyor,
 * klavye ve ekran okuyucu destegi tarayicidan geliyor ve kapali cevap yine
 * de HTML ciktisinda oldugu icin arama motoru okuyabiliyor.
 */
export default function Faq({ content }: SectionProps) {
  if (!content.isVisible("sss")) return null;

  const { faq, t } = content;

  return (
    <section
      id="sss"
      aria-labelledby="faq-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={shell} style={edgeBottom}>
        <Reveal>
          <Plate
            code="05"
            eyebrow={t.faq.eyebrow}
            title={t.faq.title}
            titleId="faq-title"
          >
            {faq.map((item, index) => (
              <details
                key={item.id}
                /*
                 * Ayrac Menu ile AYNI ince cizgi: SSS tasarimda ayri bir kutu
                 * degil, fiyat cetvelinin devami gibi okunan bir liste.
                 */
                className={`group ${index > 0 ? hair : ""}`}
              >
                {/*
                 * list-none + ::-webkit-details-marker: tarayicinin varsayilan
                 * ucgeni bu tasarima yabanci; yerine sagdaki arti isareti var.
                 */}
                <summary className="flex cursor-pointer list-none items-baseline gap-4 px-4 py-[15px] transition-colors hover:bg-[var(--ts-row-hover)] sm:px-[18px] [&::-webkit-details-marker]:hidden">
                  {/* Sabit genislik: cevabin girintisi bu sutunla hizalaniyor. */}
                  <span
                    className={`${mono} w-7 shrink-0 tabular-nums text-[var(--brand-primary)]`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="brand-display min-w-0 flex-1 text-[length:var(--ts-item)] leading-[1.25] tracking-[0.01em] uppercase">
                    <Latin>{item.question}</Latin>
                  </span>

                  {/*
                   * Arti isareti acikken 45 derece donup carpiya donusuyor.
                   * Sadece gorsel: durumu ekran okuyucuya <details> zaten
                   * "genisletilmis/daraltilmis" olarak bildiriyor.
                   *
                   * inline-block sart: satir ici elemanda transform islemez.
                   */}
                  <span
                    className={`${mono} inline-block shrink-0 leading-none text-[var(--brand-primary)] transition-transform duration-200 group-open:rotate-45`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>

                {/*
                 * Cevap, numara sutunu (w-7) + bosluk (gap-4) kadar iceriden
                 * basliyor; boylece soru metniyle ayni hizada okunuyor.
                 * ps/ms mantiksal kenarlar: Arapca'da otomatik saga gecer.
                 */}
                <div
                  className={`${bodyTextSm} px-4 pb-[22px] text-[var(--brand-ink-muted)] sm:px-[18px] sm:ps-[calc(18px+1.75rem+1rem)]`}
                >
                  {paragraphs(item.answer).map((paragraph, pIndex) => (
                    <p key={pIndex} className={pIndex > 0 ? "mt-3" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
