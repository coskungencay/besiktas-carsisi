import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { coordinateLabel } from "@/themes/_shared/data";
import {
  SectionHead,
  label,
  page,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import { ContactForm } from "@/themes/mera/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Kunye sayfasi: solda ince cizgili bilgi listesi (etiket ustte, deger altta),
 * sagda genis form. Baslik ortalanmaz — dergi sayfasinin baslangic kenarina
 * yaslidir ve tasarimda kapanis basligi 52px, yani bolum basliklarindan iri
 * (`large`): sayfa acildigi gibi buyuk bir cumleyle kapanir.
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
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      {/* Alt dolgu 72px: tasarimda kapanis seridi (Footer) iletisim
          izgarasindan tam bu kadar asagida basliyor. */}
      <div className={`${page} ${sectionPad} pb-[4.5rem]`}>
        <Reveal>
          <SectionHead
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
            large
            lead={fill(t.contact.intro, { name })}
            aside={
              coords ? (
                <p className={label} dir="ltr">
                  {coords}
                </p>
              ) : null
            }
          >
            {/* Iletisim satiri yoksa form tek basina tam genisligi alir;
                yoksa dar kolonda sikismis bir form kalirdi. */}
            <div
              className={`grid gap-12 lg:gap-14 ${
                rows.length > 0 ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
              }`}
            >
              {rows.length > 0 ? (
                <Reveal delay={0.08}>
                  <dl className="border-t border-[var(--brand-border)]">
                    {rows.map((row, index) => (
                      <div
                        key={`${row.term}-${index}`}
                        className="border-b border-[var(--brand-border)] py-3.5"
                      >
                        <dt className={label}>{row.term}</dt>
                        <dd
                          className="mt-2.5 text-[0.9rem] leading-[1.7] text-pretty text-[var(--brand-ink-body)]"
                          {...(row.ltr ? { dir: "ltr" as const } : {})}
                        >
                          {row.href ? (
                            <a
                              href={row.href}
                              className="underline-offset-[6px] transition-colors hover:text-[var(--brand-primary)] hover:underline"
                              {...(row.href.startsWith("http")
                                ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  }
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

              <Reveal delay={0.14}>
                <h3 className={label}>{t.contact.formTitle}</h3>
                <div className="mt-6">
                  <ContactForm locale={content.locale} messages={t} />
                </div>
              </Reveal>
            </div>
          </SectionHead>
        </Reveal>
      </div>
    </section>
  );
}
