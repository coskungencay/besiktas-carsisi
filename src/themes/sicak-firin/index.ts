import type { ThemeDefinition } from "@/themes/types";

import SplitHero from "@/themes/shared/heroes/SplitHero";
import About from "@/themes/shared/sections/About";
import Contact from "@/themes/shared/sections/Contact";
import Gallery from "@/themes/shared/sections/Gallery";
import Footer from "@/themes/shared/Footer";
import Menu from "@/themes/shared/sections/Menu";

/**
 * Sıcak Fırın
 *
 * Gorsel kimligin tamami src/themes/sicak-firin/tokens.css icindedir.
 * Bolumler paylasilan uygulamalardan gelir; bu temaya ozel bir duzen
 * gerekirse ilgili bolumu bu klasorde yazip asagida degistirin.
 */
const theme: ThemeDefinition = {
  name: "Sıcak Fırın",
  description: "Mahalle fırını sıcaklığı, yumuşak köşeler, tracking’siz samimi etiketler.",
  scheme: "light",
  sections: [
    { id: "hero", Component: SplitHero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  tokensPath: "src/themes/sicak-firin/tokens.css",
  // tokens.css ile ayni tutulmali
  defaultColors: {
    "--brand-primary": "#8A5524",
    "--brand-primary-contrast": "#FFFBF3",
    "--brand-accent": "#A63A50",
    "--brand-surface": "#FFFBF3",
    "--brand-surface-alt": "#F6E7CE",
    "--brand-ink": "#3A2A1C",
    "--brand-ink-muted": "#7A6551",
    "--brand-border": "#EBDCC2",
  },
};

export default theme;
