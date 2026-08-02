import type { ThemeDefinition } from "@/themes/types";

import About from "@/themes/yesil-avlu/sections/About";
import Contact from "@/themes/yesil-avlu/sections/Contact";
import Faq from "@/themes/yesil-avlu/sections/Faq";
import Footer from "@/themes/yesil-avlu/sections/Footer";
import Gallery from "@/themes/yesil-avlu/sections/Gallery";
import Header from "@/themes/yesil-avlu/sections/Header";
import Hero from "@/themes/yesil-avlu/sections/Hero";
import Location from "@/themes/yesil-avlu/sections/Location";
import Menu from "@/themes/yesil-avlu/sections/Menu";
import MenuPage from "@/themes/yesil-avlu/sections/MenuPage";
import Testimonials from "@/themes/yesil-avlu/sections/Testimonials";

/**
 * Yeşil Avlu — botanik bahce.
 *
 * Tum bolumler bu klasorde ve tek eksende ORTALANMIS bir duzen kurar; gorsel
 * kimlik src/themes/yesil-avlu/tokens.css icinde. Ortak katmandan yalnizca
 * MANTIK alinir (@/themes/_shared).
 */
const theme: ThemeDefinition = {
  name: "Yeşil Avlu",
  description: "Botanik yeşiller, krem zemin, yumuşak ve geniş yuvarlatmalar.",
  scheme: "light",
  Header,
  sections: [
    { id: "hero", Component: Hero },
    { id: "hakkimizda", Component: About },
    /* Ana sayfadaki "menu" artik VITRIN; tam liste MenuPage'de (/tr/menu). */
    { id: "menu", Component: Menu },
    { id: "galeri", Component: Gallery },
    /*
     * Yorumlar ve SSS galeriden sonra: once mekan gorulur, sonra baskalari
     * anlatir, sonra sorular kapanir. Konum iletisimden hemen once duruyor
     * cunku ikisi birlikte sayfanin "ziyaret" bolumunu olusturuyor.
     */
    { id: "yorumlar", Component: Testimonials },
    { id: "sss", Component: Faq },
    { id: "konum", Component: Location },
    { id: "iletisim", Component: Contact },
  ],
  Footer,
  MenuPage,
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
