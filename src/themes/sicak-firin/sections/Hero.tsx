import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  HERO_FALLBACK,
  SQUARE_FALLBACK,
  featuredItems,
  hasMenu,
  highlightsOrDerived,
  imageOrFallback,
} from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  chip,
  lead,
  metaText,
  pillGhost,
  pillSolid,
  shell,
  soft,
  surface,
} from "@/themes/sicak-firin/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Sicak karsilama: solda rozet + slab baslik + hap butonlar, sagda genis gorsel.
 *
 * Gorselin kosesine "not kagidi" yapisiyor: one cikan ilk urun, tezgaha
 * birakilmis egik bir kartla duyuruluyor. Kalan one cikan urunler asagidaki
 * vitrinde; boylece ayni urun iki kez yazilmiyor.
 *
 * ANIMASYON: bu bolumde <Reveal> (scroll ile beliren, istemci tarafi) YOK.
 * Ilk ekran zaten goruntude oldugu icin acilis animasyonu CSS ile calisiyor
 * (sf-badge / sf-up-* / sf-media / sf-note) — sunucudan gelen HTML ile ayni
 * anda basliyor, JS beklemiyor. Vitrin sayfa asagisinda kaldigi icin orada
 * Reveal kaliyor.
 */
export default function Hero({ content }: SectionProps) {
  const { heroHeadline, heroSubline, heroImageUrl, contact, name, t } = content;

  const highlights = highlightsOrDerived(content);
  const showMenuCta = hasMenu(content);

  // Ilk one cikan urun not kagidina, kalanlar vitrine gider (tekrar olmasin).
  const featured = featuredItems(content, 4);
  const note = featured[0];
  const showcase = featured.slice(1);

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
                    <dt className="brand-eyebrow">{highlight.label}</dt>
                    <dd>{highlight.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <h1
              id="hero-title"
              className="sf-up-1 brand-display mt-6 text-[length:var(--brand-h1)] leading-[var(--brand-h1-leading)] tracking-[var(--brand-h1-tracking)] text-balance"
            >
              {heroHeadline}
            </h1>

            {heroSubline ? (
              <p className={`${lead} sf-up-2 mt-6 max-w-[29.375rem] text-pretty`}>
                {heroSubline}
              </p>
            ) : null}

            {/*
              Menu de semt de yoksa bu satir hic basilmaz; bos bir flex kutusu
              mt-8 kadar olu bosluk birakip basligi vitrinden kopariyordu.
            */}
            {showMenuCta || contact.locality ? (
              <div className="sf-up-3 mt-8 flex flex-wrap items-center gap-3">
                {showMenuCta ? (
                  <a href="#menu" className={pillSolid}>
                    {t.hero.viewMenu}
                  </a>
                ) : null}

                {contact.locality ? (
                  <a
                    href={contact.mapsUrl || "#iletisim"}
                    {...(contact.mapsUrl
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={pillGhost}
                  >
                    <span>{contact.locality}</span>
                    <ArrowIcon />
                  </a>
                ) : null}
              </div>
            ) : null}
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
              <div className="sf-note mt-6 max-w-[14.5rem] rounded-[var(--brand-radius-sm)] border border-[var(--brand-hairline)] bg-[var(--brand-surface)] px-6 py-5 shadow-[var(--brand-note-shadow)] lg:absolute lg:bottom-11 lg:-start-6 lg:mt-0">
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

        {showcase.length > 0 ? (
          <Reveal delay={0.12}>
            <div className="mt-20 sm:mt-24">
              <h2 className={metaText}>{t.menu.featured}</h2>

              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {showcase.map((item) => (
                  <li key={item.id} className={`${soft} p-6`}>
                    <div className="brand-rounded relative aspect-[4/3] w-full overflow-hidden bg-[var(--brand-surface)]">
                      <Image
                        src={imageOrFallback(
                          item.thumbUrl || item.imageUrl,
                          SQUARE_FALLBACK,
                        )}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="brand-display text-[length:var(--brand-lead)]">
                        {item.name}
                      </h3>
                      {item.price ? (
                        <p
                          className="brand-display text-[length:var(--brand-lead)] font-semibold tabular-nums text-[var(--brand-primary)]"
                          dir="ltr"
                        >
                          {item.price}
                        </p>
                      ) : null}
                    </div>

                    {item.description ? (
                      <p className="mt-2 text-sm leading-relaxed font-light text-pretty text-[var(--brand-ink-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
