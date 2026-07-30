import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import {
  SectionHeader,
  containerClass,
  sectionClass,
} from "@/themes/shared/parts";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;

  const rows: Row[] = [
    contact.address && {
      term: t.contact.address,
      value: contact.address,
      href: contact.mapsUrl,
      ltr: false,
    },
    contact.phone && {
      term: t.contact.phone,
      value: contact.phone,
      href: contact.phoneHref,
      ltr: true,
    },
    contact.whatsapp && {
      term: t.contact.whatsapp,
      value: contact.whatsapp,
      href: contact.whatsappHref,
      ltr: true,
    },
    contact.email && {
      term: t.contact.email,
      value: contact.email,
      href: `mailto:${contact.email}`,
      ltr: true,
    },
    contact.instagram && {
      term: t.contact.instagram,
      value: `@${contact.instagram}`,
      href: contact.instagramHref,
      ltr: true,
    },
  ].filter((row): row is Row => Boolean(row));

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={sectionClass}>
      <div className={`${containerClass} brand-section`}>
        <Reveal>
          <SectionHeader
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
          />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
            {fill(t.contact.intro, { name })}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {rows.length > 0 ? (
            <Reveal>
              <dl className="flex flex-col">
                {rows.map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-4"
                  >
                    <dt className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                      {row.term}
                    </dt>
                    <dd
                      className="flex-1 text-start text-base"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="underline-offset-4 transition-colors hover:text-[var(--brand-primary)] hover:underline"
                          {...(row.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          <Reveal delay={0.1} className={rows.length === 0 ? "lg:col-span-2" : ""}>
            <div className="brand-frame bg-[var(--brand-surface-alt)] p-6 sm:p-8">
              <h3 className="brand-display text-xl">{t.contact.formTitle}</h3>
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
