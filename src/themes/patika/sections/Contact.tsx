import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { SectionHead, card, shell, surface } from "@/themes/patika/parts";
import { ContactForm } from "@/themes/patika/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Iletisim bilgileri satir listesi degil KART IZGARASI; form ise ayri ve
 * kalin cerceveli genis bir blok icinde.
 */
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
  /*
   * Koordinat bilerek bu listede YOK: sozlukte "koordinat" basligi olmadigi
   * icin etiketsiz bir kart olurdu. Footer'da kunye satiri olarak duruyor.
   */

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} brand-section`}>
        <Reveal>
          <SectionHead
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            titleId="contact-title"
          />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-[var(--brand-ink-muted)]">
            {fill(t.contact.intro, { name })}
          </p>
        </Reveal>

        {rows.length > 0 ? (
          <Reveal delay={0.08}>
            <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((row, index) => (
                <div key={`${row.term}-${index}`} className={card}>
                  <dt className="brand-eyebrow text-xs text-[var(--brand-ink-muted)]">
                    {row.term}
                  </dt>
                  <dd
                    className="brand-display mt-2 text-base leading-snug text-pretty"
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

        <Reveal delay={0.12}>
          <div className="brand-frame mt-14 bg-[var(--brand-surface-alt)] p-6 sm:p-10">
            <h3 className="brand-display text-[clamp(1.5rem,4vw,2.25rem)] leading-[0.95]">
              {t.contact.formTitle}
            </h3>
            <div className="mt-8">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
