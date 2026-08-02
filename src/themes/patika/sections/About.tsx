import { Reveal } from "@/components/motion/Reveal";
import { paragraphs } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Manifesto bloku: baslik ve altinda metin, baska hicbir sey.
 *
 * CALISMA SAATLERI BURADA DEGIL: tasarimda saatler sayfayi kapatan iletisim
 * blogunun orta kolonunda. Yedi gunluk cetvel burada dururken bolum metnin
 * iki katina cikiyor ve "hakkimizda" bir tarifeye donusuyordu. Saatler sayfada
 * TEK yerde: iletisim blogunun orta kolonunda.
 *
 * Metin yoksa bolum hic basilmaz (Header'daki capa linki de ayni kosula bakar).
 */
export default function About({ content }: SectionProps) {
  const { about, t } = content;
  if (!about) return null;

  const body = paragraphs(about);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead title={t.about.title} titleId="about-title" />

          <div className="pk-lead mt-10 flex max-w-[46rem] flex-col gap-5 text-pretty text-[var(--brand-ink-muted)]">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
