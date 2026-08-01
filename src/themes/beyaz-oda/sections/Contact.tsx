import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SectionIndex, meta, shell, surface } from "@/themes/beyaz-oda/parts";
import { ContactForm } from "@/themes/beyaz-oda/sections/ContactForm";
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
  // Koordinat bu listede YOK: header ve footer'da zaten var, ucuncu kez
  // tekrarlamak "Adres" etiketini iki satirda gosterirdi.

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} brand-section border-t border-[var(--brand-border)]`}>
        <Reveal>
          <SectionIndex
            index="04"
            title={t.contact.title}
            titleId="contact-title"
          >
            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
              {fill(t.contact.intro, { name })}
            </p>
          </SectionIndex>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {rows.length > 0 ? (
            <Reveal>
              <dl className="flex flex-col">
                {rows.map((row, index) => (
                  <div
                    key={`${row.term}-${index}`}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-[var(--brand-border)] py-4"
                  >
                    <dt className={`${meta} brand-eyebrow w-24 shrink-0`}>
                      {row.term}
                    </dt>
                    <dd
                      className="flex-1 text-start text-sm"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="underline-offset-4 transition-colors hover:text-[var(--brand-ink-muted)] hover:underline"
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

          <Reveal delay={0.08} className={rows.length === 0 ? "lg:col-span-2" : ""}>
            <h3 className={`${meta} brand-eyebrow`}>{t.contact.formTitle}</h3>
            <div className="mt-6">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
