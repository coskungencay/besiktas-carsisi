import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/kirk-yil/sections/About";
import Contact from "@/themes/kirk-yil/sections/Contact";
import Footer from "@/themes/kirk-yil/sections/Footer";
import Gallery from "@/themes/kirk-yil/sections/Gallery";
import Header from "@/themes/kirk-yil/sections/Header";
import Hero from "@/themes/kirk-yil/sections/Hero";
import Menu from "@/themes/kirk-yil/sections/Menu";

/**
 * Kırk Yıl
 *
 * Gorsel kimligin tamami src/themes/kirk-yil/tokens.css icindedir; duzen
 * kimligi (cift cizgi, tam simetri, passe-partout cerceveler) bu klasordeki
 * sections/ ve parts.tsx icinde. Ortak katmandan yalnizca MANTIK alinir.
 */
const theme: ThemeDefinition = {
  name: "Kırk Yıl",
  description: "Nostaljik bordo ve altın, baştan sona serif, ortalanmış klasik düzen.",
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
  tokensPath: "src/themes/kirk-yil/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#6E1F26",
    "--brand-primary-contrast": "#EDE3D0",
    "--brand-accent": "#B08A45",
    "--brand-surface": "#EDE3D0",
    "--brand-surface-alt": "#E2D5BD",
    "--brand-ink": "#2A211B",
    "--brand-ink-muted": "#6A5B4C",
    "--brand-border": "#D3C4A8",
  },
};

export default theme;
