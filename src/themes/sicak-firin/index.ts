import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/sicak-firin/sections/About";
import Contact from "@/themes/sicak-firin/sections/Contact";
import Faq from "@/themes/sicak-firin/sections/Faq";
import Footer from "@/themes/sicak-firin/sections/Footer";
import Gallery from "@/themes/sicak-firin/sections/Gallery";
import Header from "@/themes/sicak-firin/sections/Header";
import Hero from "@/themes/sicak-firin/sections/Hero";
import Location from "@/themes/sicak-firin/sections/Location";
import Menu from "@/themes/sicak-firin/sections/Menu";
import Testimonials from "@/themes/sicak-firin/sections/Testimonials";

/**
 * Sıcak Fırın — mahalle firini.
 *
 * Tum bolumler bu klasorun altinda; ortak katmandan yalnizca MANTIK alinir
 * (@/themes/_shared). Gorsel kimlik tokens.css icinde: yumusak yaricap, sicak
 * firin tonlari, kenarlik yerine dolgulu yuzeyler.
 */
const theme: ThemeDefinition = {
  name: "Sıcak Fırın",
  description:
    "Mahalle fırını sıcaklığı: Zilla Slab başlıklar, Karla gövde, kesik çizgiler ve yumuşak köşeler.",
  scheme: "light",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    /*
     * Yorumlar ve sorular vitrinden SONRA, konumdan ONCE: once "nasil bir yer"
     * anlatiliyor, sonra "nerede ve ne zaman" soyleniyor. Konum ile iletisim
     * yan yana durunca sayfanin sonu tek bir masa gibi topluyor.
     */
    { id: "yorumlar", Component: Testimonials },
    { id: "sss", Component: Faq },
    { id: "konum", Component: Location },
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
