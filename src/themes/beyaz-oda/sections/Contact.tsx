import { Reveal } from "@/components/motion/Reveal";
import { fill } from "@/i18n";
import { ArrowIcon } from "@/themes/_shared/icons";
import {
  SectionIndex,
  sectionGrid,
  sectionTop,
  surface,
} from "@/themes/beyaz-oda/parts";
import { ContactForm } from "@/themes/beyaz-oda/sections/ContactForm";
import type { SectionProps } from "@/themes/types";

type Row = { term: string; value: string; href: string; ltr: boolean };

/**
 * Tasarimda sayfanin ikinci buyuk tipografisi burada: solda 40px'lik kisa bir
 * cumle, (Konum bolumu kapaliysa) altinda adres ve harita baglantisi; sagda
 * 14px'lik iletisim satirlari. Form tasarimda yok ama urunun zorunlu parcasi,
 * sag kolonun altina ayni ritimle yerlesiyor.
 */
export default function Contact({ content }: SectionProps) {
  const { contact, name, t } = content;

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
      <div className={`${sectionTop} pb-[60px]`}>
        <div className={sectionGrid}>
          {/* Kisa etiket — gerekce Menu.tsx'te. */}
          {/* Indeks sayfadaki SIRAYI gosterir; iletisim artik son bolum. */}
          <SectionIndex index="07" title={t.contact.eyebrow} titleId="contact-title">
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
                Tasarimda sag blok 12'li izgaranin 7. kolonunda basliyor; bu
                ic izgara 3. kolondan basladigi icin karsiligi 5. kolon.
              */}
              <div className="flex flex-col gap-12 lg:col-span-6 lg:col-start-5">
                {rows.length > 0 ? (
                  <Reveal delay={0.1}>
                    <dl className="flex flex-col">
                      {rows.map((row, index) => (
                        <div
                          key={`${row.term}-${index}`}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--brand-border)] py-[11px]"
                        >
                          {/*
                            Tasarimda 11px dikey boslukla akan bu tablo (saatler
                            blogu) mono DEGIL: iki hucre de 14px grotesk, etiket
                            soluk. Mono/BUYUK harf bicimi tasarimda yalnizca
                            13px'lik kunye tablosunda kullaniliyor.
                          */}
                          <dt className="text-[14px] text-[var(--brand-ink-soft)]">
                            {row.term}
                          </dt>
                          <dd
                            className="text-end text-[14px]"
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
                  </Reveal>
                ) : null}

                <Reveal delay={0.16}>
                  {/* Tasarimda blok basliklari ("SAATLER", "BAGLANTI") 10.5px. */}
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
