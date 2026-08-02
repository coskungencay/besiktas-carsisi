import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import {
  SectionHeading,
  bodyText,
  shell,
  surface,
} from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Iki kolonlu hikaye: SOLDA kemerli fotograf, SAGDA etiket + baslik +
 * paragraflar.
 *
 * NEDEN ORTALI DEGIL: tasarimda bu bolum .85fr / 1fr'lik asimetrik bir izgara
 * ve 80px bosluk. DAR olan kolon (.85fr) fotograf, GENIS olan (1fr) metnin
 * tamami — baslik da metinle ayni kolonda ve sola dayali. Basligi tek basina
 * sol kolona koymak izgara oranini tutturur ama tasarimin agirlik dagilimini
 * ters cevirirdi: bu bolum yarisi gorsel bir bolum.
 *
 * GORSEL: panelde ayri bir "hikaye gorseli" alani yok, kapak gorseli
 * kullaniliyor (Kirk Yil'da da ayni cozum). Musteri gorsel yuklemediyse yer
 * tutucu kemerde durur, kolon bos kalmaz.
 *
 * CALISMA SAATLERI BURADA DEGIL: tasarimda saatler "ziyaret" bolumunun
 * kartinda. Yedi satirlik tablo hikayenin ortasindayken bu bolumu iki katina
 * cikariyor ve okuma akisini kesiyordu; artik Iletisim bolumunde.
 */
export default function About({ content }: SectionProps) {
  const { about, heroImageUrl, name, openingHours, t } = content;
  /*
   * Gorunurluk kosulu DEGISMEDI: saatler artik baska bolumde bassa da, hic
   * icerik yokken bolum yine hic basilmaz (Header'daki nav linki ayni kosulu
   * kullaniyor).
   */
  if (!about && openingHours.length === 0) return null;

  const body = paragraphs(about);

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-20">
          <Reveal>
            {/*
              Tasarimda kutu 520px yuksekliginde ve kolon ~577px genisliginde:
              yani hafif YATAY (10/9), dikey degil. Kemer yaricapi da bu orandan
              geliyor (260px = yuksekligin yarisi), o yuzden galerinin kemeriyle
              ayni sinif kullaniliyor.
            */}
            <div className="ya-arch-sm relative aspect-[4/5] w-full overflow-hidden bg-[var(--brand-surface-alt)] sm:aspect-[10/9]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <SectionHeading
              eyebrowText={t.about.eyebrow}
              title={t.about.title}
              titleId="about-title"
              align="start"
            />

            {/*
              Tasarimda paragraf kolonu 520px'i asmiyor ve ritmi 16px / 1.8,
              paragraf arasi 20px. Genis ekranda satirlar bu siniri asinca
              metin duvara donusuyordu.
            */}
            <div className={`${bodyText} mt-6 flex max-w-[32.5rem] flex-col gap-5`}>
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
