/**
 * Turkce arayuz metinleri — REFERANS SOZLUK.
 *
 * Diger dillerin dosyalari bu tipe uymak ZORUNDA (Messages tipi),
 * bu yuzden bir anahtar eklediginizde TypeScript eksik cevirileri size soyler.
 *
 * NOT: Bu metinler arayuz kromudur ve TUM temalarda ortaktir. Musteriye ait
 * icerik (slogan, hakkimizda, urun adlari) burada degil, veritabanindadir.
 */
const tr = {
  nav: {
    skipToContent: "İçeriğe geç",
    languageLabel: "Dil",
    changeLanguage: "Dil değiştir",
  },
  hero: {
    viewMenu: "Menüyü İncele",
    logoAlt: "{name} logosu",
    coverAlt: "{name} mekân fotoğrafı",
  },
  about: {
    eyebrow: "Hikâyemiz",
    title: "Hakkımızda",
    openingHours: "Çalışma saatleri",
    hoursNote: "Bayram günlerinde çalışma saatleri değişebilir.",
    placeholder: "{name} hakkında bilgi yakında eklenecek.",
  },
  site: {
    since: "Kuruluş",
  },
  hours: {
    label: "Saat",
    closed: "Kapalı",
  },
  menu: {
    eyebrow: "Menü",
    title: "Bugün tezgâhta ne var?",
    viewAll: "Tüm menüyü gör",
    pageIntro: "Fiyatlar ve tam liste",
    featured: "Öne çıkan",
    enlarge: "{name} görselini büyüt",
    closeImage: "Kapat",
  },
  gallery: {
    eyebrow: "Galeri",
    title: "Mekândan kareler",
    imageAlt: "{name} galeri görseli {index}",
  },
  contact: {
    eyebrow: "İletişim",
    title: "Bize ulaşın",
    intro:
      "Rezervasyon, özel gün ve toplu sipariş için yazabilir ya da arayabilirsiniz.",
    formTitle: "Mesaj bırakın",
    address: "Adres",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-posta",
    instagram: "Instagram",
  },
  testimonials: {
    eyebrow: "Yorumlar",
    title: "Müşterilerimiz ne diyor?",
    ratingLabel: "{rating} / 5 yıldız",
  },
  faq: {
    eyebrow: "Sıkça sorulanlar",
    title: "Merak edilenler",
  },
  location: {
    eyebrow: "Konum",
    title: "Bizi burada bulabilirsiniz",
    directions: "Yol tarifi al",
    mapAlt: "{name} konumunu gösteren harita",
  },
  social: {
    title: "Bizi takip edin",
  },
  whatsapp: {
    label: "WhatsApp'tan yazın",
  },
  form: {
    name: "Ad Soyad",
    namePlaceholder: "Adınız ve soyadınız",
    phone: "Telefon",
    phonePlaceholder: "+90 5xx xxx xx xx",
    email: "E-posta",
    emailPlaceholder: "ornek@eposta.com",
    message: "Mesajınız",
    messagePlaceholder: "Bize iletmek istedikleriniz…",
    honeypot: "Web siteniz",
    submit: "Mesajı gönder",
    submitting: "Gönderiliyor…",
    success: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    consent:
      "Formu göndererek kişisel verilerinizin işlenmesine izin vermiş olursunuz.",
  },
  errors: {
    nameTooShort: "Adınızı yazın",
    messageTooShort: "Mesajınız en az 10 karakter olmalı",
    invalidEmail: "Geçerli bir e-posta girin",
    contactRequired: "Telefon veya e-posta adresinden en az birini girin",
    rateLimited:
      "Çok fazla mesaj gönderdiniz. Lütfen bir süre sonra tekrar deneyin.",
    generic: "Mesajınız kaydedilemedi. Lütfen tekrar deneyin.",
  },
};

export type Messages = typeof tr;

export default tr;
