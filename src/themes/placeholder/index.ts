import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/placeholder/sections/About";
import Contact from "@/themes/placeholder/sections/Contact";
import Footer from "@/themes/placeholder/sections/Footer";
import Gallery from "@/themes/placeholder/sections/Gallery";
import Hero from "@/themes/placeholder/sections/Hero";
import Menu from "@/themes/placeholder/sections/Menu";

/**
 * Placeholder (notr)
 *
 * Bilerek karaktersiz: tema secilene kadar guvenli varsayilan, ayni zamanda
 * yeni tema yazarken kopyalanacak en sade iskelet. Header'i yoktur; dil secici
 * bu yuzden sayfa tarafindan basilir (bkz. app/[locale]/page.tsx).
 */
const theme: ThemeDefinition = {
  name: "Placeholder (nötr)",
  description: "Sade, nötr bir başlangıç teması. Tasarım seçilene kadar güvenli varsayılan.",
  scheme: "light",
  sections: [
    { id: "hero", Component: Hero },
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
