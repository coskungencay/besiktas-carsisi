import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { hoursFromMonday } from "@/themes/_shared/data";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  sectionGrid,
  sectionIndex,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import { ContactForm } from "@/themes/beyaz-oda/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string };

/**
 * Tasarimin son bolumu ve sayfanin ikinci buyuk tipografisi burada.
 *
 * UC KOLON (12'li izgarada 3/4 · 7/3 · 11/2):
 *   1. 40px'lik kisa cumle, (Konum kapaliysa) adres ve harita baglantisi
 *   2. gun gun CALISMA SAATLERI tablosu — tasarimda saatlerin yeri BURASI
 *   3. telefon / e-posta / Instagram satirlari
 *
 * Form tasarimda yok ama urunun zorunlu parcasi: kolonlarin altina, saatlerle
 * ayni hizadan baslayan ayri bir satira yerlesiyor.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, openingHours, t } = content;

  const hours = hoursFromMonday(openingHours);

  /*
   * Adres blogu yalnizca Konum bolumu KAPALIYKEN burada duruyor.
   * NEDEN: Konum (06) hemen ustte ayni adresi ve ayni bicimli (alt cizgili +
   * ok) harita baglantisini zaten basiyor; ikisi yan yana gelince sayfa ayni
   * bilgiyi iki kez, iki farkli puntoyla tekrar ediyordu. Konum panelden
   * kapatilirsa adres kaybolmasin diye kosul isVisible'a bagli.
   */
  const showAddress = contact.address !== "" && !content.isVisible("konum");

  /*
   * Adres bu listede YOK: ya ustteki Konum bolumunde ya da sol kolonda
   * buyuk puntoyla duruyor, ucuncu kez yazmak satiri tekrar ederdi.
   * Koordinat da yok — header, footer ve Konum'da gorunuyor.
   */
  const rows: Row[] = [
    contact.phone && {
      term: t.contact.phone,
      value: contact.phone,
      href: contact.phoneHref,
    },
    contact.whatsapp && {
      term: t.contact.whatsapp,
      value: contact.whatsapp,
      href: contact.whatsappHref,
    },
    contact.email && {
      term: t.contact.email,
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.instagram && {
      term: t.contact.instagram,
      value: `@${contact.instagram}`,
      href: contact.instagramHref,
    },
  ].filter((row): row is Row => Boolean(row));

  return (
    <section id="iletisim" aria-labelledby="contact-title" className={surface}>
      {/*
        Alt bosluk YOK: tasarimda bolumun 60px'lik alt boslugu kapanis
        seridinden SONRA geliyor, seridi de Footer basiyor. Buraya da
        konulsaydi serit sayfadan 60px fazla uzakta dururdu.
      */}
      <div className={sectionTop}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          {/* Indeks sayfadaki SIRAYI gosterir; iletisim artik son bolum. */}
          <SectionIndex index={sectionIndex(content, "iletisim")} title={t.contact.eyebrow} titleId="contact-title">
            <div className="grid gap-10 lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="brand-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.2] tracking-[-0.025em] text-balance">
                    {fill(t.contact.intro, { name })}
                  </p>
                </Reveal>

                {showAddress ? (
                  <Reveal delay={0.08}>
                    <p className="mt-[26px] text-[15px] leading-[1.85] text-pretty text-[var(--brand-ink-soft)]">
                      {contact.address}
                    </p>

                    {contact.mapsUrl ? (
                      <a
                        href={contact.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                      >
                        <span>{t.contact.address}</span>
                        <ArrowIcon className="size-3.5" />
                      </a>
                    ) : null}
                  </Reveal>
                ) : null}
              </div>

              {/*
                Orta kolon — CALISMA SAATLERI.
                Tasarimda 12'li izgaranin 7. kolonunda 3 kolon genisliginde;
                bu ic izgara 3. kolondan basladigi icin karsiligi 5. kolon.
              */}
              {hours.length > 0 ? (
                <div className="lg:col-span-3 lg:col-start-5">
                  <Reveal delay={0.1}>
                    {/* Tasarimda blok basliklari ("SAATLER") 10.5px mono. */}
                    <h3 className="bo-index-sm brand-eyebrow">
                      {t.about.openingHours}
                    </h3>

                    {/*
                      Tasarimda 11px dikey boslukla akan bu tablo mono DEGIL:
                      iki hucre de 14px grotesk, gun adi soluk, saat koyu.
                      Mono/BUYUK harf bicimi tasarimda yalnizca 11.5px'lik
                      kunye tablosunda kullaniliyor.
                    */}
                    <dl className="mt-4 flex flex-col text-[14px]">
                      {hours.map((hour) => (
                        <div
                          key={hour.dayOfWeek}
                          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--brand-border)] py-[11px] last:border-b-0"
                        >
                          <dt className="text-[var(--brand-ink-soft)]">
                            {hour.dayLabel}
                          </dt>
                          <dd className="text-end tabular-nums">
                            {hour.isClosed ? (
                              /* Kapali gun tasarimda en soluk tonda. */
                              <span className="text-[var(--brand-ink-faint)]">
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

                    <p className="bo-index mt-5 leading-[1.8]">
                      {t.about.hoursNote}
                    </p>
                  </Reveal>
                </div>
              ) : null}

              {/*
                Sag kolon — BAGLANTI. Tasarimda 11. kolondan baslayan 2
                kolonluk dar serit; satirlar etiketsiz, sadece baglanti.
              */}
              {rows.length > 0 ? (
                <div className="lg:col-span-2 lg:col-start-9">
                  <Reveal delay={0.16}>
                    <h3 className="bo-index-sm brand-eyebrow">
                      {t.contact.title}
                    </h3>

                    <ul className="mt-4 text-[14px] leading-[2.1]">
                      {rows.map((row, index) => (
                        <li key={`${row.term}-${index}`}>
                          {/*
                            Etiket gorunmuyor ama erisilebilir ada giriyor:
                            iki numara alt alta gelince ("Telefon" / "WhatsApp")
                            ekran okuyucuda hangisi oldugu anlasilsin diye.
                          */}
                          <a
                            href={row.href}
                            aria-label={`${row.term}: ${row.value}`}
                            className="underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
                            {...(row.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {/* Numara/e-posta Arapca sayfada da soldan saga. */}
                            <span dir="ltr" className="inline-block break-all">
                              {row.value}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              ) : null}
            </div>

            {/*
              Form tasarimda YOK; kolonlarin arasina sikistirmak yerine altta
              kendi satirinda duruyor. Saatler kolonuyla ayni hizadan (5.)
              baslar ki bolumun uclu ritmi bozulmasin.
            */}
            <div className="mt-16 grid lg:grid-cols-10 lg:gap-6">
              <div className="lg:col-span-6 lg:col-start-5">
                <Reveal delay={0.1}>
                  <h3 className="bo-index-sm brand-eyebrow">{t.contact.formTitle}</h3>
                  <div className="mt-6">
                    <ContactForm locale={content.locale} messages={t} />
                  </div>
                </Reveal>
              </div>
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
