import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/vela/sections/About";
import Contact from "@/themes/vela/sections/Contact";
import Footer from "@/themes/vela/sections/Footer";
import Gallery from "@/themes/vela/sections/Gallery";
import Header from "@/themes/vela/sections/Header";
import Hero from "@/themes/vela/sections/Hero";
import Menu from "@/themes/vela/sections/Menu";

/**
 * Vela — bir butik otelin restoran sayfasi.
 *
 * Duzen kimligi: dikey ritim, cok bosluk, ortadan baslayan dar kolonlar,
 * kenardan kenara yatay bantlar ve altin sac teli cizgiler.
 * Renk/olcu kararlari src/themes/vela/tokens.css icinde.
 */
const theme: ThemeDefinition = {
  name: "Vela",
  description: "Koyu butik atmosfer, altın vurgu, geniş harf aralıkları.",
  scheme: "dark",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/vela/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#C4A265",
    "--brand-primary-contrast": "#0B0B0C",
    "--brand-accent": "#F2EDE4",
    "--brand-surface": "#0B0B0C",
    "--brand-surface-alt": "#111013",
    "--brand-ink": "#F2EDE4",
    "--brand-ink-muted": "#9A958C",
    "--brand-border": "#26242A",
  },
};

export default theme;
