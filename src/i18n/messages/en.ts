import type { Messages } from "./tr";

const en: Messages = {
  nav: {
    skipToContent: "Skip to content",
    languageLabel: "Language",
    changeLanguage: "Change language",
  },
  hero: {
    viewMenu: "View the Menu",
    logoAlt: "{name} logo",
  },
  about: {
    title: "About Us",
    openingHours: "Opening Hours",
    placeholder: "Information about {name} is coming soon.",
  },
  hours: {
    closed: "Closed",
  },
  menu: {
    title: "Menu",
    featured: "Featured",
  },
  gallery: {
    title: "Gallery",
    imageAlt: "{name} gallery image {index}",
  },
  contact: {
    title: "Contact",
    intro:
      "Get in touch with the {name} team for reservations or special orders.",
    address: "Address",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    instagram: "Instagram",
  },
  form: {
    name: "Full name",
    phone: "Phone",
    email: "Email",
    message: "Your message",
    honeypot: "Your website",
    submit: "Send Message",
    submitting: "Sending…",
    success: "Thanks! We received your message and will get back to you soon.",
  },
  errors: {
    nameTooShort: "Please enter your name",
    messageTooShort: "Your message must be at least 10 characters",
    invalidEmail: "Please enter a valid email address",
    contactRequired: "Please provide either a phone number or an email address",
    rateLimited: "You have sent too many messages. Please try again later.",
    generic: "Your message could not be saved. Please try again.",
  },
};

export default en;
