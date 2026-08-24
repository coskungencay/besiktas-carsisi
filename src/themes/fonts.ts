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
  Instrument_Serif,
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
 * BOLUM BASLIKLARININ fontu.
 *
 * NEDEN DORDUNCU FONT: bolum basliklari Schibsted Grotesk 900 ile
 * basiliyordu — hero'nun kelime-markasiyla AYNI ses. Hero'da o agirlik
 * marka beyani olarak dogru, ama sayfanin her bolumunde tekrar edince
 * tasarim "kalin grotesk" tek notasina siksti ve ucuz durmaya basladi.
 *
 * Instrument Serif yuksek kontrastli, modern bir editoryal display serif:
 * buyuk puntoda ince tirnaklariyla nefes aliyor, gezintideki Cormorant ile
 * ayni serif ailesinden konusuyor ama daha genis ve daha "bugun". Govde
 * metni grotesk kaliyor — okunakligi orada tutuyor.
 *
 * Tek agirligi var (400): display serif'te kalinlik degil PUNTO ve bosluk
 * hiyerarsi kurar.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const themeFontClassNames = [
  schibsted.variable,
  jetbrainsMono.variable,
  cormorant.variable,
  instrumentSerif.variable,
].join(" ");
