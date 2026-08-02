import Image from "next/image";

import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  highlightsOrDerived,
  imageOrFallback,
  paragraphs,
} from "@/themes/_shared/data";
import {
  Hairline,
  RuleRow,
  labelAccent,
  labelFaint,
  page,
  surface,
} from "@/themes/mera/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Dergi ic sayfasi acilisi — ASIMETRIK (tasarimda 1.15fr / .85fr).
 *
 * Sol genis kolon: kunye satiri, dev serif baslik, cizgi, altinda iki kolona
 * bolunmus giris metni + kunye degerleri. Sag dar kolon: neredeyse kare
 * (10:11) bir fotograf ve altinda kucuk altyazi seridi.
 *
 * NEDEN <Reveal> YOK: tasarimda hero scroll ile degil, sayfa acilir acilmaz
 * kademeli olarak giriyor. Bunlar tokens.css'teki saf CSS acilis
 * animasyonlari (mera-*); JS beklemedigi icin ilk boyamada baslarlar ve
 * Reveal ile birlestirilirse cift animasyon olusurdu.
 *
 * NEDEN HERO'DA BUTON YOK: tasarimda hero'da hicbir buton/link yok — dergi
 * kapagi gibi yalnizca tipografi var, menuye ust cubuktaki nav goturuyor.
 */
export default function Hero({ content }: SectionProps) {
  const {
    heroHeadline,
    heroSubline,
    about,
    heroImageUrl,
    name,
    tagline,
    contact,
    t,
  } = content;

  const highlights = highlightsOrDerived(content);

  /* Kunye satiri: tasarimda KISA bir konum; semt yoksa slogana duseriz. */
  const eyebrow = contact.locality || tagline;
  /*
   * Sol kolonun metni: hakkimizda'nin ilk paragrafi, yoksa slogan. Slogan
   * zaten kunye satirina dusmusse burada tekrar edilmez — ayni cumle ust
   * uste iki kez basilirsa dergi acilisi "bos icerik" gibi gorunur.
   */
  const intro = paragraphs(about)[0] ?? (eyebrow === tagline ? "" : tagline);

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/* Hero'nun ALT dolgusu YOK. Tasarimda bolumler yalnizca ust dolgu
          kullanir; buraya ayrica pb eklemek hero ile ilk ayirici cizgi arasini
          tasarimdaki 132px'ten iki katina cikariyordu. */}
      <div className={page}>
        <div className="grid items-end gap-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-[4.75rem]">
          <div className="min-w-0">
            {/* Tasarimda bu satir KISA bir kunye ("Kurulus 2016 - Alacati"):
                mekanin nerede oldugunu soyler. Uzun slogan bu 11.5px'lik
                .28em araliki satirda dev basligin ustundeki gerilimi bozar,
                bu yuzden once semt gelir. */}
            {eyebrow ? (
              <p
                className={`${labelAccent} mera-wide mera-fade-eyebrow mb-[1.875rem]`}
              >
                {eyebrow}
              </p>
            ) : null}

            <h1
              id="hero-title"
              className="brand-display mera-up text-[clamp(2.6rem,7.2vw,6.5rem)] leading-[0.94] tracking-[-0.02em] text-balance"
            >
              {heroHeadline}

              {/* Tasarimin imzasi: basligin ikinci satiri AYNI puntoda ama
                  italik ve marka renginde. Panelde baslik tek satirlik bir
                  alan oldugu icin ikinci rengi "baslik devami" alanindan
                  aliyoruz; boylece musteri kendi metnini yazdiginda da iki
                  tonlu ritim korunuyor.
                  rtl:not-italic — Arapca'da egik serif okunaksiz. */}
              {heroSubline ? (
                <span className="block italic text-[var(--brand-primary)] rtl:not-italic">
                  {heroSubline}
                </span>
              ) : null}
            </h1>

            {/* mera-line: cizgi baslangic kenarindan cekilerek cizilir. */}
            <Hairline className="mera-line mt-11 mb-[1.625rem]" />

            <div className="mera-up-late grid max-w-[620px] gap-10 sm:grid-cols-2">
              {intro ? (
                <p className="text-[0.97rem] leading-[1.65] text-pretty text-[var(--brand-ink-body)]">
                  {intro}
                </p>
              ) : null}

              {highlights.length > 0 ? (
                <dl className="flex flex-col gap-3.5">
                  {highlights.map((highlight, index) => (
                    <RuleRow key={index} term={highlight.label}>
                      {highlight.value}
                    </RuleRow>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>

          <div className="mera-fade-figure min-w-0">
            {/* Oran tasarimdan turetildi: 1440px'de dar kolon ~537px genis,
                gorsel 560px yuksek. Sabit yukseklik yerine oran kullaniliyor
                ki dar ekranda kolon daralinca gorsel de kucululsun. */}
            <div className="relative aspect-[24/25] w-full bg-[var(--brand-surface-alt)]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="object-cover"
              />
            </div>

            {/* Altyazi seridi: tasarimda iki parcali — baslangicta levha
                numarasi ("Fig. 01"), sonda fotografin kunyesi. Numara
                SOZLUKTEN GELMEZ cunku metin degil, dergi levhasi isareti:
                yalnizca rakam basiliyor (her dilde ayni okunur) ve ekran
                okuyuculardan gizleniyor. dir="ltr" — Arapca'da da soldan
                saga kalsin.

                Sonda semt DEGIL mekan adi var: semt zaten basligin ustundeki
                kunye satirinda geciyor, ayni kelimeyi ayni ekranda iki kez
                basmak dergi kunyesi hissini bozardi. */}
            <div className={`${labelFaint} mt-3 flex justify-between gap-4`}>
              <span aria-hidden="true" dir="ltr">
                01
              </span>
              {/* truncate + min-w-0: satir yuksekligi leading-none oldugu icin
                  uzun bir mekan adi ikinci satira tasarsa harfler ust uste
                  binerdi; dar ekranda tek satirda kalir. */}
              <span className="min-w-0 truncate text-end">{name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
