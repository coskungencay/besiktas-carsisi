import { DEFAULT_LOCALE, type Locale } from "./config";
import ar from "./messages/ar";
import de from "./messages/de";
import en from "./messages/en";
import es from "./messages/es";
import tr, { type Messages } from "./messages/tr";

export type { Messages };

const DICTIONARIES: Record<Locale, Messages> = { tr, en, es, de, ar };

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * "{name} galeri görseli {index}" gibi kaliplari doldurur.
 * Bilinmeyen anahtarlar oldugu gibi birakilir.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
