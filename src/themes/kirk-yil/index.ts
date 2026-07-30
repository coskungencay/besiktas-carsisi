import type { ThemeDefinition } from "@/themes/types";

import CenteredHero from "@/themes/shared/heroes/CenteredHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Kırk Yıl
 *
 * Gorsel kimligin tamami src/themes/kirk-yil/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Kırk Yıl",
  description: "Nostaljik bordo ve altın, baştan sona serif, ortalanmış klasik düzen.",
  scheme: "light",
  sections: { Hero: CenteredHero, About, Menu, Gallery, Contact },
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
