/**
 * Script para crear el documento inicial de la landing page en Sanity
 * con todo el contenido actual de la web.
 * Ejecutar: node scripts/seed-sanity.mjs
 */
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const landingContent = {
  _type: "landingPage",
  _id: "landingPage",

  hero: {
    label: "[ Rinoplastia · Palma de Mallorca ]",
    title: "Nariz natural\ny funcional",
    subtitle: "Cirugía nasal con enfoque estructural y natural.\nNo cambiamos tu rostro, lo integramos.",
    ctaPrimary: { text: "Solicitar valoración", url: "#contacto" },
    ctaSecondary: { text: "WhatsApp", url: "https://wa.me/34600000000" },
    scrollLabel: "DESLIZA",
  },

  trustBar: [
    { num: "+500", label: "Pacientes operados" },
    { num: "+10", label: "Años de experiencia" },
    { num: "Equipo", label: "Médico especializado" },
    { num: "Palma", label: "Pg de Mallorca, 24, 07012" },
  ],

  rhinoplasty: {
    label: "[ Rinoplastia ]",
    title: "Cirugía nasal de precisión",
    description: "La rinoplastia es una de las cirugías más complejas de la cirugía plástica facial. Requiere un dominio técnico excepcional y una comprensión profunda de la anatomía nasal y la armonía facial.",
    features: [
      "Rinoplastia primaria y secundaria",
      "Corrección funcional y estética",
      "Seguimiento postoperatorio completo",
      "Financiación disponible",
    ],
    ctaText: "Solicitar valoración",
    quote: "\"No prometemos rostros perfectos. Prometemos decisiones bien tomadas.\"",
  },

  process: {
    label: "[ El proceso ]",
    title: "Cuatro pasos hacia tu decisión",
    steps: [
      {
        num: "01",
        title: "Primera consulta",
        description: "Evaluación completa de tu anatomía nasal, historial médico y expectativas. Sin compromiso.",
      },
      {
        num: "02",
        title: "Plan quirúrgico",
        description: "Diseño personalizado de la intervención con simulación de resultados y planificación detallada.",
      },
      {
        num: "03",
        title: "La intervención",
        description: "Cirugía realizada en clínica acreditada con anestesia general y el máximo rigor técnico.",
      },
      {
        num: "04",
        title: "Seguimiento",
        description: "Acompañamiento completo durante la recuperación con revisiones periódicas hasta el resultado final.",
      },
    ],
  },

  doctor: {
    label: "[ El equipo ]",
    name: "Dr. Diego Arancibia-Tagle",
    specialty: "Cirujano Plástico Facial",
    bio: "Especialista en cirugía plástica facial con más de una década de experiencia en rinoplastia. Formado en los mejores centros europeos, combina precisión técnica con una visión estética refinada para resultados naturales y duraderos.",
    credentials: [
      "Especialista en Cirugía Plástica, Estética y Reparadora",
      "Fellow de la Sociedad Española de Cirugía Plástica",
      "Miembro de la European Academy of Facial Plastic Surgery",
      "Formación en Viena, París y Barcelona",
    ],
    ctaText: "Conocer al equipo",
  },

  clinic: {
    label: "[ La clínica ]",
    title: "Un espacio diseñado para ti",
    description: "Nuestra clínica en el Paseo de Mallorca combina tecnología de vanguardia con un ambiente cálido y discreto. Cada detalle está pensado para que tu experiencia sea cómoda y segura desde la primera visita.",
    features: [
      { icon: "shield", text: "Quirófano acreditado" },
      { icon: "map-pin", text: "Pg de Mallorca, 24, 07012 Palma" },
      { icon: "clock", text: "Lun–Vie 9:00–19:00" },
    ],
  },

  gallery: {
    label: "[ Galería ]",
    title: "Nuestros casos",
    description: "Resultados reales de pacientes que confiaron en nosotros.",
  },

  testimonials: {
    label: "[ Testimonios ]",
    title: "Lo que dicen nuestros pacientes",
    items: [
      {
        text: "El Dr. Arancibia-Tagle me explicó todo el proceso con total transparencia. El resultado es exactamente lo que buscaba: natural y armonioso.",
        name: "María G.",
        location: "Palma de Mallorca",
        rating: 5,
      },
      {
        text: "Vine desde Barcelona específicamente para operarme con él. La clínica es impecable y el seguimiento postoperatorio fue excelente.",
        name: "Laura M.",
        location: "Barcelona",
        rating: 5,
      },
      {
        text: "Llevaba años pensándolo. La primera consulta me dio toda la seguridad que necesitaba. Ahora me arrepiento de no haberlo hecho antes.",
        name: "Ana R.",
        location: "Madrid",
        rating: 5,
      },
    ],
  },

  contact: {
    label: "[ Contacto ]",
    title: "Solicita tu valoración",
    description: "Cuéntanos tu caso y te responderemos en menos de 24 horas.",
    phone: "+34 971 000 000",
    email: "info@rhinoandface.com",
    address: "Pg de Mallorca, 24, 07012 Palma",
    whatsappUrl: "https://wa.me/34600000000",
    formFields: {
      namePlaceholder: "Nombre completo",
      phonePlaceholder: "Teléfono",
      emailPlaceholder: "Email",
      messagePlaceholder: "Cuéntanos tu caso...",
      submitText: "Enviar solicitud",
      successMessage: "Mensaje recibido. Te contactaremos en menos de 24 horas.",
    },
  },

  footer: {
    tagline: "Facial and Body Aesthetics",
    address: "Pg de Mallorca, 24, 07012 Palma de Mallorca",
    phone: "+34 971 000 000",
    email: "info@rhinoandface.com",
    copyright: "© 2024 Rhino & Face. Todos los derechos reservados.",
    legalText: "Clínica autorizada por el Servei de Salut de les Illes Balears.",
    navLinks: [
      { text: "Rinoplastia", url: "#rinoplastia" },
      { text: "El proceso", url: "#proceso" },
      { text: "El equipo", url: "#equipo" },
      { text: "La clínica", url: "#clinica" },
    ],
  },
};

console.log("Uploading landing content to Sanity...");
const result = await client.createOrReplace(landingContent);
console.log("✓ Landing content created:", result._id);
console.log("\nYou can now edit the content at:");
console.log(`https://www.sanity.io/manage/personal/project/${process.env.SANITY_PROJECT_ID}`);
