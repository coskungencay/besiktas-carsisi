/**
 * Temalarin yazi tipleri.
 *
 * NEDEN BURADA: Her tasarimin kendi font cifti var ve tipografi bir tasarimin
 * kimliginin yarisi. Sistem fontuna dusuldugunde 8 tasarim da "duz" gorunuyordu.
 *
 * NEDEN next/font: Fontlar build sirasinda indirilip UYGULAMADAN sunulur —
 * calisma aninda Google'a istek gitmez (KVKK/GDPR temiz, harici bagimlilik yok).
 *
 * NEDEN preload: false: Bu dosya 8 temanin fontunu birden tanimlar; hepsini
 * preload etmek her sayfaya 16 gereksiz font indirtirdi. Tarayici yalnizca
 * aktif temanin font-family'sini gercekten indirir. Musteri repo'sunda zaten
 * tek tema kalir (pnpm new:customer), orada bu liste de tek satira iner.
 *
 * DIKKAT: Bu fontlarin hicbirinde Arapca glif YOK. tokens.css'teki font
 * yiginlarinda sistem yedegi bulunmali; Arapca sayfa otomatik ona duser.
 */
import {
  Abril_Fatface,
  Anton,
  Archivo,
  Bodoni_Moda,
  Bricolage_Grotesque,
  Cormorant_Garamond,
  Crimson_Pro,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Jost,
  Karla,
  Manrope,
  Newsreader,
  Schibsted_Grotesk,
  Space_Grotesk,
  Zilla_Slab,
} from "next/font/google";

/* --------------------------------- mera ---------------------------------- */

const newsreader = Newsreader({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const archivo = Archivo({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});

/* -------------------------------- patika --------------------------------- */

const bricolage = Bricolage_Grotesque({
  subsets: ["latin-ext"],
  weight: ["600", "800"],
  variable: "--font-bricolage",
  display: "swap",
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
});

/* ------------------------------ yesil-avlu -------------------------------- */

const cormorant = Cormorant_Garamond({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const jost = Jost({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
  preload: false,
});

/* ------------------------------- kirk-yil --------------------------------- */

const abril = Abril_Fatface({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-abril",
  display: "swap",
  preload: false,
});

const crimson = Crimson_Pro({
  subsets: ["latin-ext"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
  preload: false,
});

/* --------------------------------- vela ----------------------------------- */

const bodoni = Bodoni_Moda({
  subsets: ["latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
  preload: false,
});

// Manrope degisken (variable) font ve 200-800 arasini tek dosyada tasiyor;
// weight listesi vermek Next'in tip kontrolune takiliyor (300 kabul etmiyor).
const manrope = Manrope({
  subsets: ["latin-ext"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});

/* ------------------------------- beyaz-oda -------------------------------- */

// Schibsted Grotesk degisken font (400-900); weight listesi tip kontrolune
// takildigi icin tum araligi tek dosyada aliyoruz.
const schibsted = Schibsted_Grotesk({
  subsets: ["latin-ext"],
  variable: "--font-schibsted",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin-ext"],
  weight: ["300", "400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

/* -------------------------------- tesviye --------------------------------- */

const anton = Anton({
  subsets: ["latin-ext"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

/* ------------------------------ sicak-firin -------------------------------- */

const zillaSlab = Zilla_Slab({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-zilla-slab",
  display: "swap",
  preload: false,
});

const karla = Karla({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-karla",
  display: "swap",
  preload: false,
});

/**
 * <html> uzerine basilan sinif listesi. Her font kendi CSS degiskenini tanimlar;
 * hangi degiskenin kullanilacagina temanin tokens.css'i karar verir.
 *
 * placeholder temasi bilerek disaridadir: notr kalmasi icin sistem fontu kullanir.
 */
export const themeFontClassNames = [
  newsreader.variable,
  archivo.variable,
  bricolage.variable,
  spaceGrotesk.variable,
  cormorant.variable,
  jost.variable,
  abril.variable,
  crimson.variable,
  bodoni.variable,
  manrope.variable,
  schibsted.variable,
  jetbrainsMono.variable,
  anton.variable,
  plexMono.variable,
  zillaSlab.variable,
  karla.variable,
].join(" ");
