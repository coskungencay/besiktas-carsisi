import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { coordinateLabel } from "@/themes/_shared/data";
import { label, labelMuted, prose, shell, surface } from "@/themes/vela/parts";
import { ContactForm } from "@/themes/vela/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Iki kolon: solda iletisim bilgileri (etiket ustte, deger altinda serif),
 * sagda kutusuz form. Kolonlar arasinda cizgi yok — sadece bosluk ayiriyor.
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
      <div className={`${shell} brand-section`}>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className={label}>{t.contact.eyebrow}</p>
            <h2
              id="contact-title"
              className="brand-display mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2] text-balance"
            >
              {t.contact.title}
            </h2>
            <p className={`mt-8 max-w-md ${prose}`}>
              {fill(t.contact.intro, { name })}
            </p>

            {rows.length > 0 ? (
              <dl className="mt-14 flex flex-col gap-8">
                {rows.map((row, index) => (
                  <div key={`${row.term}-${index}`} className="flex flex-col gap-2">
                    <dt className={labelMuted}>{row.term}</dt>
                    <dd
                      className="brand-display text-lg leading-[1.45] text-pretty"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="underline-offset-8 transition-colors hover:text-[var(--brand-primary)] hover:underline"
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

            {/* Koordinat ayri bir DB alani degil; enlem/boylamdan turetiliyor. */}
            {coords ? (
              <p className={`${labelMuted} mt-14`} dir="ltr">
                {coords}
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className={label}>{t.contact.formTitle}</h3>
            <div className="mt-10">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
