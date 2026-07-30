import type { ThemeDefinition } from "@/themes/types";

import OverlayHero from "@/themes/shared/heroes/OverlayHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Patika
 *
 * Gorsel kimligin tamami src/themes/patika/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Patika",
  description: "Koyu zemin, neon sarı vurgu, kalın tipografi ve yuvarlak köşeler.",
  scheme: "dark",
  sections: { Hero: OverlayHero, About, Menu, Gallery, Contact },
  tokensPath: "src/themes/patika/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#D9FF4D",
    "--brand-primary-contrast": "#0D0D0C",
    "--brand-accent": "#FF6B3D",
    "--brand-surface": "#0D0D0C",
    "--brand-surface-alt": "#16160F",
    "--brand-ink": "#F6F4EC",
    "--brand-ink-muted": "#B9B6AA",
    "--brand-border": "#2C2C24",
  },
};

export default theme;
