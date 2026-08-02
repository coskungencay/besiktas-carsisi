import { Fragment } from "react";

import { placeStamp } from "@/themes/_shared/data";
import {
  edgeBottom,
  edgeTop,
  label,
  padStrip,
  shell,
} from "@/themes/tesviye/parts";
import type { SectionProps } from "@/themes/types";

/**
 * Kalin ust kenarlikli kunye seridi. Sosyal hesap varsa kunyenin ustune
 * ikinci bir serit gelir; hesap yoksa o serit hic basilmaz.
 */
export default function Footer({ content }: SectionProps) {
  const { name, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = placeStamp(content);

  return (
    <footer className="brand-body bg-[var(--brand-surface)]" style={edgeTop}>
      {socialLinks.length > 0 ? (
        <div style={edgeBottom}>
          <div
            className={`${shell} ${padStrip} flex flex-wrap items-center gap-x-5 gap-y-2`}
          >
            <h2 className={`${label} text-[var(--brand-primary)]`}>
              {t.social.title}
            </h2>

            {/*
             * Ikon YOK: bu temada baglantilar da kunye hucresi gibi metin.
             * Ayrac olarak ust seritteki egik cizgi tekrar ediliyor.
             */}
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[length:var(--ts-label-lg)] leading-[1.4] font-medium tracking-[var(--ts-track-nav)] uppercase">
              {socialLinks.map((link, index) => (
                <Fragment key={`${link.platform}-${index}`}>
                  {index > 0 ? (
                    <li aria-hidden="true" className="opacity-30">
                      /
                    </li>
                  ) : null}
                  <li>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="underline-offset-4 transition-colors hover:text-[var(--brand-primary)] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div
        // Tasarimdaki alt kunye: 11px, agirlik 400, ls .14em, soluk murekkep,
        // dolgu 16px/30px ve uc oge esit araliklarla dagitilmis.
        className={`${shell} brand-body flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-[length:var(--ts-label)] leading-[1.5] tracking-[var(--ts-track-table)] uppercase text-[var(--brand-ink-muted)] sm:px-[30px]`}
      >
        <p>
          © {year} {name}
        </p>

        {contact.locality ? <p>{contact.locality}</p> : null}

        {coords ? (
          <p className="tabular-nums" dir="ltr">
            {coords}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
