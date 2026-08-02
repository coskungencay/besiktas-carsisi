import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { placeStamp } from "@/themes/_shared/data";
import {
  Plate,
  bodyText,
  bodyTextSm,
  cell,
  hair,
  label,
  meta,
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
  const coords = placeStamp(content);

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
      {/*
        Alt cizgi YOK: sayfanin son bolumu bu ve hemen ardindan gelen kunye
        seridinin kendi ust cizgisi var. Ikisi birden cizilince bolumler
        arasindaki 2px'lik ritim burada 4px'e cikip goze carpiyordu.
      */}
      <div className={shell}>
        <Reveal>
          <Plate
            code="07"
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
          >
            <div className={`${splitGrid} lg:grid-cols-2`}>
              <div className={`${cell} ${pad}`}>
                <p className={`${bodyText} text-[var(--brand-ink-muted)]`}>
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
                          className={`${label} w-24 shrink-0 text-[var(--brand-primary)]`}
                        >
                          {row.term}
                        </dt>
                        <dd
                          className={`${bodyTextSm} min-w-0 flex-1 text-start`}
                          {...(row.ltr ? { dir: "ltr" as const } : {})}
                        >
                          {row.href ? (
                            <a
                              href={row.href}
                              className="underline-offset-4 transition-colors hover:text-[var(--brand-primary)] hover:underline"
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
                ) : null}

                {coords ? (
                  <p
                    className={`${meta} mt-6 tabular-nums text-[var(--brand-ink-muted)]`}
                    dir="ltr"
                  >
                    {coords}
                  </p>
                ) : null}
              </div>

              <div className={`${cell} ${pad}`}>
                <h3 className={`${label} text-[var(--brand-primary)]`}>
                  {t.contact.formTitle}
                </h3>
                <div className="mt-[18px]">
                  <ContactForm locale={content.locale} messages={t} />
                </div>
              </div>
            </div>
          </Plate>
        </Reveal>
      </div>
    </section>
  );
}
