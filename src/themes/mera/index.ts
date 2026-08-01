import type { ThemeDefinition } from "@/themes/types";

import SplitHero from "@/themes/shared/heroes/SplitHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Mera
 *
 * Gorsel kimligin tamami src/themes/mera/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Mera",
  description: "Editoryal serif başlıklar, sıcak toprak tonları, keskin köşeler.",
  scheme: "light",
  sections: [
    { id: "hero", Component: SplitHero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/mera/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#A9502F",
    "--brand-primary-contrast": "#FFFFFF",
    "--brand-accent": "#1A1714",
    "--brand-surface": "#F2EFE7",
    "--brand-surface-alt": "#E5E0D3",
    "--brand-ink": "#1A1714",
    "--brand-ink-muted": "#6F675C",
    "--brand-border": "#DDD6C8",
  },
};

export default theme;
