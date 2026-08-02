import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SQUARE_FALLBACK_DARK, imageOrFallback } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import { SectionHead, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kare izgara: tasarimda genis ekranda 5 kolon, 14px aralik, 16px yuvarlak kose.
 *
 * Kareler cerceve DEGIL sadece yuvarlak: menu kartlarinin kalin kenarligi burada
 * tekrar etseydi izgara tel orgu gibi gorunurdu.
 */
export default function Gallery({ content }: SectionProps) {
  // Gorsel yoksa ya da musteri panelden kapattiysa bolum hic basilmaz.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, contact, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} pk-section`}>
        <Reveal>
          <SectionHead
            title={t.gallery.title}
            titleId="gallery-title"
            /*
              Tasarimda bu bolumun basliginin yaninda, ayni taban cizgisinde,
              alti neon cizili Instagram kullanici adi var — kareler nereden
              geliyorsa oraya goturen tek baglanti. Hesap girilmemisse cikmaz.
            */
            action={
              contact.instagram && contact.instagramHref ? (
                <a
                  href={contact.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="pk-link pk-caps-sm border-b-[length:var(--brand-border-width)] border-[var(--brand-primary)] pb-0.5"
                >
                  @{contact.instagram}
                </a>
              ) : undefined
            }
          />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-[var(--brand-radius-media)] bg-[var(--brand-surface-alt)]"
              >
                <Image
                  src={imageOrFallback(
                    image.thumbUrl || image.url,
                    SQUARE_FALLBACK_DARK,
                  )}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, {
                      name,
                      index: String(index + 1),
                    })
                  }
                  fill
                  sizes="(min-width: 1024px) 17rem, (min-width: 640px) 30vw, 45vw"
                  loading="lazy"
                  className="object-cover"
                />
              </li>
            ))}

            {/*
              Izgaranin son karesi FOTOGRAF DEGIL, dolu neon bir kutu —
              tasarimin imzasi: dort kare fotograf, besincisi lime bir blok.
              Fotograf dizisini kiran tek renk alan bolume afis karakterini
              veriyor; hepsi kare olsaydi izgara katalog gibi okunurdu.

              Tasarimda kutunun icinde takipci SAYISI var; o veri bizde yok ve
              uydurulamaz, o yuzden ayni yeri "takip et" cagrisi tutuyor.
              Hesap girilmemisse kutu hic basilmaz, izgara dort kareyle kalir.
            */}
            {contact.instagramHref ? (
              <li>
                <a
                  href={contact.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex aspect-square flex-col justify-between rounded-[var(--brand-radius-media)] bg-[var(--brand-primary)] p-[1.375rem] text-[var(--brand-primary-contrast)] transition-colors hover:bg-[var(--brand-accent)]"
                >
                  <span className="pk-title text-balance">
                    {t.social.title}
                  </span>
                  <ArrowIcon className="size-7" />
                </a>
              </li>
            ) : null}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
