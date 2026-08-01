import type { ThemeDefinition } from "@/themes/types";

import SplitHero from "@/themes/shared/heroes/SplitHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Yeşil Avlu
 *
 * Gorsel kimligin tamami src/themes/yesil-avlu/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Yeşil Avlu",
  description: "Botanik yeşiller, krem zemin, yumuşak ve geniş yuvarlatmalar.",
  scheme: "light",
  sections: [
    { id: "hero", Component: SplitHero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/yesil-avlu/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#1F3A2C",
    "--brand-primary-contrast": "#FAF7EF",
    "--brand-accent": "#7C8F5E",
    "--brand-surface": "#FAF7EF",
    "--brand-surface-alt": "#DFE3D5",
    "--brand-ink": "#1F3A2C",
    "--brand-ink-muted": "#7A8B72",
    "--brand-border": "#DDE2D2",
  },
};

export default theme;
