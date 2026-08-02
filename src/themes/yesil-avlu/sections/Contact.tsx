import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import { ContactForm } from "@/themes/yesil-avlu/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Ortalanmis baslik, altinda iki kolon: solda yuvarlak cerceveli bilgi paneli,
 * sagda form. Bilgi satirlari dl/dt/dd cifti olarak veriliyor.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, t } = content;

  // Koordinat bu listede YOK: footer'da zaten var, ikinci kez tekrarlamak
  // "Adres" bilgisini iki ayri satirda gosterirdi.
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
        <Reveal>
          <SectionHeading
            eyebrowText={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
            lead={t.contact.intro}
          />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-10">
          {rows.length > 0 ? (
            <Reveal>
              <div className="brand-frame h-full bg-[var(--brand-surface-alt)] px-8 py-8">
                <dl className="flex flex-col gap-6">
                  {rows.map((row, index) => (
                    <div key={`${row.term}-${index}`}>
                      <dt className={eyebrow}>{row.term}</dt>
                      <dd
                        className="mt-2 text-base text-pretty"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {row.href ? (
                          <a
                            href={row.href}
                            className="underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
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
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.08} className={rows.length === 0 ? "lg:col-span-2" : ""}>
            <h3 className={`${eyebrow} text-center lg:text-start`}>
              {t.contact.formTitle}
            </h3>
            <div className="mt-6">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
