import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const whatsappHref = "https://wa.me/34649673425?text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20blefaroplastia";

async function main() {
  await client.createIfNotExists({
    _id: "blepharoplastyPage",
    _type: "blepharoplastyPage",
    hero: {
      label: "[ Blefaroplastia · Mallorca ]",
      title: "Una mirada más descansada.\nSin dejar de ser tú.",
      description: "Tratamos el exceso de piel y las bolsas de los párpados buscando rejuvenecer la mirada sin alterar su expresión. Cada blefaroplastia se plantea de forma individual, respetando la anatomía y los rasgos de cada paciente.",
      imageUrl: "",
      imageAlt: "Dr. Juan Zárate, especialista en cirugía periocular",
    },
    contact: {
      title: "Valora tu caso\ncon el especialista.",
      description: "Si estás considerando una blefaroplastia, puedes solicitar una valoración para estudiar tu anatomía, tus objetivos y las posibilidades de tratamiento.",
      phone: "+34 649 673 425",
      phoneHref: "tel:+34649673425",
      whatsappHref,
      email: "info@rhinoandface.com",
      emailHref: "mailto:info@rhinoandface.com",
    },
    footer: {
      address: "Paseo Mallorca 24, Entlo. B · 07012 Palma, Mallorca",
    },
  });

  await client
    .patch("blepharoplastyPage")
    .set({
      problem: {
        title: "No todas las miradas envejecen\nde la misma manera.",
        intro: "El paso del tiempo puede modificar diferentes estructuras alrededor de los ojos. Por eso, una blefaroplastia no debería plantearse como un procedimiento idéntico para todos los pacientes.",
        cards: [
          { label: "Párpado superior", text: "El exceso de piel puede aportar sensación de pesadez y modificar la apertura natural de la mirada." },
          { label: "Párpado inferior", text: "Las bolsas y determinados cambios en el párpado inferior pueden generar una apariencia de cansancio incluso cuando la persona se encuentra descansada." },
          { label: "Blefaroplastia completa", text: "Cuando existen cambios tanto en el párpado superior como en el inferior, ambos pueden abordarse dentro de un mismo planteamiento quirúrgico si está indicado." },
        ],
      },
      naturality: {
        title: "El objetivo no es cambiar tu mirada.",
        subtitle: "Es devolverle descanso sin perder identidad.",
        paragraphs: [
          "La cirugía periocular exige precisión. Retirar demasiado tejido, modificar determinados volúmenes o alterar la relación entre el párpado y el ojo puede cambiar una expresión que forma parte de la identidad de una persona.",
          "Por eso, el planteamiento quirúrgico parte de la anatomía individual y de un objetivo concreto: obtener un resultado armónico, evitando una apariencia artificial o excesivamente intervenida.",
        ],
      },
      cases: {
        title: "Casos reales",
        subtitle: "Resultados que se entienden mejor al comparar, no al exagerar.",
        note: "Las fotografías muestran casos reales. Los resultados son individuales y pueden variar entre pacientes.",
      },
      specialist: {
        name: "Dr. Juan Zárate",
        role: "Cirugía maxilofacial · Cirugía periocular",
        imageUrl: "",
        imageAlt: "Dr. Juan Zárate, especialista en cirugía maxilofacial y cirugía periocular",
        paragraphs: [
          "La valoración de la zona periocular no se limita a observar cuánto tejido sobra. La posición de las cejas, el párpado, la relación con el globo ocular, los volúmenes y la anatomía facial condicionan qué abordaje puede ser adecuado en cada paciente.",
          "El Dr. Juan Zárate realiza una valoración individual antes de establecer cualquier indicación quirúrgica.",
        ],
      },
      process: {
        title: "De la valoración al seguimiento",
        steps: [
          { num: "01", title: "Valoración", text: "Estudio de la anatomía periocular, antecedentes y objetivos del paciente." },
          { num: "02", title: "Plan quirúrgico", text: "Se determina qué estructuras conviene tratar y qué técnica resulta apropiada para ese caso concreto." },
          { num: "03", title: "Cirugía", text: "El procedimiento se realiza de acuerdo con el plan establecido previamente por el especialista." },
          { num: "04", title: "Seguimiento", text: "La evolución postoperatoria se controla mediante las revisiones indicadas por el equipo médico." },
        ],
      },
      recovery: {
        title: "La recuperación también forma parte del resultado.",
        paragraphs: [
          "Tras una blefaroplastia es habitual atravesar un periodo de inflamación y cambios progresivos en la zona tratada. La evolución no es idéntica en todos los pacientes y el resultado debe valorarse de forma progresiva.",
          "Durante el postoperatorio, el equipo proporciona las indicaciones correspondientes y realiza el seguimiento necesario según la evolución de cada caso.",
        ],
      },
      faqs: [
        { question: "¿Qué diferencia existe entre blefaroplastia superior e inferior?", answer: "La blefaroplastia superior actúa sobre las estructuras del párpado superior cuando existe indicación quirúrgica. La inferior aborda determinados cambios del párpado inferior, como las bolsas u otras alteraciones anatómicas. En algunos pacientes puede estar indicado tratar ambas zonas." },
        { question: "¿La blefaroplastia cambia la forma de los ojos?", answer: "El objetivo de una blefaroplastia correctamente indicada no es transformar la identidad de la mirada. El planteamiento quirúrgico se adapta a la anatomía de cada paciente y debe establecerse tras una valoración individual." },
        { question: "¿Quedan cicatrices?", answer: "Toda cirugía implica cicatrices, aunque en la blefaroplastia suelen situarse estratégicamente para que queden muy discretas y, una vez evolucionadas, pueden llegar a ser prácticamente imperceptibles. Su aspecto final depende también de factores individuales del paciente, como la calidad de la piel y su proceso de cicatrización, además del procedimiento realizado. Durante la valoración, el especialista explicará dónde se localizarían en cada caso." },
        { question: "¿Cuándo se aprecia el resultado?", answer: "La zona periocular evoluciona progresivamente después de la cirugía. La inflamación inicial disminuye con el tiempo y el resultado no debe juzgarse de forma inmediata. La evolución concreta depende de cada paciente y del procedimiento realizado." },
        { question: "¿Puedo saber si necesito blefaroplastia superior, inferior o completa?", answer: "La indicación no debería establecerse únicamente a partir de una fotografía o de la percepción del paciente. Es necesaria una valoración médica para estudiar qué estructuras están condicionando el aspecto de la mirada." },
      ],
      footer: {
        address: "Paseo Mallorca 24, Entlo. B · 07012 Palma, Mallorca",
        links: [
          { href: "https://www.instagram.com/rhinoandface/", label: "@rhinoandface" },
          { href: "https://www.rhinoandface.com/politica-de-privacidad", label: "Privacidad" },
          { href: "https://www.rhinoandface.com/aviso-legal", label: "Aviso legal" },
        ],
      },
    })
    .commit();
  console.log("Documento de blefaroplastia inicializado en Sanity.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
