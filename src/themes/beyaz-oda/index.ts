import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/beyaz-oda/sections/About";
import Contact from "@/themes/beyaz-oda/sections/Contact";
import Footer from "@/themes/beyaz-oda/sections/Footer";
import Gallery from "@/themes/beyaz-oda/sections/Gallery";
import Header from "@/themes/beyaz-oda/sections/Header";
import Hero from "@/themes/beyaz-oda/sections/Hero";
import Menu from "@/themes/beyaz-oda/sections/Menu";

/**
 * Beyaz Oda — tasarimina gore yeniden yazilmis ILK tema.
 *
 * Bu tema paylasilan bir bolum kullanmaz: tum bolumler sections/ altinda,
 * gorsel kimlik tokens.css icinde. Ortak katmandan yalnizca MANTIK alir
 * (@/themes/_shared). Yeni tema yazarken ornek alinacak yapi budur.
 */
const theme: ThemeDefinition = {
  name: "Beyaz Oda",
  description: "Saf beyaz, monospace gövde metni, editoryal ızgara.",
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
  tokensPath: "src/themes/beyaz-oda/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#101112",
    "--brand-primary-contrast": "#FFFFFF",
    "--brand-accent": "#46606E",
    "--brand-surface": "#FFFFFF",
    "--brand-surface-alt": "#F2F3F4",
    "--brand-ink": "#101112",
    "--brand-ink-muted": "#6E7479",
    "--brand-border": "#E4E5E7",
  },
};

export default theme;
