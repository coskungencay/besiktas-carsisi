import { Fragment } from "react";

/**
 * Turkce sayfada BUYUK HARFE cevrilen yabanci kelimeleri kurtarir.
 *
 * SORUN: `text-transform: uppercase` tarayicida elemanin DILINE gore calisir.
 * Sayfa `lang="tr"` oldugu icin "i" harfi "İ" olur — Turkce metinde bu DOGRU
 * ("iletisim" -> "İLETİŞİM"), ama yabanci bir kelimede yanlis:
 *
 *     Wi-Fi   -> WİFİ      (olmasi gereken: WI-FI)
 *     TikTok  -> TİKTOK    (olmasi gereken: TIKTOK)
 *
 * COZUM: yalnizca o kelimeyi `lang="en"` tasiyan bir <span> icine almak.
 * Tarayici o parcada Ingilizce kuralini uygular, cumlenin geri kalani Turkce
 * kuralinda kalir. Metin degistirilmez — kopyalandiginda, aranildiginda ve
 * ekran okuyucuda ozgun hali korunur; yalnizca gorsel donusum degisir.
 *
 * NEDEN SOZLUK: hangi kelimenin yabanci oldugunu tarayici bilemez, biz de
 * genel bir kural yazamayiz. Liste, bir mekan sitesinde gecme ihtimali olan
 * ve ICINDE "i" BULUNAN terimlerle sinirli tutuldu — "i" tasimayan bir kelime
 * (latte, espresso, brunch) zaten iki dilde de ayni buyur.
 */
const LATIN_TERIMLER = [
  // Teknoloji / platform
  "wi-fi",
  "wifi",
  "tiktok",
  "instagram",
  "linkedin",
  "tripadvisor",
  "iphone",
  "ipad",
  "spotify",
  "netflix",
  "delivery",
  "takeaway",
  "take away",
  // Menude siklikla oldugu gibi yazilan urunler
  "cappuccino",
  "macchiato",
  "americano",
  "affogato",
  "tiramisu",
  "smoothie",
  "milkshake",
  "cookie",
  "brownie",
  "muffin",
  "panini",
  "chai",
  "mojito",
  "chip",
  "chips",
  "sandwich",
  "cheesecake",
  "tonic",
  "gin",
];

/*
 * Uzun terim once denensin ("take away", "wi-fi"), yoksa kisa olan onun bir
 * parcasini yakalayip geri kalanini disarida birakir.
 */
const KALIP = new RegExp(
  `(${[...LATIN_TERIMLER]
    .sort((a, b) => b.length - a.length)
    .map((terim) => terim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "gi",
);

/**
 * Turkce'ye OZGU harfler.
 *
 * "ı", "ğ", "ş" ve noktali "İ" baska hicbir desteklenen dilde (en/es/de/ar)
 * bulunmaz — yani bu harflerden biri varsa metin Turkce'dir. "ö/ü/ç" listeye
 * ALINMADI: Almanca ve Fransizca'da da geciyorlar, tek baslarina delil degil.
 */
const TURKCE_HARF = /[ıİğĞşŞ]/;

/**
 * Metni oldugu gibi basar; DILINI isaretler.
 *
 * Iki yonlu bir sorunu cozer — ikisi de `text-transform: uppercase`'in
 * elemanin diline gore calismasindan kaynaklanir:
 *
 *   1. Turkce sayfada YABANCI kelime:  Wi-Fi -> WİFİ    (dogrusu WI-FI)
 *   2. Yabanci dil sayfasinda TURKCE metin: cekilmis -> ÇEKILMIŞ
 *      (dogrusu ÇEKİLMİŞ). Musteri o alanin cevirisini girmediginde icerik
 *      varsayilan dilde kalir, ama sayfa `lang="en"` oldugu icin buyutme
 *      Ingilizce kuralini uygular.
 *
 * Cozum ikisinde de ayni: metnin GERCEK dilini isaretlemek. Metin
 * degistirilmez — kopyalama, arama ve ekran okuyucu ozgun hali gorur.
 *
 * Yalnizca BUYUK HARFE cevrilen alanlarda gereklidir; normal puntoda hicbir
 * sey degistirmez.
 */
export function Latin({ children }: { children: string }) {
  if (!children) return null;

  const parcalar = children.split(KALIP);

  const govde =
    parcalar.length === 1 ? (
      <>{children}</>
    ) : (
      <>
        {parcalar.map((parca, index) =>
          // split, yakalama grubunu TEK sayili indekslerde dondurur.
          index % 2 === 1 ? (
            <span key={index} lang="en">
              {parca}
            </span>
          ) : (
            <Fragment key={index}>{parca}</Fragment>
          ),
        )}
      </>
    );

  /*
   * Turkce metin ayrica disaridan da isaretlenir. Sayfa zaten Turkce ise bu
   * bir sey degistirmez (miras alinan degerin aynisi); sayfa baska bir dilde
   * ise cevrilmemis Turkce metni dogru buyutur.
   */
  if (TURKCE_HARF.test(children)) {
    return <span lang="tr">{govde}</span>;
  }

  return govde;
}
