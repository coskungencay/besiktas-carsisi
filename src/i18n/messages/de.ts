import type { Messages } from "./tr";

const de: Messages = {
  nav: {
    skipToContent: "Zum Inhalt springen",
    languageLabel: "Sprache",
    changeLanguage: "Sprache wechseln",
  },
  hero: {
    viewMenu: "Zur Speisekarte",
    logoAlt: "Logo von {name}",
  },
  about: {
    title: "Über uns",
    openingHours: "Öffnungszeiten",
    placeholder: "Informationen über {name} folgen in Kürze.",
  },
  hours: {
    closed: "Geschlossen",
  },
  menu: {
    title: "Speisekarte",
    featured: "Empfehlung",
  },
  gallery: {
    title: "Galerie",
    imageAlt: "Galeriebild {index} von {name}",
  },
  contact: {
    title: "Kontakt",
    intro:
      "Schreiben Sie dem Team von {name} für Reservierungen oder Sonderbestellungen.",
    address: "Adresse",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    instagram: "Instagram",
  },
  form: {
    name: "Vor- und Nachname",
    phone: "Telefon",
    email: "E-Mail",
    message: "Ihre Nachricht",
    honeypot: "Ihre Website",
    submit: "Nachricht senden",
    submitting: "Wird gesendet…",
    success: "Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns bald.",
  },
  errors: {
    nameTooShort: "Bitte geben Sie Ihren Namen ein",
    messageTooShort: "Ihre Nachricht muss mindestens 10 Zeichen lang sein",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    contactRequired: "Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an",
    rateLimited:
      "Sie haben zu viele Nachrichten gesendet. Bitte versuchen Sie es später erneut.",
    generic:
      "Ihre Nachricht konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  },
};

export default de;
