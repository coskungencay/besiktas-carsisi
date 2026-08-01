import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/sicak-firin/sections/About";
import Contact from "@/themes/sicak-firin/sections/Contact";
import Footer from "@/themes/sicak-firin/sections/Footer";
import Gallery from "@/themes/sicak-firin/sections/Gallery";
import Header from "@/themes/sicak-firin/sections/Header";
import Hero from "@/themes/sicak-firin/sections/Hero";
import Menu from "@/themes/sicak-firin/sections/Menu";

/**
 * Sıcak Fırın — mahalle firini.
 *
 * Tum bolumler bu klasorun altinda; ortak katmandan yalnizca MANTIK alinir
 * (@/themes/_shared). Gorsel kimlik tokens.css icinde: yumusak yaricap, sicak
 * firin tonlari, kenarlik yerine dolgulu yuzeyler.
 */
const theme: ThemeDefinition = {
  name: "Sıcak Fırın",
  description: "Mahalle fırını sıcaklığı, yumuşak köşeler, tracking’siz samimi etiketler.",
  scheme: "light",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/sicak-firin/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#8A5524",
    "--brand-primary-contrast": "#FFFBF3",
    "--brand-accent": "#A63A50",
    "--brand-surface": "#FFFBF3",
    "--brand-surface-alt": "#F6E7CE",
    "--brand-ink": "#3A2A1C",
    "--brand-ink-muted": "#7A6551",
    "--brand-border": "#EBDCC2",
  },
};

export default theme;
