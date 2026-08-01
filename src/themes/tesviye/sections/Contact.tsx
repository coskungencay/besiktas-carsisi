import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { coordinateLabel } from "@/themes/_shared/data";
import {
  Sheet,
  SheetHead,
  cell,
  hair,
  mono,
  pad,
  shell,
  splitGrid,
} from "@/themes/tesviye/parts";
import { ContactForm } from "@/themes/tesviye/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Iki bolmeli pafta: solda monospace etiketli bilgi tablosu, sagda kalin
 * cerceveli alanlardan olusan form. Iki bolme her zaman dolu oldugu icin
 * splitGrid burada guvenli.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;
  const coords = coordinateLabel(contact.lat, contact.lng);

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
    <section
      id="iletisim"
      aria-labelledby="contact-title"
      className="bg-[var(--brand-surface)]"
    >
      <div className={`${shell} pb-6 sm:pb-10`}>
        <Sheet>
          <Reveal>
            <SheetHead
              code="04"
              eyebrow={t.contact.eyebrow}
              title={t.contact.title}
              titleId="contact-title"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className={`${splitGrid} lg:grid-cols-2`}>
              <div className={`${cell} ${pad}`}>
                <p className="text-sm leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
                  {fill(t.contact.intro, { name })}
                </p>

                {rows.length > 0 ? (
                  <dl className="mt-6">
                    {rows.map((row, index) => (
                      <div
                        key={`${row.term}-${index}`}
                        className={`${hair} flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3`}
                      >
                        <dt
                          className={`${mono} w-20 shrink-0 text-[var(--brand-ink-muted)]`}
                        >
                          {row.term}
                        </dt>
                        <dd
                          className="min-w-0 flex-1 text-start text-sm"
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
                ) : null}

                {coords ? (
                  <p
                    className={`${mono} mt-6 tabular-nums text-[var(--brand-ink-muted)]`}
                    dir="ltr"
                  >
                    {coords}
                  </p>
                ) : null}
              </div>

              <div className={`${cell} ${pad}`}>
                <h3 className={`${mono} text-[var(--brand-ink-muted)]`}>
                  {t.contact.formTitle}
                </h3>
                <div className="mt-5">
                  <ContactForm locale={content.locale} messages={t} />
                </div>
              </div>
            </div>
          </Reveal>
        </Sheet>
      </div>
    </section>
  );
}
