import { Reveal } from "@/components/motion/Reveal";
import { hoursFromMonday } from "@/themes/_shared/data";
import { SectionHeading, eyebrow, shell, surface } from "@/themes/yesil-avlu/parts";
import { ContactForm } from "@/themes/yesil-avlu/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Uc kolon: bilgiler, calisma saatleri karti ve form.
 *
 * GENISLIK: kolonlar sayfanin tamamina yayilir. Onceki hali max-w-5xl ile
 * ortalanmisti ve 1336px'lik seritte iki yan bos kaliyordu.
 *
 * SAATLER: tasarimda calisma saatleri TAM BURADA — "ziyaret" bolumunun sag
 * kolonundaki cerceveli kart. Hikaye bolumunun ortasindayken yedi satirlik
 * tablo orayi iki katina cikariyordu. Iletisim bolumu her zaman basildigi icin
 * (Konum'un aksine panelden kapatilamaz) saatler hicbir kurulumda kaybolmaz.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, openingHours, t } = content;

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

  const hours = hoursFromMonday(openingHours);

  /* Tek panel varsa izgara kurulmaz; yalniz kalan kart yariya sikismasin. */
  const panelCount = (rows.length > 0 ? 1 : 0) + (hours.length > 0 ? 1 : 0);

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

        {/* Tasarimdaki ziyaret izgarasi: 1fr 1fr, 80px bosluk, ustten hizali. */}
        <div
          className={`mt-12 grid items-start gap-10 lg:gap-20 ${
            panelCount > 1 ? "lg:grid-cols-2" : ""
          }`}
        >
          {rows.length > 0 ? (
            <Reveal>
              {/*
                Tasarimdaki bilgi kutusu DOLGUSUZ: yalnizca ince bir kenarlik
                ve 34/32px ic bosluk. Dolgu eklemek sayfadaki tek koyu zemin
                olan menu seridiyle yarisiyordu.
              */}
              <div className="brand-frame h-full px-8 py-[2.125rem]">
                <dl className="flex flex-col gap-6">
                  {rows.map((row, index) => (
                    <div key={`${row.term}-${index}`}>
                      <dt className={eyebrow}>{row.term}</dt>
                      {/* Tasarimda adres blogu 16px / 1.9 ve 300 agirlikta. */}
                      <dd
                        className="mt-2 text-base leading-[1.9] font-light text-pretty"
                        {...(row.ltr ? { dir: "ltr" as const } : {})}
                      >
                        {row.href ? (
                          <a
                            href={row.href}
                            className="underline-offset-4 transition-colors hover:underline"
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

          {hours.length > 0 ? (
            <Reveal delay={0.06}>
              {/* Tasarimdaki saat karti: ayni cerceve, satirlar ince cizgiyle ayrik. */}
              <div className="brand-frame h-full px-8 py-[2.125rem]">
                <h3 className={eyebrow}>{t.about.openingHours}</h3>

                <dl className="mt-4">
                  {hours.map((hour) => (
                    <div
                      key={hour.dayOfWeek}
                      /*
                       * Satir ayraci kartin CERCEVESINDEN daha soluk: tasarimda
                       * cerceve murekkebin %16'si, satir arasi %10'u. Token tek
                       * bir ton tasidigi icin daha acik olan bu ara ton
                       * color-mix ile uretiliyor (token'a dokunulmuyor).
                       */
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[color-mix(in_srgb,var(--brand-ink)_10%,transparent)] py-3 last:border-b-0"
                    >
                      {/* Menudeki urun satiriyla ayni olcek: 15px, 300 agirlik. */}
                      <dt className="text-[0.9375rem] font-light">
                        {hour.dayLabel}
                      </dt>
                      {/* Kapali gunler tasarimda soluk; acik saatler ana murekkep. */}
                      <dd
                        className={`text-[0.9375rem] font-light tabular-nums ${
                          hour.isClosed ? "text-[var(--brand-ink-muted)]" : ""
                        }`}
                      >
                        {hour.isClosed ? (
                          t.hours.closed
                        ) : (
                          <span dir="ltr">
                            {hour.openTime} – {hour.closeTime}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 text-xs leading-relaxed text-[var(--brand-ink-muted)]">
                  {t.about.hoursNote}
                </p>
              </div>
            </Reveal>
          ) : null}
        </div>

        {/*
          Form iki panelin ALTINDA, ortalanmis bir kolonda. Ucuncu kolon olarak
          yan yana konsaydi alanlar 400px'lik bir seride sikisiyordu; tasarimda
          zaten form yok, bizim eklentimiz — bolumun ritmini bozmadan durmasi
          icin kendi satirinda duruyor.
        */}
        <Reveal delay={0.12}>
          <div className="mx-auto mt-16 w-full max-w-2xl">
            <h3 className={`${eyebrow} text-center`}>{t.contact.formTitle}</h3>
            <div className="mt-6">
              <ContactForm locale={content.locale} messages={t} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
