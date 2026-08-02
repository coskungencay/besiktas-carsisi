import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { hasMenu } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/kirk-yil/parts";
import type { SectionProps } from "@/themes/types";

/**
 * TEK ince serit: solda kurulus/semt, ortada nav, sagda telefon.
 *
 * NEDEN MARKA ADI YOK: tasarimda isletme adi hero'nun kendisi — 132px'lik dev
 * baslik. Adi bir de header'a koymak ayni kelimeyi 100px arayla iki kez
 * gosteriyor ve tabelanin etkisini dagitiyordu. Onceki hali uc kat yuksekti
 * (marka + slogan + nav); tasarimda serit 16px dolgulu tek satir.
 *
 * Alt kenarlik cift cizgi (3px double) — tasarimin imzasi.
 */
export default function Header({ content }: SectionProps) {
  const { name, contact, t } = content;

  /*
   * Bolumler icerik bosken kendini basmiyor; nav de AYNI kosullari kullanmali,
   * yoksa musteri galeri yuklemeden yayina alinca "Galeri" linki hicbir yere
   * gitmeyen kirik bir capa olur.
   */
  const links = [
    (content.about || content.openingHours.length > 0) && {
      href: "#hakkimizda",
      label: t.about.title,
    },
    hasMenu(content) && { href: "#menu", label: t.menu.eyebrow },
    content.isVisible("galeri") && {
      href: "#galeri",
      label: t.gallery.eyebrow,
    },
    { href: "#iletisim", label: t.contact.eyebrow },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    // ky-fade: tasarimda serit sayfayla birlikte usulca beliriyor.
    <header
      /*
        Cift cizgi rengi tasarimda mürekkebin %32 opakligi; --brand-border
        (#D3C4A8) bunun yaninda belirgin sekilde soluk kaliyor ve serit
        sayfadan ayrilmiyordu. color-mix ile token'a dokunmadan tasarimdaki
        tonu uretiyoruz.
      */
      className={`${surface} brand-body ky-fade border-b-[3px] border-double border-[color-mix(in_srgb,var(--brand-ink)_32%,transparent)]`}
    >
      <div
        className={`${shell} pe-14 sm:pe-0 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4`}
      >
        {/*
          Sol uc: tasarimda "Est. 1986 · Beyoglu". Bizde kurulus yili diye bir
          alan yok; semt/sehir ayni islevi goruyor (nerede oldugumuz), yoksa
          slogana duseriz.
        */}
        <span className="ky-strip text-[var(--brand-ink-muted)]">
          {contact.locality || content.tagline}
        </span>

        <nav aria-label={name}>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="ky-strip text-[var(--brand-primary)] underline-offset-[6px] transition-colors hover:text-[var(--brand-accent)] hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Sag uc: tasarimda telefon numarasi. Girilmemisse hic basilmaz. */}
          {contact.phone ? (
            <a
              href={contact.phoneHref}
              dir="ltr"
              className="ky-strip text-[var(--brand-ink-muted)] transition-colors hover:text-[var(--brand-primary)]"
            >
              {contact.phone}
            </a>
          ) : null}

          {/* Tek dil aciksa secici hic basilmaz. */}
          {content.locales.length > 1 ? (
            <LocaleSwitcher content={content} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
