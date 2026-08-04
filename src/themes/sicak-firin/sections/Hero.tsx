import Image from "next/image";
import Link from "next/link";

import { Latin } from "@/components/site/Latin";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  featuredItems,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
  menuHref,
  paragraphs,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  chip,
  lead,
  pillGhost,
  pillSolid,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sicak karsilama: solda rozet + slab baslik + hap butonlar, sagda genis gorsel.
 *
 * Gorselin kosesine "not kagidi" yapisiyor: one cikan ilk urun, tezgaha
 * birakilmis egik bir kartla duyuruluyor. One cikan DIGER urunler burada
 * DEGIL, asagidaki menu vitrininde duruyor — tasarimda hero iki kolondan
 * ibaret, altina bir kart vitrini eklemek ilk ekrani uzatiyordu.
 *
 * ANIMASYON: bu bolumde <Reveal> (scroll ile beliren, istemci tarafi) YOK.
 * Ilk ekran zaten goruntude oldugu icin acilis animasyonu CSS ile calisiyor
 * (sf-badge / sf-up-* / sf-media / sf-note) — sunucudan gelen HTML ile ayni
 * anda basliyor, JS beklemiyor.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, tagline, heroImageUrl, contact, name, t } =
    content;

  const highlights = highlightsOrDerived(content);
  const showMenuCta = hasMenu(content);

  /*
   * Basligin altindaki metin tasarimda mekani anlatan kisa bir paragraf
   * ("Otuz yildir ayni tas firin...") — slogan degil. Hakkimizda'nin ilk
   * paragrafi bu isi goruyor; hic yazilmadiysa slogana duseriz.
   */
  const intro = paragraphs(content.about)[0] ?? tagline;

  /*
   * Tasarimda hero'da HER ZAMAN iki buton var; ikincisi ("Nerede? →") sayfa
   * icindeki "gel" bolumune gidiyor — disari acilan bir harita linki degil.
   * Karsiligi konum bolumu; o kapaliysa iletisim bolumu (ust seritteki nav de
   * ayni varsayimla her zaman #iletisim'e baglaniyor), yani hedef hep gecerli.
   * Yol tarifi baglantisi zaten konum bolumunun kendi butonunda duruyor.
   */
  const whereHref = content.isVisible("konum") ? "#konum" : "#iletisim";

  // Not kagidindaki tek urun: one cikanlarin ilki.
  const note = featuredItems(content, 1)[0];

  return (
    <section id="hero" aria-labelledby="hero-title" className={surface}>
      {/*
        Ust bosluk tasarimdaki 56px. Alt bosluk ise bolum ritminin YARISI
        (--brand-section-py): bir sonraki bolum kendi ust boslugunu ekleyince
        aradaki mesafe tasarimdaki 104px'e oturuyor. Sabit bir pb-24 yazmak
        araligi 148px'e cikariyor, hero sayfadan kopuyordu.
      */}
      <div
        className={`${shell} pt-14 pb-[var(--brand-section-py)] sm:pb-[var(--brand-section-py-lg)]`}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            {highlights.length > 0 ? (
              <dl className="sf-badge flex flex-wrap gap-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className={chip}>
                    {/* Buhar yalnizca ilk rozette: tasarimda tek bir "firin
                        yaniyor" isareti var, her rozette tekrarlanmiyor. */}
                    {index === 0 ? (
                      <span
                        aria-hidden="true"
                        className="relative inline-block size-2 shrink-0 rounded-full bg-[var(--brand-accent)]"
                      >
                        <span className="sf-steam absolute start-px bottom-2 block h-3.5 w-1.5 rounded-full bg-[var(--brand-accent)]" />
                      </span>
                    ) : null}
                    {/* Tasarimdaki rozet duz bir cumle: BUYUK HARF ve genis
                        harf araligi YOK. Etiket ile deger arasindaki farki
                        tasarimin her yerinde oldugu gibi agirlik tasiyor. */}
                    <dt className="font-medium">{highlight.label}</dt>
                    <dd className="font-light">{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/*
              Tasarimda baslik TEK renk degil: ikinci satiri italik ve vurgu
              renginde ("bir de"). Ikinci parcayi heroSubline tasiyor ve basligin
              ICINDE, AYNI puntoda basiliyor — kucuk punto ile asagi almak
              tasarimin en belirgin hamlesini siliyordu.

              mt-6 tasarimdaki rozet-baslik araligi (24px); rozet hic
              basilmadiysa (first:) bu bosluk hero'nun ust dolgusuna eklenip
              basligi asagi itiyordu, o yuzden sifirlaniyor.
            */}
            <h1
              id="hero-title"
              className="sf-up-1 brand-display mt-6 first:mt-0 text-[length:var(--brand-h1)] leading-[var(--brand-h1-leading)] tracking-[var(--brand-h1-tracking)] text-balance"
            >
              <Latin>{heroHeadline}</Latin>
              {heroSubline ? (
                <span className="block italic text-[var(--brand-accent)]">
                  <Latin>{heroSubline}</Latin>
                </span>
              ) : null}
            </h1>

            {intro ? (
              <p className={`${lead} sf-up-2 mt-6 max-w-[29.375rem] text-pretty`}>
                <Latin>{intro}</Latin>
              </p>
            ) : null}

            {/*
              Menude urun yoksa dolu buton hic basilmaz — hicbir yere gitmeyen
              bir baglanti birakmak istemiyoruz. Ikinci buton her zaman var.

              Bu buton artik sayfa ici capaya degil MENU SAYFASINA gidiyor;
              <Link> ile istemci tarafi gecis (sayfa bastan yuklenmiyor).
            */}
            <div className="sf-up-3 mt-8 flex flex-wrap items-center gap-3">
              {showMenuCta ? (
                <Link href={menuHref(content)} className={pillSolid}>
                  {t.hero.viewMenu}
                </Link>
              ) : null}

              {/* Semt yazildiysa buton onu soyler ("Kadikoy →"), yoksa
                  sozlukteki genel konum etiketine duser. */}
              <a href={whereHref} className={pillGhost}>
                <span>{contact.locality || t.location.eyebrow}</span>
                <ArrowIcon />
              </a>
            </div>
          </div>

          {/* Genis, yumusak koseli vitrin gorseli + kosesindeki not kagidi. */}
          <div className="relative">
            <div className="sf-media relative aspect-[4/3] w-full overflow-hidden rounded-[var(--brand-radius-media)] bg-[var(--brand-surface-alt)] lg:aspect-[5/4]">
              <Image
                src={imageOrFallback(heroImageUrl, HERO_FALLBACK)}
                alt={fill(t.hero.coverAlt, { name })}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            </div>

            {note ? (
              // Not kagidinin kenari tasarimda en SOLUK ayrac (%28); serit ve
              // satir cizgileriyle ayni tonda olunca kagit yapistirilmis degil
              // cizilmis gibi duruyordu.
              <div className="sf-note mt-6 max-w-[14.5rem] rounded-[var(--brand-radius-sm)] border border-[var(--brand-hairline-soft)] bg-[var(--brand-surface)] px-[1.375rem] py-[1.125rem] shadow-[var(--brand-note-shadow)] lg:absolute lg:bottom-11 lg:-start-6 lg:mt-0">
                <p className="brand-display text-[length:var(--brand-lead)] italic text-[var(--brand-primary)]">
                  {t.menu.featured}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-soft)]">
                  {note.name}
                  {note.description ? ` — ${note.description}` : ""}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
