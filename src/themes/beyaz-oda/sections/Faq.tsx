import { Latin } from "@/components/site/Latin";
import { Reveal } from "@/components/motion/Reveal";
import {
  SectionIndex,
  isSectionShown,
  rowNumber,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sikca sorulanlar.
 *
 * <details>/<summary> kullaniliyor: JS gerekmez, klavyeyle acilir, arama
 * motoru cevabi HTML'de gorur. Tarayicinin uggen marker'i tokens.css'te
 * gizlendi; yerine iki hairline'dan cizilen "+" isareti var (.bo-plus) —
 * tasarimda ikon olmadigi icin isaret de cizgiden uretildi.
 *
 * Satir bicimi menu/yorumlar listeleriyle ayni: 36px indeks + metin + sagda
 * isaret, ince alt cizgi. Cevap acilinca soru hizasindan devam eder.
 */
export default function Faq({ content }: SectionProps) {
  if (!isSectionShown(content, "sss")) return null;

  const { faq, t } = content;

  return (
    <section id="sss" aria-labelledby="faq-title" className={surface}>
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          <SectionIndex index={sectionIndex(content, "sss")} eyebrow={t.faq.eyebrow}
            title={t.faq.title} titleId="faq-title">
            {/*
              KART BICIMI — onceden kenardan kenara duz cizgilerle ayrilan
              bir listeydi. Sayfadaki diger uc listeyle (magazalar, galeri,
              yorumlar) ayni ritimde oldugu icin goz ustunden geciyordu ve
              acilip kapanabildigi hic belli olmuyordu.

              Simdi her soru kendi kutusu: acikken cercevesi koyulasiyor ve
              zemini degisiyor, yani hangi sorunun acik oldugu bir bakista
              gorunuyor. Kutular ORTALANMIS ama dar bir sutunda degil —
              iki kolona yayiliyor ki bolum sayfanin genisligini kullansin.
            */}
            <ul className="mx-auto grid max-w-[76rem] gap-4 lg:grid-cols-2 lg:gap-5">
              {faq.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    variant="scale"
                    delay={Math.min(index, 5) * 0.05}
                  >
                    <details className="bo-faq group h-full border border-[var(--brand-border)] px-6 py-5 transition-colors duration-300 open:border-[var(--brand-ink)] open:bg-[var(--brand-surface-alt)] sm:px-7 sm:py-6">
                      {/*
                        summary'nin icerigi TEK bir baslik elemani: HTML
                        summary'de ya duz metin ya da tek bir baslik kabul
                        ediyor. Bu yuzden izgarayi h3 tasiyor.
                      */}
                      <summary className="bo-summary transition-colors hover:text-[var(--brand-accent)]">
                        <h3 className="grid grid-cols-[28px_minmax(0,1fr)_11px] items-baseline gap-x-4 sm:gap-x-5">
                          <span className={rowNumber} aria-hidden="true">
                            {number}
                          </span>

                          <span className="bo-title text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-[1.32] text-pretty">
                            <Latin>{item.question}</Latin>
                          </span>

                          {/*
                            Isaret baslikla ayni satirda dursun diye kucuk bir
                            ust bosluk; 1px cizgide baseline hizasi calismiyor.
                          */}
                          <span className="bo-plus mt-[7px]" aria-hidden="true" />
                        </h3>
                      </summary>

                      {/* Cevap sorunun metin hizasindan basliyor (28+16px). */}
                      <div className="bo-answer pt-4 ps-[44px] sm:ps-[48px]">
                        <p className="text-[14.5px] leading-[1.8] text-pretty text-[var(--brand-ink-soft)]">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  </Reveal>
                );
              })}
            </ul>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
