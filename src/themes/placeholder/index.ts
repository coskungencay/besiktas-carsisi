import type { ThemeDefinition } from "@/themes/types";

import About from "./sections/About";
import Contact from "./sections/Contact";
import Gallery from "./sections/Gallery";
import Hero from "./sections/Hero";
import Menu from "./sections/Menu";

const placeholder: ThemeDefinition = {
  name: "Placeholder (sade)",
  sections: { Hero, About, Menu, Gallery, Contact },
  tokensPath: "src/themes/placeholder/tokens.css",
};

export default placeholder;
