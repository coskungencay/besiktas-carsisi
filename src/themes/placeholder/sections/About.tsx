import { Reveal } from "@/components/motion/Reveal";
import type { SectionProps } from "@/themes/types";

export default function About({ content }: SectionProps) {
  const { about, name, openingHours } = content;
  if (!about && openingHours.length === 0) return null;

  const paragraphs = about
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      id="hakkimizda"
      aria-labelledby="about-title"
      className="bg-[var(--brand-surface)] py-[var(--section-py)] text-[var(--brand-ink)]"
    >
      <div className="mx-auto grid w-full max-w-[var(--container-max)] gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2
            id="about-title"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Hakkımızda
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--brand-ink-muted)] text-pretty sm:text-lg">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{name} hakkında bilgi yakında eklenecek.</p>
            )}
          </div>
        </Reveal>

        {openingHours.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface-alt)] p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-sm font-semibold tracking-[0.14em] text-[var(--brand-primary)] uppercase">
                Çalışma Saatleri
              </h3>
              <dl className="mt-5 space-y-2.5 text-sm">
                {openingHours.map((h) => (
                  <div
                    key={h.dayOfWeek}
                    className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--brand-border)] pb-2.5 last:border-0 last:pb-0"
                  >
                    <dt className="font-medium">{h.dayLabel}</dt>
                    <dd className="tabular-nums text-[var(--brand-ink-muted)]">
                      {h.isClosed ? "Kapalı" : `${h.openTime} – ${h.closeTime}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
