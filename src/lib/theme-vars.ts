/**
 * Admin panelinden degistirilebilen CSS degiskenleri.
 *
 * Buradaki liste yalnizca "hangi degiskenler duzenlenebilir" sorusunu yanitlar.
 * DEGERLER temadan gelir (ThemeDefinition.defaultColors) — burada sabit renk
 * tutmak, tema degistirildiginde yanlis paletin kaydedilmesine yol acardi.
 *
 * Yeni bir rengi panele acmak icin: buraya bir satir ekleyin, ardindan TUM
 * temalarin tokens.css + index.ts defaultColors kayitlarina ayni degiskeni
 * ekleyin. ("use server" dosyasindan export edilemedigi icin ayri modulde durur.)
 */
export const EDITABLE_COLOR_VARS = [
  { key: "--brand-primary", label: "Ana renk" },
  { key: "--brand-primary-contrast", label: "Ana renk üzerindeki yazı" },
  { key: "--brand-accent", label: "Vurgu rengi" },
  { key: "--brand-surface", label: "Zemin" },
  { key: "--brand-surface-alt", label: "İkincil zemin" },
  { key: "--brand-ink", label: "Yazı rengi" },
  { key: "--brand-ink-muted", label: "Soluk yazı" },
  { key: "--brand-border", label: "Kenarlık" },
] as const;

export type EditableColorVar = (typeof EDITABLE_COLOR_VARS)[number];
