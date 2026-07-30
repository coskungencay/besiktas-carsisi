import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import type { SectionProps } from "@/themes/types";

export default function Hero({ content }: SectionProps) {
  const { name, tagline, heroImageUrl, logoUrl, contact } = content;
  const image = heroImageUrl || "/placeholders/hero.svg";

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-[var(--brand-surface-alt)] text-[var(--brand-ink)]"
    >
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--brand-ink)_62%,transparent)]"
      />

      <div className="relative mx-auto w-full max-w-[var(--container-max)] px-5 py-[var(--section-py)] sm:px-8">
        <Reveal className="max-w-2xl">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${name} logosu`}
              width={132}
              height={132}
              className="mb-7 h-24 w-24 rounded-[var(--radius-md)] bg-[var(--brand-surface)] object-contain p-2 shadow-[var(--shadow-md)] sm:h-28 sm:w-28"
            />
          ) : null}

          <h1
            id="hero-title"
            className="font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--brand-primary-contrast)] text-balance sm:text-6xl"
          >
            {name}
          </h1>

          {tagline ? (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color-mix(in_srgb,var(--brand-primary-contrast)_88%,transparent)] text-pretty sm:text-xl">
              {tagline}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-[var(--radius-sm)] bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-[var(--brand-primary-contrast)] shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary-contrast)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Menüyü İncele
            </a>
            {contact.phoneHref ? (
              <a
                href={contact.phoneHref}
                className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--brand-primary-contrast)_55%,transparent)] px-6 py-3 text-sm font-semibold text-[var(--brand-primary-contrast)] transition-colors hover:bg-[color-mix(in_srgb,var(--brand-primary-contrast)_14%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary-contrast)]"
              >
                {contact.phone}
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
