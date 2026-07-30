/**
 * Admin panelinden degistirilebilen CSS degiskenleri.
 *
 * Yeni bir renk degiskenini panele acmak icin buraya bir satir ekleyin ve
 * temanizin tokens.css dosyasinda ayni degiskeni tanimlayin.
 * ("use server" dosyasindan export edilemedigi icin ayri modulde durur.)
 */
export const EDITABLE_COLOR_VARS = [
  { key: "--brand-primary", label: "Ana renk", fallback: "#7a4a2b" },
  {
    key: "--brand-primary-contrast",
    label: "Ana renk üzerindeki yazı",
    fallback: "#fffaf4",
  },
  { key: "--brand-accent", label: "Vurgu rengi", fallback: "#c98b4b" },
  { key: "--brand-surface", label: "Zemin", fallback: "#fbf7f2" },
  { key: "--brand-surface-alt", label: "İkincil zemin", fallback: "#f2e9de" },
  { key: "--brand-ink", label: "Yazı rengi", fallback: "#2b1d13" },
  { key: "--brand-ink-muted", label: "Soluk yazı", fallback: "#6d5b4c" },
  { key: "--brand-border", label: "Kenarlık", fallback: "#e2d4c3" },
] as const;

export type EditableColorVar = (typeof EDITABLE_COLOR_VARS)[number];
