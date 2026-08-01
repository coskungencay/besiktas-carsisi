import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import {
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/placeholder/parts";
import type { SectionProps } from "@/themes/types";

export default function Menu({ content }: SectionProps) {
  const categories = content.menu.filter((c) => c.items.length > 0);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section id="menu" aria-labelledby="menu-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.menu.eyebrow}
            title={t.menu.title}
            titleId="menu-title"
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-14">
          {categories.map((category, ci) => (
            <Reveal as="section" key={category.id} delay={Math.min(ci, 4) * 0.05}>
              <h3 className="brand-display border-b border-[var(--brand-border)] pb-4 text-2xl">
                {category.name}
              </h3>

              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="brand-frame flex gap-4 bg-[var(--brand-surface-alt)] p-4 transition-colors hover:border-[var(--brand-primary)]"
                  >
                    {item.thumbUrl ? (
                      <div className="brand-rounded relative aspect-square w-20 shrink-0 overflow-hidden">
                        <Image
                          src={item.thumbUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h4 className="brand-display text-base leading-snug">
                          {item.name}
                        </h4>
                        {item.price ? (
                          <p className="text-sm font-medium tabular-nums text-[var(--brand-primary)]">
                            {item.price}
                          </p>
                        ) : null}
                      </div>

                      {item.description ? (
                        <p className="text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                          {item.description}
                        </p>
                      ) : null}

                      {item.isFeatured ? (
                        <p className="brand-rounded brand-eyebrow mt-1 inline-flex w-fit items-center bg-[var(--brand-primary)] px-2.5 py-1 text-[11px] text-[var(--brand-primary-contrast)]">
                          {t.menu.featured}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
