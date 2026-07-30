import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import type { SectionProps } from "@/themes/types";

export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;

  const rows = [
    contact.address
      ? { label: t.contact.address, value: contact.address, href: contact.mapsUrl, ltr: false }
      : null,
    contact.phone
      ? { label: t.contact.phone, value: contact.phone, href: contact.phoneHref, ltr: true }
      : null,
    contact.whatsapp
      ? {
          label: t.contact.whatsapp,
          value: contact.whatsapp,
          href: contact.whatsappHref,
          ltr: true,
        }
      : null,
    contact.email
      ? {
          label: t.contact.email,
          value: contact.email,
          href: `mailto:${contact.email}`,
          ltr: true,
        }
      : null,
    contact.instagram
      ? {
          label: t.contact.instagram,
          value: `@${contact.instagram}`,
          href: contact.instagramHref,
          ltr: true,
        }
      : null,
  ].filter(
    (r): r is { label: string; value: string; href: string; ltr: boolean } =>
      Boolean(r),
  );

  return (
    <section
      id="iletisim"
      aria-labelledby="contact-title"
      className="bg-[var(--brand-surface-alt)] py-[var(--section-py)] text-[var(--brand-ink)]"
    >
      <div className="mx-auto grid w-full max-w-[var(--container-max)] gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <h2
            id="contact-title"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t.contact.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--brand-ink-muted)] text-pretty">
            {fill(t.contact.intro, { name })}
          </p>

          {rows.length > 0 ? (
            <dl className="mt-8 space-y-4 text-sm">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="font-semibold tracking-[0.12em] text-[var(--brand-primary)] uppercase">
                    {row.label}
                  </dt>
                  <dd
                    className="mt-1 text-[var(--brand-ink-muted)]"
                    {...(row.ltr ? { dir: "ltr" as const } : {})}
                  >
                    {row.href ? (
                      <a
                        href={row.href}
                        className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
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
          ) : null}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <ContactForm locale={content.locale} messages={t} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
