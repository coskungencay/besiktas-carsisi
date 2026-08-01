import type { ThemeDefinition } from "@/themes/types";

import SplitHero from "@/themes/shared/heroes/SplitHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Placeholder (nötr)
 *
 * Gorsel kimligin tamami src/themes/placeholder/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Placeholder (nötr)",
  description: "Sade, nötr bir başlangıç teması. Tasarım seçilene kadar güvenli varsayılan.",
  scheme: "light",
  sections: [
    { id: "hero", Component: SplitHero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/placeholder/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#7A4A2B",
    "--brand-primary-contrast": "#FFFAF4",
    "--brand-accent": "#C98B4B",
    "--brand-surface": "#FBF7F2",
    "--brand-surface-alt": "#F2E9DE",
    "--brand-ink": "#2B1D13",
    "--brand-ink-muted": "#6D5B4C",
    "--brand-border": "#E2D4C3",
  },
};

export default theme;
