import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK, imageOrFallback, paragraphs } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/sicak-firin/parts";
import type { GalleryImage, SectionProps } from "@/themes/types";

/**
 * Uc kolon: fotograf — KOYU anlati karti — fotograf.
 *
 * Bu koyu kart tasarimin merkezi: krem bir sayfanin ortasinda firinin agzi gibi
 * duruyor. Icinde hikaye var, tablo degil. (Tasarimin tekrar eden hamlesi:
 * bir izgarada hucrelerden yalnizca BIRI dolu zemine doner; yorumlar bolumunde
 * de ayni el var.)
 *
 * CALISMA SAATLERI BURADA DEGIL: tasarimda saatler kapanis bolumunde
 * ("Kapi calmadan gir") duruyor. Yedi satirlik tablo hikayenin yerini alip
 * bolumu iki katina cikariyor, koyu karti da bir cizelgeye ceviriyordu.
 *
 * Fotograflar galeriden geliyor; panelde ayri bir "hikaye gorseli" alani yok.
 * Iki fotograf yoksa izgara kendiliginden daralir (2 kolon, hatta tek kolon) —
 * yarim kalan bir sutun birakmaktansa kart genisler.
 */
export default function About({ content }: SectionProps) {
  const { about, gallery, name, t } = content;

  /*
   * Tasarimda kartin iki yaninda BIRER fotograf var; fazlasi galeri bolumunde.
   * Musteri galeriyi panelden kapattiysa buraya da fotograf koymuyoruz —
   * "kapattim ama hala gorunuyor" demesin diye tek anahtar kullaniliyor.
   */
  const photos = content.isVisible("galeri") ? gallery.slice(0, 2) : [];

  /*
   * Hikaye de fotograf da yoksa bolum hic basilmaz. Fotograf tek basina da
   * yeter: tasarimda bu serit oncelikle bir vitrin, metin onun ortasindaki not.
   */
  if (!about && photos.length === 0) return null;

  const body = paragraphs(about);

  const columns =
    photos.length >= 2
      ? "lg:grid-cols-3"
      : photos.length === 1
        ? "lg:grid-cols-2"
        : "";

  return (
    <section id="hakkimizda" aria-labelledby="about-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <div className={`grid gap-5 ${columns}`}>
          {photos[0] ? (
            <Photo image={photos[0]} index={0} name={name} t={t} />
          ) : null}

          {/*
            Koyu kart: tasarimda 20px yaricap, 34/30px dolgu, baslik ustte,
            paragraf altta (justify-between) — kart komsu fotograflar kadar
            uzayinca metin iki uca yaslaniyor.
          */}
          <Reveal
            delay={photos.length > 0 ? 0.1 : 0}
            className="brand-rounded flex flex-col justify-between bg-[var(--brand-ink)] p-8 text-[var(--brand-on-ink)]"
          >
            <div>
              <p className="brand-body brand-eyebrow text-[length:var(--brand-text-meta)] font-medium text-[var(--brand-on-ink-eyebrow)]">
                {t.about.eyebrow}
              </p>

              <h2
                id="about-title"
                className="brand-display mt-3.5 text-[length:var(--brand-h4)] leading-[var(--brand-h4-leading)] text-balance"
              >
                {t.about.title}
              </h2>
            </div>

            {/*
              Govde 14.5px / 1.75 ve saydam krem: koyu zeminde tam beyaz metin
              parliyor, %78 opaklik tasarimdaki okuma tonunu veriyor.
            */}
            <div className="mt-6 flex flex-col gap-4 text-sm leading-[var(--brand-lead-leading)] font-light text-pretty text-[var(--brand-on-ink-muted)]">
              {body.length > 0 ? (
                body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{fill(t.about.placeholder, { name })}</p>
              )}
            </div>
          </Reveal>

          {photos[1] ? (
            <Photo image={photos[1]} index={1} name={name} t={t} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Kartin yanindaki fotograf. Tasarimda 320px sabit yukseklik / ~435px kolon,
 * yani YATAY (4:3) — galeri bolumundeki kareler ile ayni oran.
 */
function Photo({
  image,
  index,
  name,
  t,
}: {
  image: GalleryImage;
  index: number;
  name: string;
  t: SectionProps["content"]["t"];
}) {
  return (
    <Reveal
      as="figure"
      delay={index === 0 ? 0 : 0.2}
      className="brand-rounded relative m-0 aspect-[4/3] overflow-hidden bg-[var(--brand-surface-alt)]"
    >
      <Image
        src={imageOrFallback(image.thumbUrl || image.url, SQUARE_FALLBACK)}
        alt={
          image.alt || fill(t.gallery.imageAlt, { name, index: String(index + 1) })
        }
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        loading="lazy"
        className="object-cover"
      />
    </Reveal>
  );
}
