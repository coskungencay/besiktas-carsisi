import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/tesviye/sections/About";
import Contact from "@/themes/tesviye/sections/Contact";
import Footer from "@/themes/tesviye/sections/Footer";
import Gallery from "@/themes/tesviye/sections/Gallery";
import Header from "@/themes/tesviye/sections/Header";
import Hero from "@/themes/tesviye/sections/Hero";
import Menu from "@/themes/tesviye/sections/Menu";

/**
 * Tesviye — teknik cizim paftasi.
 *
 * Her bolum kalin cerceveli tek bir kutu; kutunun basinda numarali monospace
 * kunye, ic bolmeler yine kalin cizgilerle ayrilmis. Gorsel kimligin kaynagi
 * src/themes/tesviye/tokens.css, ortak katmandan yalnizca MANTIK alinir.
 */
const theme: ThemeDefinition = {
  name: "Tesviye",
  description: "Brutalist çerçeveler, elektrik mavisi, kalın kenarlıklar ve monospace.",
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
  tokensPath: "src/themes/tesviye/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#0B4CFF",
    "--brand-primary-contrast": "#F0EEE9",
    "--brand-accent": "#16171A",
    "--brand-surface": "#D6D3CC",
    "--brand-surface-alt": "#C2BFB8",
    "--brand-ink": "#16171A",
    "--brand-ink-muted": "#5C5E63",
    "--brand-border": "#16171A",
  },
};

export default theme;
