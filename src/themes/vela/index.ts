import type { ThemeDefinition } from "@/themes/types";

import OverlayHero from "@/themes/shared/heroes/OverlayHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Vela
 *
 * Gorsel kimligin tamami src/themes/vela/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Vela",
  description: "Koyu butik atmosfer, altın vurgu, geniş harf aralıkları.",
  scheme: "dark",
  sections: [
    { id: "hero", Component: OverlayHero },
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
