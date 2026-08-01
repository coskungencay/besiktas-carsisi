import type { ThemeDefinition } from "@/themes/types";

import FramedHero from "@/themes/shared/heroes/FramedHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Tesviye
 *
 * Gorsel kimligin tamami src/themes/tesviye/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Tesviye",
  description: "Brutalist çerçeveler, elektrik mavisi, kalın kenarlıklar ve monospace.",
  scheme: "light",
  sections: [
    { id: "hero", Component: FramedHero },
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
