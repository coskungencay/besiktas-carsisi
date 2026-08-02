import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/mera/sections/About";
import Contact from "@/themes/mera/sections/Contact";
import Faq from "@/themes/mera/sections/Faq";
import Footer from "@/themes/mera/sections/Footer";
import Gallery from "@/themes/mera/sections/Gallery";
import Header from "@/themes/mera/sections/Header";
import Hero from "@/themes/mera/sections/Hero";
import Location from "@/themes/mera/sections/Location";
import Menu from "@/themes/mera/sections/Menu";
import Testimonials from "@/themes/mera/sections/Testimonials";

/**
 * Mera — bir yemek dergisinin ic sayfasi.
 *
 * Tum bolumler bu klasorde; paylasilan katmandan yalnizca MANTIK alinir
 * (@/themes/_shared). Gorsel kimligin tamami src/themes/mera/tokens.css
 * icindedir: serif basliklar, keskin koseler, sicak toprak tonlari.
 */
const theme: ThemeDefinition = {
  name: "Mera",
  description: "Editoryal serif başlıklar, sıcak toprak tonları, keskin köşeler.",
  scheme: "light",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    // Yorumlar ve sorular gorselden sonra: dergi once mekani gosterir, sonra
    // okur mektuplarina gecer. Konum, kapanis kunyesinden (iletisim) hemen
    // once — sayfa "buraya gelin" diyerek biter.
    { id: "yorumlar", Component: Testimonials },
    { id: "sss", Component: Faq },
    { id: "konum", Component: Location },
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
