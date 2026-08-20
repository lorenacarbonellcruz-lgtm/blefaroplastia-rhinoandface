/**
 * RHINO & FACE — Landing de blefaroplastia
 * Mantiene el sistema visual de la landing de rinoplastia.
 * Las fotografías y casos reales se sustituyen desde el CMS antes de publicar.
 */

import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WHATSAPP_HREF = "https://wa.me/34649673425?text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20blefaroplastia";

const DEFAULT_CONTENT = {
  hero: {
    label: "[ Blefaroplastia · Mallorca ]",
    title: "Una mirada más descansada.\nSin dejar de ser tú.",
    description: "Tratamos el exceso de piel y las bolsas de los párpados buscando rejuvenecer la mirada sin alterar su expresión. Cada blefaroplastia se plantea de forma individual, respetando la anatomía y los rasgos de cada paciente.",
    imageUrl: "",
    imageAlt: "Dr. Juan Zárate, especialista en cirugía periocular",
  },
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
    items: [] as { label?: string; imageUrl?: string; imageAlt?: string }[],
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
  contact: {
    title: "Valora tu caso\ncon el especialista.",
    description: "Si estás considerando una blefaroplastia, puedes solicitar una valoración para estudiar tu anatomía, tus objetivos y las posibilidades de tratamiento.",
    phone: "+34 649 673 425",
    phoneHref: "tel:+34649673425",
    whatsappHref: WHATSAPP_HREF,
    email: "info@rhinoandface.com",
    emailHref: "mailto:info@rhinoandface.com",
  },
  footer: {
    address: "Paseo Mallorca 24, Entlo. B · 07012 Palma, Mallorca",
    links: [
      { href: "https://www.instagram.com/rhinoandface/", label: "@rhinoandface" },
      { href: "https://www.rhinoandface.com/politica-de-privacidad", label: "Privacidad" },
      { href: "https://www.rhinoandface.com/aviso-legal", label: "Aviso legal" },
    ],
  },
  social: {
    instagramHref: "https://www.instagram.com/rhinoandface/",
    instagramLabel: "Instagram · @rhinoandface",
  },
  ui: {
    navLook: "La mirada",
    navProcess: "El proceso",
    navSpecialist: "El especialista",
    navClinic: "La clínica",
    ctaAssessment: "Solicitar valoración",
    ctaWhatsApp: "WhatsApp",
    directWhatsApp: "WhatsApp directo",
    sectionLook: "[ La mirada ]",
    sectionNaturality: "[ Naturalidad ]",
    sectionGallery: "[ Galería ]",
    sectionSpecialist: "[ El especialista ]",
    sectionProcess: "[ El proceso ]",
    sectionRecovery: "[ Recuperación ]",
    sectionFaq: "[ Preguntas frecuentes ]",
    sectionContact: "[ Solicitar valoración ]",
    sectionClinic: "[ Rhino & Face ]",
    faqTitle: "Información para decidir con criterio",
    formName: "Nombre completo *",
    formPhone: "Teléfono *",
    formEmail: "Email",
    formMessage: "Mensaje (opcional)",
    formPrivacy: "He leído y acepto la política de privacidad de Rhino & Face.",
    formSubmit: "Enviar solicitud",
  },
};

type FormData = { nombre: string; telefono: string; email: string; mensaje: string; privacidad: boolean };

function merge<T>(defaults: T, override: unknown): T {
  if (!override || typeof override !== "object") return defaults;
  if (Array.isArray(defaults)) return (override as T) ?? defaults;
  const result = { ...(defaults as Record<string, unknown>) };
  for (const key of Object.keys(result)) {
    const value = (override as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    const defaultValue = result[key];
    result[key] = typeof defaultValue === "object" && defaultValue !== null && !Array.isArray(defaultValue)
      ? merge(defaultValue, value)
      : value;
  }
  return result as T;
}

function Lines({ value }: { value: string }) {
  return value.split("\n").map((line, index, lines) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 && <br />}</span>);
}

function PhotoPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(135deg,#24211f_0%,#6e625a_48%,#d5c9be_100%)] ${className ?? ""}`}>
      <div className="absolute inset-0 bg-foreground/15" />
      <div className="absolute inset-0 border border-white/15" />
      <div className="relative z-10 h-full min-h-70 flex items-end p-6">
        <span className="section-label text-white/80 leading-5">[ {label} ]</span>
      </div>
    </div>
  );
}

export default function Blepharoplasty() {
  const { data: cmsContent } = trpc.content.getBlepharoplasty.useQuery();
  const c = merge(DEFAULT_CONTENT, cmsContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({ nombre: "", telefono: "", email: "", mensaje: "", privacidad: false });

  useEffect(() => {
    document.title = "Blefaroplastia en Mallorca | Rhino & Face";
    const description = "Blefaroplastia en Mallorca con valoración individual de la zona periocular. Un planteamiento orientado a rejuvenecer la mirada respetando la expresión y la anatomía de cada paciente.";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".bleph-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [cmsContent]);

  const trackLead = (contactMethod: "Formulario" | "WhatsApp", placement: string) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: "Blefaroplastia",
        content_category: "Cirugía periocular",
        contact_method: contactMethod,
        placement,
      });
    }
  };

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      trackLead("Formulario", "formulario");
      setSubmitted(true);
    },
    onError: (error) => toast.error(error.message || "No se ha podido enviar la solicitud. Inténtalo de nuevo."),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.privacidad) return;
    submitLead.mutate({
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email || undefined,
      mensaje: formData.mensaje || undefined,
    });
  };

  const nav = [
    { href: "#mirada", label: c.ui.navLook },
    { href: "#proceso", label: c.ui.navProcess },
    { href: "#especialista", label: c.ui.navSpecialist },
    { href: "#clinica", label: c.ui.navClinic },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-20 md:pb-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex flex-col leading-none gap-0.5" aria-label="Rhino and Face">
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Rhino&amp;Face</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.55 0.01 60)" }}>Facial and Body Aesthetics</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => <a key={item.href} href={item.href} className="section-label hover:text-foreground transition-colors">{item.label}</a>)}
          </nav>

          <div className="flex items-center gap-3">
            <a href={c.social.instagramHref} target="_blank" rel="noopener noreferrer" className="section-label hidden lg:inline-flex hover:text-terracotta" style={{ padding: "0.55rem 0.3rem" }}>Instagram</a><a href="#contacto" className="btn-primary hidden sm:inline-flex" style={{ padding: "0.55rem 1.25rem" }}>{c.ui.ctaAssessment}</a>
            <button className="md:hidden p-2" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Abrir menú">
              <span className="w-5 flex flex-col gap-1.5"><span className={`block h-px bg-foreground transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} /><span className={`block h-px bg-foreground transition-all ${menuOpen ? "opacity-0" : ""}`} /><span className={`block h-px bg-foreground transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} /></span>
            </button>
          </div>
        </div>
        {menuOpen && <nav className="md:hidden border-t border-border bg-background"><div className="container py-6 flex flex-col gap-5">{nav.map((item) => <a key={item.href} href={item.href} className="section-label" onClick={() => setMenuOpen(false)}>{item.label}</a>)}<a href={c.social.instagramHref} target="_blank" rel="noopener noreferrer" className="section-label">Instagram</a><a href="#contacto" className="btn-primary mt-2" onClick={() => setMenuOpen(false)}>{c.ui.ctaAssessment}</a></div></nav>}
      </header>

      <main>
        <section className="relative min-h-screen pt-16 bg-foreground text-background overflow-hidden">
          <div className="container min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] items-stretch gap-0">
            <div className="relative z-10 flex flex-col justify-end lg:justify-center py-16 lg:py-24 lg:pr-12">
              <p className="section-label text-white/60 mb-5">{c.hero.label}</p>
              <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(2rem, 4.5vw, 3.6rem)", fontWeight: 700, color: "white", lineHeight: 1.14, letterSpacing: "-0.035em", marginBottom: "1.5rem", maxWidth: "700px" }}><Lines value={c.hero.title} /></h1>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.9, maxWidth: "540px", marginBottom: "2.5rem" }}>{c.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4"><a href="#contacto" className="btn-primary" style={{ background: "oklch(0.975 0.005 60)", color: "oklch(0.1 0.005 60)", borderColor: "oklch(0.975 0.005 60)" }}>{c.ui.ctaAssessment}</a><a href={c.contact.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackLead("WhatsApp", "hero")} className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.45)", color: "white" }}>{c.ui.ctaWhatsApp}</a></div>
              <div className="hidden lg:flex flex-col gap-2 mt-16"><span className="section-label text-white/65">Dr. Juan Zárate</span><span className="section-label text-white/40">Cirugía maxilofacial · Cirugía periocular</span></div>
            </div>
            <div className="relative min-h-[48vh] lg:min-h-0 lg:-mr-[max(1.5rem,calc((100vw-1400px)/2))] overflow-hidden">
              {c.hero.imageUrl ? <img src={c.hero.imageUrl} alt={c.hero.imageAlt} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" /> : <PhotoPlaceholder label="Imagen potente de la mirada — súbela desde el panel" className="absolute inset-0 w-full h-full" />}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,13,.55)_0%,rgba(13,13,13,.05)_42%,rgba(13,13,13,.1)_100%)]" />
              <div className="absolute bottom-6 left-6 lg:hidden flex flex-col gap-2"><span className="section-label text-white/70">Dr. Juan Zárate</span><span className="section-label text-white/45">Cirugía periocular</span></div>
            </div>
          </div>
        </section>

        <section id="mirada" className="py-24 md:py-32"><div className="container"><div className="max-w-3xl bleph-reveal"><p className="section-label mb-6">{c.ui.sectionLook}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "2rem" }}><Lines value={c.problem.title} /></h2><div className="divider mb-8" /><p className="text-sm leading-8 text-muted-foreground max-w-2xl">{c.problem.intro}</p></div><div className="grid grid-cols-1 md:grid-cols-3 mt-16">{c.problem.cards.map((card, index) => <article key={card.label} className="bleph-reveal border-t border-border p-8 md:border-l first:border-l-0" style={{ transitionDelay: `${index * 80}ms` }}><p className="section-label text-terracotta mb-6">0{index + 1}</p><h3 className="text-sm font-bold mb-4">{card.label}</h3><p className="text-xs leading-7 text-muted-foreground">{card.text}</p></article>)}</div></div></section>

        <section className="py-24 md:py-32 bg-foreground text-background"><div className="container"><div className="max-w-4xl bleph-reveal"><p className="section-label text-background/40 mb-6">{c.ui.sectionNaturality}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "1rem" }}>{c.naturality.title}</h2><p style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1rem, 2vw, 1.3rem)", lineHeight: 1.55, color: "oklch(0.78 0.01 60)", marginBottom: "3rem" }}>{c.naturality.subtitle}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-background/15 pt-8">{c.naturality.paragraphs.map((paragraph) => <p key={paragraph} className="text-xs leading-8 text-background/65">{paragraph}</p>)}</div></div></div></section>

        <section className="py-24 md:py-32 bg-secondary"><div className="container"><div className="bleph-reveal mb-14"><p className="section-label mb-4">{c.ui.sectionGallery}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, marginBottom: "1rem" }}>{c.cases.title}</h2><p className="text-xs leading-7 text-muted-foreground">{c.cases.subtitle}</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{(c.cases.items ?? [{ label: "Imagen 01" }, { label: "Imagen 02" }, { label: "Imagen 03" }]).map((caseItem: { label?: string; imageUrl?: string; imageAlt?: string; beforeUrl?: string; afterUrl?: string }, index: number) => { const imageUrl = caseItem.imageUrl || caseItem.beforeUrl || caseItem.afterUrl; return <div key={`${caseItem.label ?? "imagen"}-${index}`} className="bleph-reveal" style={{ transitionDelay: `${index * 90}ms` }}><div className="relative aspect-[4/5] border border-border bg-[linear-gradient(135deg,#d9d1c9,#918981)]">{imageUrl ? <img src={imageUrl} alt={caseItem.imageAlt || caseItem.label || `Imagen ${index + 1}`} className="w-full h-full object-cover" loading="lazy" /> : <span className="absolute inset-0 grid place-items-center section-label text-foreground/55">Imagen pendiente</span>}</div><p className="section-label mt-3">{caseItem.label ?? `Imagen ${index + 1}`}</p></div>})}</div><p className="section-label text-muted-foreground mt-8 max-w-3xl">{c.cases.note}</p></div></section>

        <section id="especialista" className="py-24 md:py-32"><div className="container"><div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"><div className="bleph-reveal order-2 lg:order-1">{c.specialist.imageUrl ? <img src={c.specialist.imageUrl} alt={c.specialist.imageAlt} className="w-full aspect-[4/5] object-cover" loading="lazy" /> : <PhotoPlaceholder label="Retrato del especialista — súbelo desde el panel" className="aspect-[4/5]" />}</div><div className="bleph-reveal order-1 lg:order-2"><p className="section-label mb-6">{c.ui.sectionSpecialist}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "0.75rem" }}>{c.specialist.name}</h2><p className="section-label text-terracotta mb-8">{c.specialist.role}</p><div className="divider mb-8" />{c.specialist.paragraphs.map((paragraph) => <p key={paragraph} className="text-xs leading-8 text-muted-foreground mb-6">{paragraph}</p>)}<a href="#contacto" className="btn-primary mt-4">{c.ui.ctaAssessment}</a></div></div></div></section>

        <section id="proceso" className="py-24 md:py-32 bg-secondary"><div className="container"><div className="bleph-reveal mb-16"><p className="section-label mb-4">{c.ui.sectionProcess}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700 }}>{c.process.title}</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">{c.process.steps.map((step, index) => <article key={step.num} className="bleph-reveal border-t border-border p-8 md:border-l first:border-l-0" style={{ transitionDelay: `${index * 80}ms` }}><span className="text-4xl font-bold text-terracotta/35 block mb-6">{step.num}</span><h3 className="text-xs font-bold mb-4">{step.title}</h3><p className="text-xs leading-7 text-muted-foreground">{step.text}</p></article>)}</div></div></section>

        <section className="py-24 md:py-32"><div className="container"><div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-14 lg:gap-24"><div className="bleph-reveal"><p className="section-label mb-6">{c.ui.sectionRecovery}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2 }}><Lines value={c.recovery.title} /></h2></div><div className="bleph-reveal border-t border-border pt-8">{c.recovery.paragraphs.map((paragraph) => <p key={paragraph} className="text-xs leading-8 text-muted-foreground mb-6">{paragraph}</p>)}</div></div></div></section>

        <section className="py-24 md:py-32 bg-secondary"><div className="container max-w-[1400px]"><div className="bleph-reveal mb-14"><p className="section-label mb-4">{c.ui.sectionFaq}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700 }}>{c.ui.faqTitle}</h2></div><div className="border-t border-border">{c.faqs.map((faq, index) => <details key={faq.question} className="bleph-reveal group border-b border-border py-6"><summary className="flex justify-between gap-6 text-xs font-bold cursor-pointer list-none"><span>{faq.question}</span><span className="text-terracotta transition-transform group-open:rotate-45">+</span></summary><p className="text-xs leading-8 text-muted-foreground max-w-3xl pt-5">{faq.answer}</p></details>)}</div></div></section>

        <section id="contacto" className="py-24 md:py-32 bg-foreground text-background"><div className="container"><div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"><div className="bleph-reveal"><p className="section-label text-background/40 mb-6">{c.ui.sectionContact}</p><h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, color: "oklch(0.975 0.005 60)", marginBottom: "2rem" }}><Lines value={c.contact.title} /></h2><div className="h-px bg-background/15 mb-8" /><p className="text-xs leading-8 text-background/65 max-w-xl mb-10">{c.contact.description}</p><div className="space-y-3"><a href={c.contact.phoneHref} className="flex items-center gap-3 text-xs text-background/70 hover:text-background"><span className="text-terracotta">↗</span>{c.contact.phone}</a><a href={c.contact.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackLead("WhatsApp", "contacto")} className="flex items-center gap-3 text-xs text-background/70 hover:text-background"><span className="text-terracotta">↗</span>{c.ui.directWhatsApp}</a><a href={c.social.instagramHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-background/70 hover:text-background"><span className="text-terracotta">↗</span>{c.social.instagramLabel}</a><a href={c.contact.emailHref} className="flex items-center gap-3 text-xs text-background/70 hover:text-background"><span className="text-terracotta">↗</span>{c.contact.email}</a></div></div><div className="bleph-reveal">{submitted ? <div className="border border-background/20 p-8 md:p-10"><p className="text-terracotta text-3xl mb-6">✓</p><h3 className="text-xl font-bold text-background mb-4">Solicitud recibida</h3><p className="text-xs leading-8 text-background/65 mb-7">Gracias por escribirnos. El equipo revisará tu solicitud y se pondrá en contacto contigo.</p><a href={c.contact.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackLead("WhatsApp", "confirmacion_formulario")} className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>{c.ui.ctaWhatsApp}</a></div> : <form onSubmit={handleSubmit} className="space-y-7" noValidate><div><label className="section-label text-background/40 block mb-2" htmlFor="bleph-name">{c.ui.formName}</label><input id="bleph-name" type="text" value={formData.nombre} onChange={(event) => setFormData({ ...formData, nombre: event.target.value })} required className="input-field" placeholder="Tu nombre" style={{ borderBottomColor: "rgba(255,255,255,0.18)", color: "white" }} /></div><div><label className="section-label text-background/40 block mb-2" htmlFor="bleph-phone">{c.ui.formPhone}</label><input id="bleph-phone" type="tel" value={formData.telefono} onChange={(event) => setFormData({ ...formData, telefono: event.target.value })} required className="input-field" placeholder="+34 600 000 000" style={{ borderBottomColor: "rgba(255,255,255,0.18)", color: "white" }} /></div><div><label className="section-label text-background/40 block mb-2" htmlFor="bleph-email">{c.ui.formEmail}</label><input id="bleph-email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="input-field" placeholder="tu@email.com" style={{ borderBottomColor: "rgba(255,255,255,0.18)", color: "white" }} /></div><div><label className="section-label text-background/40 block mb-2" htmlFor="bleph-message">{c.ui.formMessage}</label><textarea id="bleph-message" value={formData.mensaje} onChange={(event) => setFormData({ ...formData, mensaje: event.target.value })} className="input-field min-h-24 resize-y" placeholder="Cuéntanos qué te gustaría consultar" style={{ borderBottomColor: "rgba(255,255,255,0.18)", color: "white" }} /></div><div className="flex items-start gap-3"><input id="bleph-privacy" type="checkbox" checked={formData.privacidad} onChange={(event) => setFormData({ ...formData, privacidad: event.target.checked })} required className="mt-1" style={{ accentColor: "oklch(0.62 0.1 40)" }} /><label htmlFor="bleph-privacy" className="text-[0.62rem] leading-5 text-background/45">{c.ui.formPrivacy}</label></div><button type="submit" disabled={submitLead.isPending} className="btn-primary w-full" style={{ background: "oklch(0.975 0.005 60)", color: "oklch(0.1 0.005 60)", borderColor: "oklch(0.975 0.005 60)" }}>{submitLead.isPending ? "Enviando..." : c.ui.formSubmit}</button></form>}</div></div></div></section>

        <section id="clinica" className="py-20 bg-background"><div className="container flex flex-col md:flex-row justify-between gap-8"><div><p className="section-label mb-3">{c.ui.sectionClinic}</p><p className="text-xs leading-7 text-muted-foreground">{c.footer.address}<br />Tel. <a href={c.contact.phoneHref} className="underline hover:text-foreground">{c.contact.phone}</a></p></div><div className="flex flex-col sm:flex-row gap-3"><a href={c.social.instagramHref} target="_blank" rel="noopener noreferrer" className="btn-secondary self-start">Instagram</a><a href={c.contact.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackLead("WhatsApp", "clinica")} className="btn-primary self-start">{c.ui.ctaWhatsApp}</a></div></div></section>
      </main>

      <footer className="py-10 border-t border-border"><div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6"><div><span className="font-bold tracking-[0.18em] text-sm uppercase">Rhino&amp;Face</span><p className="section-label mt-1.5">{c.footer.address}</p></div><div className="flex flex-wrap gap-6">{c.footer.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="section-label hover:text-foreground">{link.label}</a>)}</div></div></footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm p-3 border-t border-background/15"><a href="#contacto" className="btn-primary w-full" style={{ background: "oklch(0.975 0.005 60)", color: "oklch(0.1 0.005 60)", borderColor: "oklch(0.975 0.005 60)" }}>Solicitar valoración</a></div>
    </div>
  );
}
