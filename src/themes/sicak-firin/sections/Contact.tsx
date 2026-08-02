import { Reveal } from "@/components/motion/Reveal";
import { PhoneIcon } from "@/themes/_shared/icons";
import { SectionHead, metaText, shell, soft, surface } from "@/themes/sicak-firin/parts";
import { ContactForm } from "@/themes/sicak-firin/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Solda bilgiler yumusak kart icinde, sagda form.
 *
 * Telefon karti ustte ayri duruyor: mahalle firininda ilk temas cogunlukla
 * telefonla oluyor, form ikinci secenek.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, t } = content;

  const rows: Row[] = [
    contact.address && {
      term: t.contact.address,
      value: contact.address,
      href: contact.mapsUrl,
      ltr: false,
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
  // Telefon bu listede YOK: asagida kendi vurgulu satirinda.
  const hasInfo = Boolean(contact.phone) || rows.length > 0;

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
            intro={t.contact.intro}
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/*
            Hicbir iletisim bilgisi girilmemisse kart hic basilmaz; yoksa
            sayfada bos bir sicak dikdortgen kaliyor ve form dar kolonda sikisiyor.
          */}
          {hasInfo ? (
            <Reveal className="lg:col-span-5">
              <div className={`${soft} flex flex-col gap-6 p-6 sm:p-8`}>
                {contact.phone ? (
                  <a
                    href={contact.phoneHref}
                    className="brand-rounded flex items-center gap-3 bg-[var(--brand-surface)] px-5 py-4 transition-opacity hover:opacity-80"
                  >
                    <PhoneIcon className="size-5 text-[var(--brand-primary)]" />
                    <span className="flex flex-col">
                      <span className={metaText}>{t.contact.phone}</span>
                      <span className="text-base tabular-nums" dir="ltr">
                        {contact.phone}
                      </span>
                    </span>
                  </a>
                ) : null}

                {rows.length > 0 ? (
                  <dl className="flex flex-col gap-5">
                    {rows.map((row, index) => (
                      <div
                        key={`${row.term}-${index}`}
                        className="flex flex-col gap-1"
                      >
                        <dt className={metaText}>{row.term}</dt>
                        <dd
                          className="text-start text-sm leading-relaxed text-pretty"
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
                ) : null}
              </div>
            </Reveal>
          ) : null}

          <Reveal
            delay={hasInfo ? 0.08 : 0}
            className={hasInfo ? "lg:col-span-7" : "lg:col-span-8"}
          >
            <h3 className="brand-display text-2xl">{t.contact.formTitle}</h3>
            <div className="mt-6">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
