import { Latin } from "@/components/site/Latin";
import { placeStamp } from "@/themes/_shared/data";
import { shell, surface } from "@/themes/beyaz-oda/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Tasarimin kapanis seridi: 12 kolona yayilan uc kucuk mono hucre —
 * marka, koordinat, telif. Ust boslugu 80px, cizgiden sonra 20px.
 *
 * Sosyal baglantilar seridin USTUNDE, sayfanin her yerinde tekrarlanan
 * 2 + 10 kolonluk (etiket / icerik) ritimle duruyor. Baglanti girilmemisse
 * blok hic basilmaz, serit tek basina kalir.
 */
export default function Footer({ content }: SectionProps) {
  const { name, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = placeStamp(content);

  return (
    <footer className={surface}>
      <div className={shell}>
        {socialLinks.length > 0 ? (
          <div className="mt-20 grid gap-x-6 gap-y-3 border-t border-[var(--brand-border)] pt-5 sm:grid-cols-12">
            <h2 id="social-title" className="bo-index-sm brand-eyebrow sm:col-span-2">
              {t.social.title}
            </h2>

            <nav
              aria-labelledby="social-title"
              className="sm:col-span-10 sm:col-start-3"
            >
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {socialLinks.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    {/*
                      Ikon yok — tasarimda hicbir marka glifi yok, baglantilar
                      da diger her sey gibi mono etiket. Renk/boyut Tailwind
                      utility'sinden geliyor; bo-index-sm kullanilsaydi kendi
                      rengi (0,2,1 ozgullugu) hover'i ezerdi.
                    */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="bo-mono brand-eyebrow border-b border-transparent pb-[3px] font-light text-[10.5px] text-[var(--brand-ink-muted)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                    >
                      <Latin>{link.label}</Latin>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : null}

        {/*
          Sosyal blok varsa serit ondan hemen sonra gelir (ikinci bir 80px
          bosluk ve ikinci bir cizgi ritmi bozardi).
        */}
        <div
          /* Sayfanin alt boslugu tasarimda 60px — iletisim bolumunun degil,
             seridin altinda. */
          className={`grid gap-x-6 gap-y-2 pb-[60px] sm:grid-cols-12 ${
            socialLinks.length > 0
              ? "mt-10"
              : "mt-20 border-t border-[var(--brand-border)] pt-5"
          }`}
        >
          <p className="bo-index-sm brand-eyebrow sm:col-span-4">{name}</p>

          {/*
            Tasarimda serit BUTUN olarak ayni harf araligina sahip. brand-eyebrow
            kullaniliyor cunku sabit tracking Arapca'da bitisik yaziyi koparir;
            utility Arapca'da araligi sifirliyor.
          */}
          {coords ? (
            <p className="bo-index-sm brand-eyebrow sm:col-span-4" dir="ltr">
              {coords}
            </p>
          ) : null}

          <p className="bo-index-sm brand-eyebrow sm:col-span-4 sm:col-start-9 sm:text-end">
            © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
