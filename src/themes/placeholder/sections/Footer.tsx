import { Latin } from "@/components/site/Latin";
import type { SectionProps } from "@/themes/types";

/**
 * LEGACY footer — henuz tasarimina gore yeniden yazilmamis temalar kullanir.
 * Yeni temalar kendi Footer'ini yazar (bkz. THEMING.md).
 *
 * Zemin olarak `--brand-ink` degil `--brand-surface-alt` kullanilir: ink'i zemin
 * yapmak koyu temalarda (patika, vela) rengi ters cevirirdi.
 */
export default function Footer({ content }: SectionProps) {
  const year = new Date().getFullYear();
  const { socialLinks, t } = content;

  return (
    <footer className="brand-body border-t border-[var(--brand-border)] bg-[var(--brand-surface-alt)] py-10 text-[var(--brand-ink-muted)]">
      <div className="mx-auto flex w-full max-w-[var(--brand-container)] flex-col gap-4 px-6 sm:px-10">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {content.name}
          </p>
          {content.contact.address ? (
            <p className="text-pretty">{content.contact.address}</p>
          ) : null}
        </div>

        {/*
         * Sosyal baglantilar: hesap girilmemisse ayirici cizgi dahil hic
         * basilmaz. Ikon yerine platform adi yaziliyor — notr tema kendi
         * marka cizimlerini tasimaz, metin her dilde okunur kalir.
         */}
        {socialLinks.length > 0 ? (
          <nav
            aria-label={t.social.title}
            className="border-t border-[var(--brand-border)] pt-4"
          >
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="underline-offset-4 transition-colors hover:text-[var(--brand-primary)] hover:underline"
                  >
                    <Latin>{link.label}</Latin>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </footer>
  );
}
