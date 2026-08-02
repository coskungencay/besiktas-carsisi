import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { placeStamp, hoursFromMonday } from "@/themes/_shared/data";
import {
  goldLink,
  Hairline,
  label,
  metaMuted,
  proseSm,
  sectionTop,
  shell,
  surface,
} from "@/themes/vela/parts";
import { ContactForm } from "@/themes/vela/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Tasarimin kapanis bolumu: en ustte altin bir cizgi, altinda 56px'lik dolgu
 * ve 1.15 / .8 / .8 oranli UC KOLON.
 *
 *   1. kolon — buyuk serif cagri, kisa metin, koordinat
 *   2. kolon — CALISMA SAATLERI (tasarimda "Saatler" burada; bizde eskiden
 *      hakkimizdanin ortasindaydi ve o bolumu iki katina cikariyordu)
 *   3. kolon — iletisim satirlari, altinda mesaj formu
 *
 * Kolonlar arasinda cizgi yok — sadece 60px bosluk ayiriyor. Satir ayraclari
 * murekkebin %12'si (--brand-rule-soft), tasarimdaki rgba(242,237,228,.1).
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, openingHours, t } = content;
  const coords = placeStamp(content);
  const hours = hoursFromMonday(openingHours);

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

  /* Tasarimda satir dolgusu 11px, son satirda ayrac yok. */
  const rowBase = "flex items-baseline justify-between gap-6 py-[0.6875rem]";

  /*
   * Orta kolon (saatler) icerik yoksa hic basilmiyor. Izgara yine uc kolonlu
   * kalirsa iletisim kolonu ortaya kayar ve sagda bos bir .8fr kolon kalir —
   * checklist'in "kolon dengesi" maddesi. Kolon sayisi bu yuzden icerige bagli.
   */
  const columns =
    hours.length > 0
      ? "lg:grid-cols-[1.15fr_0.8fr_0.8fr]"
      : "lg:grid-cols-[1.15fr_0.8fr]";

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      <div className={`${shell} ${sectionTop} pb-14`}>
        <Hairline tone="gold" />

        <div className={`grid gap-14 pt-14 ${columns} lg:gap-[3.75rem]`}>
          <Reveal>
            {/* Tasarimda 56px / 1.06 — sayfanin en buyuk ikinci tipografisi. */}
            <h2
              id="contact-title"
              className="brand-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.01em] text-balance"
            >
              {t.contact.title}
            </h2>
            <p className={`mt-[1.625rem] max-w-md ${proseSm}`}>
              {fill(t.contact.intro, { name })}
            </p>

            {/* Koordinat ayri bir DB alani degil; enlem/boylamdan turetiliyor. */}
            {coords ? (
              <p className={`${metaMuted} mt-8`} dir="ltr">
                {coords}
              </p>
            ) : null}
          </Reveal>

          {hours.length > 0 ? (
            <Reveal delay={0.08}>
              <h3 className={label}>{t.about.openingHours}</h3>

              {/*
               * Tasarimdaki saat satiri: solda gun adi sonuk, sagda saat tam
               * murekkep renginde. Bu yuzden gun adi kucuk-uppercase DEGIL —
               * saatle ayni 14.5px olcude, sadece daha soluk.
               */}
              <dl className="mt-[1.125rem]">
                {hours.map((hour, index) => (
                  <div
                    key={hour.dayOfWeek}
                    className={`${rowBase} ${
                      index === hours.length - 1
                        ? ""
                        : "border-b border-[var(--brand-rule-soft)]"
                    }`}
                  >
                    <dt className="text-[0.90625rem] leading-[1.6] text-[var(--brand-ink-muted)]">
                      {hour.dayLabel}
                    </dt>
                    <dd className="text-[0.90625rem] leading-[1.6] tabular-nums">
                      {hour.isClosed ? (
                        <span className="text-[var(--brand-ink-muted)]">
                          {t.hours.closed}
                        </span>
                      ) : (
                        <span dir="ltr">
                          {hour.openTime} — {hour.closeTime}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-[0.8125rem] leading-[1.75] text-pretty text-[var(--brand-ink-muted)]">
                {t.about.hoursNote}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={0.14}>
            {rows.length > 0 ? (
              <>
                <h3 className={label}>{t.contact.eyebrow}</h3>
                <dl className="mt-[1.125rem]">
                  {rows.map((row, index) => (
                    <div
                      key={`${row.term}-${index}`}
                      className={`${rowBase} ${
                        index === rows.length - 1
                          ? ""
                          : "border-b border-[var(--brand-rule-soft)]"
                      }`}
                    >
                      <dt className={`${metaMuted} shrink-0`}>{row.term}</dt>
                      <dd
                        className="text-[0.90625rem] leading-[1.6] text-pretty text-end"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {/*
                         * Baglantilar ALTIN: tasarimin global kurali
                         * `a { color:#C4A265 }`, uzerine gelince krem.
                         */}
                        {row.href ? (
                          <a
                            href={row.href}
                            className={`${goldLink} underline-offset-8 hover:underline`}
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
              </>
            ) : null}

            {/*
             * Form tasarimda yok; bizim eklememiz. Tasarimin ucuncu kolonu
             * "iletisim + kucuk bir blok" duzeninde oldugu icin form da ayni
             * kolonda, iletisim satirlarinin altinda duruyor.
             */}
            <h3 className={`${label} ${rows.length > 0 ? "mt-12" : ""}`}>
              {t.contact.formTitle}
            </h3>
            <div className="mt-[1.125rem]">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
