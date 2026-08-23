import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday } from "@/themes/_shared/data";
import {
  bodyText,
  labelAccent,
  labelSoft,
  link,
  page,
  ruled,
  sectionPad,
  surface,
} from "@/themes/mera/parts";
import { ContactForm } from "@/themes/mera/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Kapanis basligini iki tona ayirir.
 *
 * Tasarimin imzasi: dev serif basliklarda SON parca ayni puntoda ama italik ve
 * marka renginde duruyor — hero'da "altida", kapanista "acik." boyle. Hero'da
 * bu ikinci ton ayri bir icerik alanindan (baslik devami) geliyor; kapanis
 * basligi sozlukten tek parca geldigi icin son kelime burada ayriliyor.
 *
 * Tek kelimelik bir baslik BOLUNMEZ: o zaman butun baslik vurgu rengine doner
 * ve iki tonlu ritim yerine tek renkli bir cumle kalirdi.
 */
function splitTitle(title: string): [string, string] {
  const trimmed = title.trim();
  const cut = trimmed.lastIndexOf(" ");
  if (cut === -1) return [trimmed, ""];
  return [trimmed.slice(0, cut), trimmed.slice(cut + 1)];
}

/**
 * Kapanis bolumu — tasarimin UC KOLONLU kunye sayfasi (1.2fr .9fr .9fr):
 * baslangicta iri baslik (52px) ve giris, ortada CALISMA SAATLERI, sonda
 * iletisim bilgileri.
 *
 * Saatler tasarimda BURADA. Onceki surumde yedi satirlik dokum hakkimizda
 * yazisinin ortasindaydi ve o bolumu iki katina cikariyordu; sayfanin
 * "buraya gelin" diyerek kapanmasi da bozuluyordu.
 *
 * Bolum basliginda kunye etiketi (eyebrow) yok: tasarimda kapanis dogrudan
 * buyuk cumleyle acilir, ustune kucuk bir etiket koymak o cumlenin agirligini
 * dagitirdi. Etiket metni orta/son kolonun basliklarinda yasiyor.
 *
 * Form tasarimda YOK — bizim eklememiz. Bu yuzden uc kolonlu kunyeyi bolmuyor,
 * altina kendi ayirici cizgisiyle ve bolum basliklarindaki 220px'lik kunye
 * kolonu ritmiyle geliyor.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, openingHours, t } = content;

  const hours = hoursFromMonday(openingHours);
  const [titleHead, titleAccent] = splitTitle(t.contact.title);

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
        <div
          className={`${ruled} grid gap-12 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:gap-14`}
        >
          <Reveal>
            {/* Tasarimda kapanis basligi hero'dan sonraki en iri tipografi:
                52px, ayni negatif harf araligiyla ve ayni iki tonlu ritimle.
                rtl:not-italic — Arapca'da egik serif okunaksiz. */}
            <h2
              id="contact-title"
              className="brand-display text-[clamp(2.25rem,4.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance"
            >
              {titleHead}
              {titleAccent ? (
                <span className="block italic text-[var(--brand-primary)] rtl:not-italic">
                  {titleAccent}
                </span>
              ) : null}
            </h2>

            <p className={`${bodyText} mt-7 max-w-[420px]`}>
              {fill(t.contact.intro, { name })}
            </p>
          </Reveal>

          {hours.length > 0 ? (
            <Reveal delay={0.08}>
              <h3 className={labelSoft}>{t.about.openingHours}</h3>

              {/* Tasarimda satirlar 13.5px, 10px dolgulu ve yalnizca ince bir
                  cizgiyle ayrilir; son satirda cizgi kapanir. */}
              <dl className="mt-[1.125rem] text-[0.845rem]">
                {hours.map((hour) => (
                  <div
                    key={hour.dayOfWeek}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--mera-hair-soft)] py-2.5 last:border-0"
                  >
                    <dt className="text-[var(--brand-ink-body)]">
                      {hour.dayLabel}
                    </dt>
                    <dd className="tabular-nums text-[var(--brand-ink)]">
                      {hour.isClosed ? (
                        t.hours.closed
                      ) : (
                        <span dir="ltr">
                          {hour.openTime} — {hour.closeTime}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[0.8125rem] leading-[1.6] text-[var(--brand-ink-faint)]">
                {t.about.hoursNote}
              </p>
            </Reveal>
          ) : null}

          {rows.length > 0 ? (
            <Reveal delay={0.14}>
              <h3 className={labelSoft}>{t.contact.eyebrow}</h3>

              <dl className="mt-[1.125rem]">
                {rows.map((row, index) => (
                  <div
                    key={`${row.term}-${index}`}
                    className="border-b border-[var(--mera-hair-soft)] py-2.5 last:border-0"
                  >
                    <dt className="mera-row text-[0.8125rem] text-[var(--brand-ink-faint)]">
                      {row.term}
                    </dt>
                    <dd
                      className="mt-1 text-[0.845rem] leading-[1.7] text-pretty text-[var(--brand-ink-body)]"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        /* Tasarimin global kurali: baglantilar marka renginde,
                           ustune gelince mureekkebe doner. */
                        /* inline-block + py/-my: satirin gorunen yuksekligi
                           degismeden dokunma alani 24px'e cikar (WCAG 2.2
                           "Target Size"); dolgu icerigi asagi iter, esit
                           negatif marj kutuyu geri ceker. */
                        <a
                          href={row.href}
                          className={`${link} inline-block py-[5px] -my-[5px] underline-offset-[6px] hover:underline`}
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
        </div>

        <Reveal delay={0.08}>
          <div
            className={`${ruled} mt-[4.5rem] grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16`}
          >
            <h3 className={labelAccent}>{t.contact.formTitle}</h3>
            <div className="max-w-[900px]">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
