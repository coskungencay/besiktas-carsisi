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
  Cormorant_Garamond,
  Fraunces,
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
/*
 * Ust seridin ve bolum etiketlerinin fontu.
 *
 * NEDEN UCUNCU BIR FONT: gezinti baglantilari govde grotesk'iyle yaziliyordu
 * ve 12.5px'te sayfanin geri kalanindan ayrismiyordu — ust serit "menu" gibi
 * degil, kucuk bir metin blogu gibi duruyordu. Cormorant Garamond kaligrafik
 * kokenli, ince ve asil bir serif; buyuk puntoda ve genis harf araligiyla
 * basildiginda seride hem agirlik hem incelik veriyor.
 *
 * Grotesk'le CAKISMIYOR, tamamliyor: sayfadaki buyuk basliklar (hero, bolum
 * baslıklari) kalin grotesk kaliyor — klasik editoryal esleme.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

/*
 * BOLUM BASLIKLARININ ve giris cumlelerinin fontu.
 *
 * NEDEN INSTRUMENT SERIF DEGIL: o fontun TEK agirligi var (400). Bolum
 * basliklari 4rem'e kadar buyuyor ve 400 o olcude ince kalip "varsayilan
 * serif" gibi okunuyordu — karakteri olmayan bir Times izlenimi.
 *
 * Fraunces DEGISKEN bir serif: agirlik 100-900, ayrica optik boyut (opsz),
 * yumusaklik (SOFT) ve "wonk" eksenleri var. Buyuk puntoda 600 agirlikla hem
 * dolu hem zarif duruyor; giris cumlelerinde 300'e inince ayni ailenin ince
 * sesi oluyor. Tek font, iki gorev — sayfada tipografik birlik kuruyor.
 *
 * Neden bu carsiya uygun: Fraunces'in sicak, hafif duzensiz tirnaklari
 * 1985'ten kalma bir mahalle carsisiyla ortusuyor; steril bir grotesk ya da
 * soguk bir didone o tonu vermiyordu.
 */
const fraunces = Fraunces({
  subsets: ["latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

export const themeFontClassNames = [
  schibsted.variable,
  jetbrainsMono.variable,
  cormorant.variable,
  fraunces.variable,
].join(" ");
