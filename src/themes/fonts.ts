/**
 * Temalarin yazi tipleri.
 *
 * NEDEN BURADA: Her tasarimin kendi font cifti var ve tipografi bir tasarimin
 * kimliginin yarisi. Sistem fontuna dusuldugunde 8 tasarim da "duz" gorunuyordu.
 *
 * NEDEN next/font: Fontlar build sirasinda indirilip UYGULAMADAN sunulur —
 * calisma aninda Google'a istek gitmez (KVKK/GDPR temiz, harici bagimlilik yok).
 *
 * NEDEN preload: false: Sablonda 8 temanin fontu birden tanimliydi; hepsini
 * preload etmek her sayfaya 16 gereksiz font indirtirdi. Bu musteri repo'sunda
 * `pnpm new:customer` liste'yi zaten tek temaya (beyaz-oda) indirdi.
 *
 * DIKKAT: Bu fontlarin hicbirinde Arapca glif YOK. tokens.css'teki font
 * yiginlarinda sistem yedegi bulunmali; Arapca sayfa otomatik ona duser.
 * (beyaz-oda/tokens.css icinde html[lang="ar"] istisnasi tanimli.)
 */
import {
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";

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

/**
 * <html> uzerine basilan sinif listesi. Her font kendi CSS degiskenini tanimlar;
 * hangi degiskenin kullanilacagina temanin tokens.css'i karar verir.
 *
 * Tek aktif tema beyaz-oda: Schibsted Grotesk (govde+baslik) + JetBrains Mono
 * (kunye/etiket satirlari).
 */
export const themeFontClassNames = [
  schibsted.variable,
  jetbrainsMono.variable,
].join(" ");
