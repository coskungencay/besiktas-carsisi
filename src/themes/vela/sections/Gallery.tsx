import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { HERO_FALLBACK, imageOrFallback } from "@/themes/_shared/data";
import { SectionHead, shell, surface } from "@/themes/vela/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimdaki "mekân" mozaigi: solda genis bir kare, sagda ust uste iki
 * kucuk kare. Satir yuksekligi 252px, aradaki bosluk 16px — yani buyuk kare
 * tam 520px (252 + 16 + 252) oluyor ve iki kolon ayni hizada bitiyor.
 *
 * Ilk gorsel iki satir + iki kolon kapliyor; kalan gorseller ayni izgarada
 * birer hucre olarak akip gidiyor, yani galeri kac fotografla dolarsa dolsun
 * duzen bozulmuyor.
 */
export default function Gallery({ content }: SectionProps) {
  // isVisible hem "gorsel yok" hem "panelden kapatildi" halini kapsar.
  if (!content.isVisible("galeri")) return null;

  const { gallery, name, t } = content;

  return (
    <section id="galeri" aria-labelledby="gallery-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            titleId="gallery-title"
          />
        </Reveal>

        <Reveal delay={0.14}>
          {/* 34px ust bosluk, 16px hucre araligi — tasarimdaki degerler. */}
          <ul className="mt-[2.125rem] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[15.75rem]">
            {gallery.map((image, index) => (
              <li
                key={image.id}
                className={`relative aspect-[4/3] w-full overflow-hidden bg-[var(--brand-surface-alt)] lg:aspect-auto ${
                  index === 0 ? "sm:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <Image
                  src={imageOrFallback(image.url || image.thumbUrl, HERO_FALLBACK)}
                  alt={
                    image.alt ||
                    fill(t.gallery.imageAlt, { name, index: String(index + 1) })
                  }
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
