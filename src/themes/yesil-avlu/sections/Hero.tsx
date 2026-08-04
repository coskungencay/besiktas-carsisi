import Image from "next/image";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { shell, surface } from "@/themes/yesil-avlu/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Avlu kemeri: hero'nun TAMAMI tek bir gorselin icinde.
 *
 * Tasarimin imzasi bu: ust kenari kubbe gibi yuvarlanan dev bir fotograf
 * cercevesi ve yazinin fotografin UZERINDE durmasi. Kubbenin tepesinde italik
 * bir fisilti satiri, alt kenarinda yer/yil satiri ve dev serif baslik var;
 * kemerin hemen altinda ise ince bir kunye seridi geciyor. Yaziyi kemerin
 * disina almak (once metin, sonra gorsel) tasarimin karakterini tamamen
 * kaybettiriyordu.
 *
 * KONTRAST: fotograf musteriden geldigi icin ne kadar acik olacagi bilinmiyor;
 * .ya-hero-veil perdesi (tasarimdaki ust/alt koyu gradyan) yazinin okunurlugunu
 * fotograftan bagimsiz garanti eder.
 *
 * HAREKET: Burada <Reveal> KULLANILMAZ. Ilk ekran zaten goruntude oldugu icin
 * scroll bekleyen bir gozlemci gereksiz; tasarimin acilis merdiveni (yaArch →
 * yaFade → yaRise) saf CSS ile veriliyor ve sunucudan gelen ilk boyamada
 * calisiyor. Ikisi birden uygulanirsa cift animasyon olurdu.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, tagline, heroImageUrl, contact, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  /*
   * Kemerin alt kenarindaki kucuk satir tasarimda KISA bir yer/yil kunyesi
   * ("Bebek · Istanbul · 2019'dan beri"). Uzun slogan bu 11.5px'lik ve cok
   * genis harf arali satirda iki-uc satira boluniyor, dev basligin ustundeki
   * gerilimi bozuyordu. Semt yoksa slogana duseriz.
   */
  const label = contact.locality || tagline;
  /*
   * Kubbenin tepesindeki italik fisilti tasarimda mekanin ritmini anlatan tek
   * cumle ("— sabah 8'den gun batimina —"). Slogan tam olarak bu isi goruyor;
   * ama asagida kunye olarak zaten basildiysa tekrar etmesin.
   */
  const whisper = label === tagline ? "" : tagline;

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/*
        Tasarimda hero'nun ust boslugu 20px, ALT boslugu yok; sonraki bolume
        kadarki 130px'i About kendi ust boslugundan tasiyor. Burada bosluk iki
        bolume paylastiriliyor, o yuzden degerin yarisi (--brand-section-py).

        Kirilma noktasi .brand-section ile AYNI olmali (globals.css 640px'te
        -lg degerine geciyor): hero bu utility'yi kullanamaz cunku ust boslugu
        20px sabit, dolayisiyla bumpi elle tekrarliyoruz. Aksi halde hero alti
        640px ustunde 52px'te takilip komsusuyla asimetrik kaliyordu.
      */}
      <div
        className={`${shell} pt-5 pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <div className="ya-arch ya-arch-in relative isolate flex aspect-[3/4] w-full flex-col overflow-hidden bg-[var(--brand-surface-alt)] px-8 pt-10 pb-12 text-center text-[var(--brand-primary-contrast)] sm:aspect-[16/10] sm:px-10 sm:pt-8 sm:pb-16 lg:aspect-[21/10]">
          <Image
            src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
            alt={fill(t.hero.coverAlt, { name })}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
            /*
             * Negatif z: kapsayici `isolate` ile kendi yigin baglamini kurdugu
             * icin gorsel kapsayicinin zemininin ustunde, yazinin altinda kalir.
             */
            className="-z-10 object-cover"
          />
          {/* Tasarimdaki ust/alt koyu gradyan; yalnizca okunurluk icin. */}
          <div aria-hidden="true" className="ya-hero-veil absolute inset-0 -z-10" />

          {whisper ? (
            /*
             * Kubbenin tepesindeki italik serif satir: tasarimda 19px.
             *
             * Genislik ORANSAL veriliyor cunku kubbenin kavisi bu yukseklikte
             * kenarlardan iceri giriyor ve girme miktari kutunun oranina bagli.
             * En dar oldugu yer 640-690px araligi (kutu 16/10'a doner, kubbe
             * bastirir): orada sabit bir 28rem sinir kavisin biraktigi ~26rem
             * yeri asip uzun bir slogani kirpiyordu. Kutunun genisledigi
             * lg'de sabit sinir yeniden guvenli.
             */
            <p className="brand-display ya-serif-book ya-fade-2 mx-auto max-w-[70%] text-[clamp(1rem,1.4vw,1.1875rem)] leading-snug text-balance opacity-90 italic sm:max-w-[60%] lg:max-w-md">
              {whisper}
            </p>
          ) : null}

          {/*
            Baslik blogu kemerin ALT kenarina yaslanir (tasarimda bottom:64px);
            mt-auto, fisilti satiri bos kalsa da hizayi bozmaz.
          */}
          <div className="mt-auto pt-10">
            {label ? (
              <p className="ya-kicker ya-fade-1 brand-body opacity-85">
                {label}
              </p>
            ) : null}

            {/*
             * Tasarimdaki 92px Cormorant baslik: satir yuksekligi 1, harf
             * araligi -.01em. leading 1.02 yaziliyor cunku Cormorant'in italik
             * ikinci satirinda cikintilar tam 1'de birbirine degiyor.
             */}
            <h1
              id="hero-title"
              className="brand-display ya-rise mx-auto mt-4 max-w-[16ch] text-[clamp(2.25rem,6.5vw,5.75rem)] leading-[1.02] tracking-[-0.01em] text-balance"
            >
              <Latin>{heroHeadline}</Latin>

              {/*
                Tasarimin imzasi: basligin IKINCI satiri ayni puntoda ama
                italik. Panelde baslik tek satirlik bir alan oldugu icin ikinci
                satiri "baslik devami" alanindan aliyoruz — musteri kendi
                metnini yazdiginda da bu duz/italik ritmi korunuyor.
                DIKKAT: bu satiri kucuk puntoyla ayri bir paragraf olarak
                basmak tasarimin karakterini bozar.
              */}
              {heroSubline ? (
                <span className="block italic"><Latin>{heroSubline}</Latin></span>
              ) : null}
            </h1>
          </div>
        </div>

        {highlights.length > 0 ? (
          /*
           * Kemerin altindaki kunye seridi: tasarimda 20px asagida, uc parca
           * satirin iki ucuna ve ortasina yayilmis. Dar ekranda yan yana
           * sigmadigi icin ortalanip sarilir.
           */
          <dl className="ya-fade-3 mt-5 flex flex-wrap justify-center gap-x-10 gap-y-2 text-center lg:justify-between lg:text-start">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="ya-meta brand-body flex items-baseline justify-center gap-2 text-[var(--brand-ink-muted)]"
              >
                <dt>{highlight.label}</dt>
                {/* Deger tasarimda etiketle ayni ritimde; ayrismasi icin ana murekkep. */}
                <dd className="text-[var(--brand-ink)]">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
