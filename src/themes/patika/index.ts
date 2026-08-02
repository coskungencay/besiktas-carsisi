import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/patika/sections/About";
import Contact from "@/themes/patika/sections/Contact";
import Faq from "@/themes/patika/sections/Faq";
import Footer from "@/themes/patika/sections/Footer";
import Gallery from "@/themes/patika/sections/Gallery";
import Header from "@/themes/patika/sections/Header";
import Hero from "@/themes/patika/sections/Hero";
import Location from "@/themes/patika/sections/Location";
import Menu from "@/themes/patika/sections/Menu";
import Testimonials from "@/themes/patika/sections/Testimonials";

/**
 * Patika — "konser afisi" duzeni.
 *
 * Tema paylasilan bir bolum kullanmaz: butun bolumler sections/ altinda,
 * gorsel kimlik tokens.css icinde. Ortak katmandan yalnizca MANTIK alinir
 * (@/themes/_shared).
 */
const theme: ThemeDefinition = {
  name: "Patika",
  description: "Koyu zemin, neon sarı vurgu, kalın tipografi ve yuvarlak köşeler.",
  scheme: "dark",
  Header,
  /*
   * Sira sosyal kanit ritmi izler: once urun (menu) ve mekan (galeri), sonra
   * baskasinin sozu (yorumlar), tereddutlerin cevabi (sss), en sonda "gel"
   * cagrisi (konum + iletisim). Konum iletisimden HEMEN once: adres ve yol
   * tarifi, sayfayi kapatan lime iletisim blogunun hazirligi.
   */
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    { id: "yorumlar", Component: Testimonials },
    { id: "sss", Component: Faq },
    { id: "konum", Component: Location },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
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
