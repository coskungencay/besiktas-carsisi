import type { ThemeDefinition } from "@/themes/types";

import EditorialHero from "@/themes/shared/heroes/EditorialHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Beyaz Oda
 *
 * Gorsel kimligin tamami src/themes/beyaz-oda/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Beyaz Oda",
  description: "Saf beyaz, monospace gövde metni, editoryal ızgara.",
  scheme: "light",
  sections: { Hero: EditorialHero, About, Menu, Gallery, Contact },
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
