import Image from "next/image";

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
  const { contact, name, openingHours, logoUrl, t } = content;

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

  /*
   * Uclu seritte GERCEKTEN basilacak sutun sayisi — izgara buna gore
   * 2 ya da 3 kolona kuruluyor; bos bir sutun basilmiyor.
   */
  const columnCount =
    (showAddress ? 1 : 0) + (hours.length > 0 ? 1 : 0) + (rows.length > 0 ? 1 : 0);

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
          <SectionIndex index={sectionIndex(content, "iletisim")} eyebrow={t.contact.eyebrow}
            title={t.contact.title} titleId="contact-title">
            {/*
              ORTALANMIS AMA GENIS. Onceki hali sol hizali uc kolondu ve
              ortalanmis basligin altinda kopuk duruyordu; dar bir ortalanmis
              sutuna almak da sayfayi ince bir seride cevirirdi.

              Simdi: giris cumlesi ortada, altinda UC ESIT SUTUN (adres /
              saatler / baglanti) sayfanin genisligine yayiliyor ve her
              sutunun kendi icerigi ortalanmis. Aralarinda hairline ayirac.
            */}
            <div className="mx-auto max-w-[76rem]">
              <Reveal>
                <p className="bo-statement mx-auto max-w-[26ch] text-center text-[clamp(1.5rem,2.9vw,2.375rem)] leading-[1.28] text-balance">
                  {fill(t.contact.intro, { name })}
                </p>
              </Reveal>

              {/*
                Sutun sayisi ICERIGE gore. Adres sutunu cogu zaman BOS kalir:
                Konum bolumu gorunurken adres orada zaten buyuk buyuk yaziyor
                ve burada tekrar edilmiyor (showAddress). Sutunu yine de
                basmak, ortada bos bir "ADRES" basligi birakiyordu.
              */}
              <div
                className={`mt-16 grid gap-px border-y border-[var(--brand-border)] bg-[var(--brand-border)] sm:mt-20 ${
                  columnCount >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                }`}
              >
                {showAddress ? (
                  <div className="bg-[var(--brand-surface)] px-6 py-10 text-center">
                  <h3 className="bo-index-sm brand-eyebrow">{t.contact.address}</h3>
                  <Reveal delay={0.08}>
                    <p className="mt-4 text-[15px] leading-[1.85] text-pretty text-[var(--brand-ink-soft)]">
                      {contact.address}
                    </p>

                    {contact.mapsUrl ? (
                      <a
                        href={contact.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bo-tap mt-6 inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-[3px] text-[13px] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                      >
                        <span>{t.location.directions}</span>
                        <ArrowIcon className="size-3.5" />
                      </a>
                    ) : null}
                  </Reveal>
                  </div>
                ) : null}

              {/*
                Orta kolon — CALISMA SAATLERI.
                Tasarimda 12'li izgaranin 7. kolonunda 3 kolon genisliginde;
                bu ic izgara 3. kolondan basladigi icin karsiligi 5. kolon.
              */}
              {hours.length > 0 ? (
                <div className="bg-[var(--brand-surface)] px-6 py-10 text-center">
                  <Reveal delay={0.1}>
                    <h3 className="bo-index-sm brand-eyebrow">
                      {t.about.openingHours}
                    </h3>

                    {/*
                      Tasarimda 11px dikey boslukla akan bu tablo mono DEGIL:
                      iki hucre de 14px grotesk, gun adi soluk, saat koyu.
                      Mono/BUYUK harf bicimi tasarimda yalnizca 11.5px'lik
                      kunye tablosunda kullaniliyor.
                    */}
                    <dl className="mx-auto mt-4 flex max-w-[18rem] flex-col text-[14px]">
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
                <div className="bg-[var(--brand-surface)] px-6 py-10 text-center">
                  <Reveal delay={0.16}>
                    <h3 className="bo-index-sm brand-eyebrow">
                      {t.contact.eyebrow}
                    </h3>

                    {/*
                      Satir araligi telefonda aciliyor (2.1 -> 2.75, yani
                      31px -> 41px). bo-tap her satirin ustune/altina 10'ar
                      piksel ekliyor; 31px'lik aralikta telefon ile e-posta
                      hedefleri UST USTE BINIYORDU ve numaranin biraz altina
                      dokunan biri e-posta uygulamasini aciyordu. Yanlis
                      hedefi acmak, hedefi isabetsiz kacirmaktan daha kotu.
                    */}
                    <ul className="mx-auto mt-4 max-w-[18rem] text-[15px] leading-[2.75] sm:leading-[2.1]">
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
                            /* bo-tap: 19px'lik satirlar telefonda hedef degil. */
                            className="bo-tap underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
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

                    {/*
                      Amblem sutunun BOSLUGUNU dolduruyor.

                      Uclu seritte sutunlar ayni yukseklikte ama icerikleri
                      degil: calisma saatleri yedi satir, iletisim uc satir.
                      Bu sutunun altinda yarim ekranlik bos alan kaliyordu ve
                      serit dengesiz duruyordu. Amblem hem o bosluga oturuyor
                      hem de seridin kapanisini markaya baglıyor.

                      `mt-auto` DEGIL sabit bosluk: sutun flex degil, sabit
                      bosluk her ekran genisliginde ayni ritmi veriyor.
                    */}
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt=""
                        aria-hidden="true"
                        width={112}
                        height={112}
                        className="mx-auto mt-12 size-16 object-contain opacity-70 sm:size-20"
                      />
                    ) : null}
                  </Reveal>
                </div>
              ) : null}
              </div>
            </div>

            {/*
              Form uclu seridin ALTINDA, ortalanmis ve dar. Sutunlarin arasina
              sikistirmak formu okunmaz genislige dusuruyordu; kendi satirinda
              durunca alanlar rahat nefes aliyor.
            */}
            <div className="mx-auto mt-20 max-w-[46rem] text-center">
              <Reveal delay={0.1}>
                <h3 className="bo-index-sm brand-eyebrow">{t.contact.formTitle}</h3>
                <div className="mt-6 text-start">
                  <ContactForm locale={content.locale} messages={t} />
                </div>
              </Reveal>
            </div>
          </SectionIndex>
        </div>
      </div>
    </section>
  );
}
