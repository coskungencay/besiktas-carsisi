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
    coverAlt: "Photo of {name}",
  },
  about: {
    eyebrow: "Our Story",
    title: "About Us",
    openingHours: "Opening hours",
    hoursNote: "Opening hours may change on public holidays.",
    placeholder: "Information about {name} is coming soon.",
  },
  site: {
    since: "Est.",
  },
  hours: {
    label: "Hours",
    closed: "Closed",
  },
  menu: {
    eyebrow: "Menu",
    title: "What's on the counter today?",
    featured: "Featured",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Moments from the shop",
    imageAlt: "{name} gallery image {index}",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch",
    intro:
      "Write or call us for reservations, special occasions and bulk orders.",
    formTitle: "Leave a message",
    address: "Address",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    instagram: "Instagram",
  },
  testimonials: {
    eyebrow: "Reviews",
    title: "What our guests say",
    ratingLabel: "{rating} out of 5 stars",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
  },
  location: {
    eyebrow: "Location",
    title: "Where to find us",
    directions: "Get directions",
    mapAlt: "Map showing the location of {name}",
  },
  social: {
    title: "Follow us",
  },
  whatsapp: {
    label: "Message us on WhatsApp",
  },
  form: {
    name: "Full name",
    namePlaceholder: "Your first and last name",
    phone: "Phone",
    phonePlaceholder: "+90 5xx xxx xx xx",
    email: "Email",
    emailPlaceholder: "you@example.com",
    message: "Your message",
    messagePlaceholder: "Anything you'd like to tell us…",
    honeypot: "Your website",
    submit: "Send message",
    submitting: "Sending…",
    success: "Thanks! We received your message and will get back to you soon.",
    consent:
      "By submitting this form you consent to the processing of your personal data.",
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
