import type { Messages } from "./tr";

const es: Messages = {
  nav: {
    skipToContent: "Ir al contenido",
    languageLabel: "Idioma",
    changeLanguage: "Cambiar idioma",
  },
  hero: {
    viewMenu: "Ver la carta",
    logoAlt: "Logotipo de {name}",
  },
  about: {
    title: "Sobre nosotros",
    openingHours: "Horario",
    placeholder: "Pronto habrá más información sobre {name}.",
  },
  hours: {
    closed: "Cerrado",
  },
  menu: {
    title: "Carta",
    featured: "Destacado",
  },
  gallery: {
    title: "Galería",
    imageAlt: "Imagen {index} de la galería de {name}",
  },
  contact: {
    title: "Contacto",
    intro:
      "Escríbenos para contactar con el equipo de {name}, reservar o hacer un pedido especial.",
    address: "Dirección",
    phone: "Teléfono",
    whatsapp: "WhatsApp",
    email: "Correo electrónico",
    instagram: "Instagram",
  },
  form: {
    name: "Nombre y apellidos",
    phone: "Teléfono",
    email: "Correo electrónico",
    message: "Tu mensaje",
    honeypot: "Tu sitio web",
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    success: "¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.",
  },
  errors: {
    nameTooShort: "Escribe tu nombre",
    messageTooShort: "El mensaje debe tener al menos 10 caracteres",
    invalidEmail: "Introduce un correo electrónico válido",
    contactRequired: "Indica un teléfono o un correo electrónico",
    rateLimited: "Has enviado demasiados mensajes. Inténtalo de nuevo más tarde.",
    generic: "No se pudo guardar tu mensaje. Inténtalo de nuevo.",
  },
};

export default es;
