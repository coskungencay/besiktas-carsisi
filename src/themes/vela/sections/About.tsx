import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { paragraphs } from "@/themes/_shared/data";
import {
  balancedColumns,
  Hairline,
  label,
  proseSm,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimdaki "deneyim" bolumu: solda 280px genisliginde SADECE etiket ve
 * altinda kisa bir cizgi, sagda 1fr icerik. Aradaki 70px bosluk denge
 * bilerek bozuk tutuyor — simetri bu tasarimda "kurumsal" durur.
 *
 * Paragraflar numaralanmis kartlara donusuyor (01, 02, 03…): tasarimda ic
 * icerik boyle bolunmus. Numara serif ve altin, govde sans — kontrast temanin
 * ritmini kuruyor.
 *
 * NEDEN BURADA CALISMA SAATLERI YOK: tasarimda saatler kapanis (rezervasyon)
 * bolumunun orta kolonunda. Yedi satirlik bir tablo bu bolumu iki katina
 * cikariyor ve "az masa, cok ozen" ritmini bozuyordu. Saatler artik
 * Contact.tsx icinde.
 */
export default function About({ content }: SectionProps) {
  const { about, name, t } = content;
  if (!about) return null;

  const body = paragraphs(about);
  const cards = body.length > 0 ? body : [fill(t.about.placeholder, { name })];

  /*
   * Tasarimda uc kart var ve izgara tam doluyor. Kart sayisi icerikten
   * geldigi icin degisken; kolon sayisi ona gore secilir (bkz.
   * balancedColumns). Tek paragrafta izgara hic kurulmaz.
   */
  const columns = balancedColumns(cards.length);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} ${sectionTop}`}>
        <div className="grid gap-10 lg:grid-cols-[17.5rem_1fr] lg:gap-[4.375rem]">
          <Reveal>
            <p className={label}>{t.about.eyebrow}</p>
            <Hairline tone="gold" className="mt-4" />
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              {/* Tasarimda 38px / 1.4 — baslik degil, "acilis cumlesi" olcusu. */}
              <h2
                id="about-title"
                className="brand-display max-w-[62.5rem] text-[clamp(1.625rem,3.4vw,2.375rem)] leading-[1.4] tracking-[-0.005em] text-pretty"
              >
                {t.about.title}
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              {/* 58px ust bosluk ve 52px kolon araligi tasarimdan. */}
              <div
                className={`mt-[3.625rem] grid gap-x-[3.25rem] gap-y-12 ${columns}`}
              >
                {cards.map((paragraph, index) => (
                  <div key={index}>
                    <div className="brand-display text-[0.9375rem] tracking-[var(--brand-meta-tracking)] text-[var(--brand-primary)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    {/* Tasarimda ayrac 18px ust / 20px alt bosluk aliyor. */}
                    <Hairline className="mt-[1.125rem] mb-[1.25rem]" />
                    <p className={proseSm}>{paragraph}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
