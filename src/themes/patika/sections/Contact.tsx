import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/patika/parts";
import { ContactForm } from "@/themes/patika/sections/ContactForm";
import type { OpeningHour, SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };
type HourGroup = { label: string; value: string; isClosed: boolean };

/**
 * Ardisik ve AYNI saatlere sahip gunleri tek satirda toplar:
 * "Pazartesi–Cuma 07:00–21:00" gibi.
 *
 * NEDEN: tasarimda saat kolonu UC satir; yedi gunu tek tek yazmak kolonu iki
 * katina cikariyor ve yanindaki iki kolonla dengeyi bozuyor. Gruplama gunun
 * kendi adindan baska metin uretmez, bu yuzden sozluk gerektirmez.
 */
function groupHours(hours: OpeningHour[], closedLabel: string): HourGroup[] {
  const groups: OpeningHour[][] = [];

  for (const day of hoursFromMonday(hours)) {
    const current = groups.at(-1);
    const previous = current?.at(-1);
    const sameAsPrevious =
      previous !== undefined &&
      previous.isClosed === day.isClosed &&
      (day.isClosed ||
        (previous.openTime === day.openTime &&
          previous.closeTime === day.closeTime));

    if (current && sameAsPrevious) current.push(day);
    else groups.push([day]);
  }

  return groups.map((days) => {
    const first = days[0]!;
    const last = days.at(-1)!;

    return {
      label:
        days.length > 1 ? `${first.dayLabel}–${last.dayLabel}` : first.dayLabel,
      value: first.isClosed
        ? closedLabel
        : `${first.openTime}–${first.closeTime}`,
      isClosed: first.isClosed,
    };
  });
}

/**
 * Sayfayi kapatan NEON BLOK: tasarimda iletisim, koyu zeminden cikip lime bir
 * kutuya tasiniyor (28px kose, 52/46px ic bosluk).
 *
 * UC KOLON (1.25fr .8fr .8fr) — tasarimdaki duzen: solda cagri + adres, ortada
 * CALISMA SAATLERI, sagda ulasma yollari. Saatlerin yeri burasi; "hakkimizda"
 * bolumunde degil.
 *
 * Blok icinde renk devrildigi icin ikincil metinler `opacity` ile soluklastirilir;
 * koyu tema icin tanimli --brand-ink-muted burada okunmazdi. Ayni sebeple
 * ayraclar --brand-border degil, murekkebin saydam hali (--brand-rule-on-primary).
 *
 * Form bloku ayri ve koyu: lime kutunun icinde form alanlari afisi bozardi.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, openingHours, t } = content;

  const address = contact.address.trim();
  const hourGroups = groupHours(openingHours, t.hours.closed);

  /*
   * Adres bu listede YOK: tasarimda adres soldaki cagri kolonunda duruyor.
   * Koordinat da yok — sozlukte "koordinat" basligi olmadigi icin etiketsiz
   * bir satir olurdu; footer'da kunye olarak geciyor.
   */
  const rows: Row[] = [
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
   * Lime zeminde baglantinin alti cizili: renk degil, cizgi ayirt ediyor.
   * Cizgi satir ayraclarindan (%15) KOYU (%30) — tasarimda da oyle; ayni tonda
   * olsaydi baglanti ile ayrac birbirine karisirdi.
   */
  const linkOnPrimary =
    "border-b-[length:var(--brand-border-width)] border-[var(--brand-rule-on-primary-strong)] pb-0.5 transition-opacity hover:opacity-70";

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      {/* Sayfanin son bolumu: tasarimda tek yer altinda da bosluk tasiyan. */}
      <div className={`${shell} pk-section`}>
        <Reveal>
          {/* Ic bosluk tasarimdaki gibi: 52px dikey, 46px yatay. */}
          <div className="grid gap-10 rounded-[var(--brand-radius-block)] bg-[var(--brand-primary)] p-8 text-[var(--brand-primary-contrast)] sm:px-[2.875rem] sm:py-13 lg:grid-cols-[1.25fr_0.8fr_0.8fr] lg:gap-11">
            <div>
              <h2 id="contact-title" className="pk-block-title text-balance">
                {t.contact.title}
              </h2>
              {/*
                Olcu siniri kolonun kendi genisligine yakin (tasarimda ~517px):
                daha dar bir sinir metni kolonun soluna sikistirip sagda olu
                alan birakiyordu.
              */}
              <p className="pk-lead mt-6 max-w-[32rem] font-medium text-pretty">
                {fill(t.contact.intro, { name })}
              </p>

              {address ? (
                <p className="mt-6 max-w-[32rem] text-base leading-[1.6] font-medium text-pretty">
                  {contact.mapsUrl ? (
                    <a
                      href={contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkOnPrimary}
                    >
                      {address}
                    </a>
                  ) : (
                    address
                  )}
                </p>
              ) : null}
            </div>

            {hourGroups.length > 0 ? (
              <div>
                <h3 className="pk-eyebrow opacity-60">
                  {t.about.openingHours}
                </h3>

                {/*
                  Tasarimdaki saat kolonu: her satir 9px ic bosluk ve 2px
                  ayirici cizgi; sonuncuda cizgi yok ki kolon kendiliginden
                  bitsin.
                */}
                <dl className="mt-3.5 text-sm font-medium">
                  {hourGroups.map((group) => (
                    <div
                      key={group.label}
                      className="flex items-baseline justify-between gap-4 border-b-[length:var(--brand-border-width)] border-[var(--brand-rule-on-primary)] py-[0.5625rem] last:border-b-0"
                    >
                      <dt>{group.label}</dt>
                      <dd className="tabular-nums">
                        {group.isClosed ? (
                          group.value
                        ) : (
                          /* Saat araligi her dilde soldan saga okunur. */
                          <span dir="ltr">{group.value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 text-xs leading-relaxed opacity-60">
                  {t.about.hoursNote}
                </p>
              </div>
            ) : null}

            {rows.length > 0 ? (
              <dl className="flex flex-col gap-6">
                {rows.map((row, index) => (
                  <div key={`${row.term}-${index}`}>
                    <dt className="pk-eyebrow opacity-60">{row.term}</dt>
                    <dd
                      className="mt-2 text-sm leading-[1.6] font-medium text-pretty"
                      {...(row.ltr ? { dir: "ltr" as const } : {})}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className={linkOnPrimary}
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

        <Reveal delay={0.12}>
          <div className="brand-frame mt-4 bg-[var(--brand-surface-alt)] p-6 sm:p-10">
            <h3 className="pk-title">{t.contact.formTitle}</h3>
            <div className="mt-8">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
