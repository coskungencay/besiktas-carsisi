import Image from "next/image";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  highlightsOrDerived,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { meta, shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin imzasi: solda "— 00" indeksi, iki tonlu 60px baslik, soldan saga
 * cizilen ince ayrac, altinda uc kolon (metin / kunye / adres), en altta
 * kenardan kenara gorsel bandi.
 *
 * Acilis animasyonu Reveal ile DEGIL, tokens.css'teki CSS keyframe'leriyle
 * yapiliyor (bo-fade-2 / bo-up / bo-rule / bo-up-2). NEDEN: hero ilk ekranda;
 * scroll bekleyen bir gozlemci burada gec kalir, sunucudan gelen HTML aninda
 * animasyona baslamali. Ayrica ayracin "cizilme" hareketi scaleX gerektiriyor,
 * Reveal bunu vermiyor.
 *
 * Baslik `heroHeadline`ten gelir; musteri panelde bos biraktiysa icerik katmani
 * isletme adini koyar, yani burada asla bos olmaz.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, about, contact, heroImageUrl, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Hero'nun sol alt kolonu: tasarimda mekani anlatan kisa bir paragraf var,
   * slogan degil. "Hakkimizda"nin ilk paragrafini kullaniyoruz. paragraphs()
   * bos satirlari da eliyor; ham split bastaki bos paragrafi geri verirdi.
   */
  const intro = paragraphs(about)[0] ?? content.tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      <div className={`${shell} pt-20 pb-24 sm:pt-[150px] sm:pb-[130px]`}>
        <div className="grid gap-6 lg:grid-cols-12">
          <p
            className="bo-index bo-fade-2 tracking-[0.04em] lg:col-span-2"
            aria-hidden="true"
          >
            — 00
          </p>

          <div className="lg:col-span-8 lg:col-start-3">
            <h1
              id="hero-title"
              className="bo-up brand-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.18] tracking-[-0.025em] text-balance"
            >
              {heroHeadline}
              {heroSubline ? (
                /*
                 * Tasarimda soluk devam KENDI satirinda basliyor; ayni satirda
                 * akmasi basligin iki tonlu ritmini bozuyor. block + bosluk
                 * yerine satir kirilmasi kullaniliyor ki metin uzunlugu
                 * degistiginde de ayni kalsin.
                 */
                <span className="block text-[var(--brand-ink-faint)]">
                  {heroSubline}
                </span>
              ) : null}
            </h1>

            {/* Tasarimda bu cizgi koyu (ink) ve soldan saga cizilir. */}
            <div className="bo-rule mt-10 mb-[30px] h-px bg-[var(--brand-ink)] sm:mt-16" />

            {/*
              Taban satiri. Tasarimdaki 8 kolonluk alt izgara YALNIZCA genis
              ekranda acilir (ust izgara da lg'de aciliyor). sm'de acilsaydi
              640-1024 arasi paragraf 3/8'lik ~230px'lik bir seride sikisir,
              mono kunye satirlari ("SAAT · 08—18") ikiye bolunurdu.

              Kolon baslangiclari (col-start) acikca yazili: musteri panelde
              tanitim yazisini ya da kunyeleri bos birakirsa adres kolonu sola
              kayar ve tasarimin sag kenara dayali dengesi bozulurdu.
            */}
            <div className="bo-up-2 grid gap-6 lg:grid-cols-8">
              {intro ? (
                <p className="text-[15px] leading-[1.72] text-pretty text-[var(--brand-ink-soft)] lg:col-span-3">
                  {intro}
                </p>
              ) : null}

              {highlights.length > 0 ? (
                <dl className={`${meta} leading-[2] lg:col-span-2 lg:col-start-4`}>
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-baseline gap-2">
                      <dt className="brand-eyebrow">{highlight.label}</dt>
                      {highlight.label && highlight.value ? (
                        <span aria-hidden="true">·</span>
                      ) : null}
                      {/*
                        Deger de etiketle ayni sonuk tonda: tasarimda hero'nun
                        kunye blogu bastan sona tek renk. Koyu (ink) deger
                        "hakkimizda" bolumundeki tablo bicimidir, burasi degil.
                      */}
                      <dd>{highlight.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {contact.address ? (
                /*
                  Adres kolonu tasarimda sag alta yaslidir. lg:text-end EK olarak
                  gerekli: tasarimdaki adres tek satir oldugu icin hizalama orada
                  gorunmez, ama panelden gelen uzun adresler bu 3/8'lik kolonda
                  iki satira duser ve ikinci satir sola kacardi.
                */
                <div className="flex items-end justify-start lg:col-span-3 lg:col-start-6 lg:justify-end">
                  <a
                    href={contact.mapsUrl || "#iletisim"}
                    {...(contact.mapsUrl
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] lg:text-end"
                  >
                    <span className="text-pretty">{contact.address}</span>
                    <ArrowIcon className="size-3.5" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/*
        Gorsel bandi kenardan kenara: tasarimda sayfanin alt sinirini o cizer.

        Paylasilan Reveal BILEREK kullanilmiyor: o, opacity yaninda 16px dikey
        kayma da uyguluyor ve bant asagidan gelirken hero ile arasinda anlik
        beyaz bir aciklik olusuyordu. Tasarimda bant YALNIZCA opaklikla beliriyor
        (transition:opacity 1.3s). Ayrica bant ilk ekranin alt sinirinda duruyor,
        yani scroll gozlemcisi zaten aninda tetikleniyordu; hero'nun geri kalani
        gibi CSS keyframe'i kullanmak hem tasarima hem bolumun kendi ritmine
        sadik kaliyor.
      */}
      <div className="bo-fade-band relative h-[320px] w-full bg-[var(--brand-surface-alt)] sm:h-[520px]">
        <Image
          src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
          alt={fill(t.hero.coverAlt, { name })}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
