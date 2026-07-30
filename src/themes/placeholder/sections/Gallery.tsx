import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import type { SectionProps } from "@/themes/types";

export default function Gallery({ content }: SectionProps) {
  const images = content.gallery;
  if (images.length === 0) return null;

  return (
    <section
      id="galeri"
      aria-labelledby="gallery-title"
      className="bg-[var(--brand-surface)] py-[var(--section-py)] text-[var(--brand-ink)]"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-8">
        <Reveal>
          <h2
            id="gallery-title"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Galeri
          </h2>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, i) => (
            <Reveal as="li" key={image.id} delay={Math.min(i, 8) * 0.04}>
              <figure className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] shadow-[var(--shadow-sm)]">
                <Image
                  src={image.url}
                  alt={image.alt || `${content.name} galeri görseli ${i + 1}`}
                  width={640}
                  height={640}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                  className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
