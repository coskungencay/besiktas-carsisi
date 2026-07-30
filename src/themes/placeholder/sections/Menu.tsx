import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import type { SectionProps } from "@/themes/types";

export default function Menu({ content }: SectionProps) {
  const categories = content.menu.filter((c) => c.items.length > 0);
  if (categories.length === 0) return null;

  const { t } = content;

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-[var(--brand-surface-alt)] py-[var(--section-py)] text-[var(--brand-ink)]"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-8">
        <Reveal>
          <h2
            id="menu-title"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t.menu.title}
          </h2>
        </Reveal>

        <div className="mt-12 space-y-14">
          {categories.map((category, ci) => (
            <Reveal as="section" key={category.id} delay={ci * 0.05}>
              <h3 className="text-sm font-semibold tracking-[0.14em] text-[var(--brand-primary)] uppercase">
                {category.name}
              </h3>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 shadow-[var(--shadow-sm)]"
                  >
                    {item.thumbUrl ? (
                      <Image
                        src={item.thumbUrl}
                        alt={item.name}
                        width={88}
                        height={88}
                        className="h-20 w-20 shrink-0 rounded-[var(--radius-sm)] object-cover"
                      />
                    ) : null}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-semibold text-pretty">
                          {item.name}
                          {item.isFeatured ? (
                            <span className="ms-2 align-middle rounded-full bg-[var(--brand-accent)] px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-[var(--brand-primary-contrast)] uppercase">
                              {t.menu.featured}
                            </span>
                          ) : null}
                        </h4>
                        {item.price ? (
                          <span className="shrink-0 font-semibold tabular-nums text-[var(--brand-primary)]">
                            {item.price}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-[var(--brand-ink-muted)] text-pretty">
                          {item.description}
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
