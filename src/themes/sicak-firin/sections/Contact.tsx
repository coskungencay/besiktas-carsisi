import { Reveal } from "@/components/motion/Reveal";
import { PhoneIcon } from "@/themes/_shared/icons";
import {
  SectionHead,
  dashedRow,
  metaText,
  panel,
  shell,
  surface,
} from "@/themes/sicak-firin/parts";
import { ContactForm } from "@/themes/sicak-firin/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Kapanis bloku: her sey TEK bir krem panelin icinde.
 *
 * Tasarimda bu bolum sayfanin sonunu bir masa gibi topluyor — 26px yaricapli
 * genis bir yuzey, icinde davet basligi, iletisim satirlari ve form.
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
        {/* Tasarimdaki panel dolgusu asimetrik: 52px dikey, 48px yatay. */}
        <div className={`${panel} p-6 sm:px-12 sm:py-13`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-13">
            <Reveal className="lg:col-span-5">
              <SectionHead
                eyebrow={t.contact.eyebrow}
                title={t.contact.title}
                titleId="contact-title"
                intro={t.contact.intro}
              />

              {/*
                Hicbir iletisim bilgisi girilmemisse bu blok hic basilmaz;
                yoksa basligin altinda bos bir bosluk kalirdi.
              */}
              {hasInfo ? (
                <div className="mt-8 flex flex-col gap-6">
                  {contact.phone ? (
                    <a
                      href={contact.phoneHref}
                      className="brand-rounded inline-flex items-center gap-3 self-start bg-[var(--brand-surface)] px-6 py-4 transition-opacity hover:opacity-80"
                    >
                      <PhoneIcon className="size-5 text-[var(--brand-primary)]" />
                      <span className="flex flex-col">
                        <span className={metaText}>{t.contact.phone}</span>
                        <span
                          className="text-[length:var(--brand-lead)] tabular-nums"
                          dir="ltr"
                        >
                          {contact.phone}
                        </span>
                      </span>
                    </a>
                  ) : null}

                  {rows.length > 0 ? (
                    <dl className="flex flex-col">
                      {rows.map((row, index) => (
                        <div
                          key={`${row.term}-${index}`}
                          className={`${dashedRow} flex flex-col gap-1 py-3`}
                        >
                          <dt className={metaText}>{row.term}</dt>
                          <dd
                            className="text-start text-[length:var(--brand-text-row)] leading-relaxed font-light text-pretty text-[var(--brand-ink-soft)]"
                            {...(row.ltr ? { dir: "ltr" as const } : {})}
                          >
                            {row.href ? (
                              /*
                                Tasarimin global stili: butun baglantilar marka
                                renginde, uzerine gelince vurgu rengine doner ve
                                ALTI CIZILI DEGIL. Bu kural inline style'larda
                                gorunmedigi icin satirlar govde tonunda kalmisti.
                              */
                              <a
                                href={row.href}
                                className="text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-accent)]"
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
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={hasInfo ? 0.08 : 0} className="lg:col-span-7">
              <h3 className="brand-display text-[length:var(--brand-h4)] leading-[var(--brand-h4-leading)] tracking-[var(--brand-h3-tracking)]">
                {t.contact.formTitle}
              </h3>
              <div className="mt-6">
                <ContactForm locale={content.locale} messages={t} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
