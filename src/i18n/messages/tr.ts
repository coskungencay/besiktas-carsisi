/**
 * Turkce arayuz metinleri — REFERANS SOZLUK.
 *
 * Diger dillerin dosyalari bu tipe uymak ZORUNDA (Messages tipi),
 * bu yuzden bir anahtar eklediginizde TypeScript eksik cevirileri size soyler.
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
  },
  about: {
    title: "Hakkımızda",
    openingHours: "Çalışma Saatleri",
    placeholder: "{name} hakkında bilgi yakında eklenecek.",
  },
  hours: {
    closed: "Kapalı",
  },
  menu: {
    title: "Menü",
    featured: "Öne çıkan",
  },
  gallery: {
    title: "Galeri",
    imageAlt: "{name} galeri görseli {index}",
  },
  contact: {
    title: "İletişim",
    intro:
      "{name} ekibine ulaşmak, rezervasyon ya da özel sipariş için yazabilirsiniz.",
    address: "Adres",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-posta",
    instagram: "Instagram",
  },
  form: {
    name: "Ad Soyad",
    phone: "Telefon",
    email: "E-posta",
    message: "Mesajınız",
    honeypot: "Web siteniz",
    submit: "Mesaj Gönder",
    submitting: "Gönderiliyor…",
    success: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
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
