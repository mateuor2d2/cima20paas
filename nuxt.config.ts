export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  ssr: true,
  nitro: {
    preset: 'node-server'
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    }
  },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/a11y.css',
    '~/assets/css/saas.css',
  ],
  components: [
    // Base components: site/, blog/, content/ → SiteHeader, BlogSidebar, etc.
    { path: '~/components/site', prefix: 'Site' },
    { path: '~/components/blog', prefix: 'Blog' },
    { path: '~/components/content', prefix: 'Content' },
    // Theme components: themes/cima/ → CimaHeader, CimaFooter, etc. (no path prefix, just filename)
    { path: '~/components/themes/cima', pathPrefix: false },
    // Catch-all for any other components (must be last, excludes already-scanned dirs)
    { path: '~/components', pathPrefix: true },
  ],
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark'
        }
      }
    }
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc'
    }
  },
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'es',
    locales: [
      { code: 'es', name: 'Español', language: 'es-ES', messages: {
    "nav": {
        "home": "Inicio",
        "about": "Quienes somos",
        "services": "Servicios",
        "courses": "Cursos",
        "mobile_units": "Unidades Móviles",
        "news": "Actualidad",
        "gallery": "Galería",
        "contact": "Contacto"
    },
    "footer": {
        "copyright": "© CIMA 20 - Todos los derechos reservados",
        "legal": "Aviso Legal",
        "privacy": "Privacidad",
        "cookies": "Cookies",
        "terms": "Condiciones Legales",
        "data_protection": "Protección de Datos",
        "navigation": "Navegación",
        "services": "Servicios",
        "contact": "Contacto",
        "brand_description": "Más de 20 años especializados en Seguridad, Prevención de Riesgos Laborales, Medio Ambiente y Calidad. Su partner de confianza en salud laboral."
    },
    "footer_services": {
        "work_safety": "Seguridad en el Trabajo",
        "risk_prevention": "Prevención de Riesgos",
        "environment": "Medio Ambiente",
        "quality_standards": "Calidad y Normativas",
        "audits": "Auditorías",
        "training": "Formación"
    },
    "footer_nav": {
        "home": "Inicio",
        "services": "Servicios",
        "about": "Sobre Nosotros",
        "blog": "Blog",
        "contact": "Contacto"
    },
    "contact": {
        "title": "Contacto",
        "name": "Nombre",
        "email": "Email",
        "phone": "Teléfono",
        "subject": "Asunto",
        "message": "Mensaje",
        "send": "Enviar mensaje",
        "sending": "Enviando...",
        "success": "Mensaje enviado correctamente",
        "success_desc": "Nos pondremos en contacto contigo pronto.",
        "error": "Error al enviar el mensaje",
        "form_title": "Formulario de contacto",
        "address": "Dirección",
        "schedule": "Horario",
        "schedule_detail": "Lunes – Viernes: 9:00 – 18:00",
        "required_fields": "Los campos marcados con * son obligatorios",
        "name_required": "El nombre es obligatorio",
        "name_min": "Mínimo 2 caracteres",
        "email_required": "El email es obligatorio",
        "email_invalid": "Email no válido",
        "phone_invalid": "Teléfono no válido",
        "message_required": "El mensaje es obligatorio",
        "message_min": "Mínimo 10 caracteres",
        "name_placeholder": "Tu nombre",
        "subject_placeholder": "¿Sobre qué nos quieres consultar?",
        "message_placeholder": "Escribe tu mensaje aquí...",
        "review_fields": "Revisa los campos marcados",
        "review_desc": "Algunos campos tienen errores",
        "cta_button": "Contactar"
    },
    "blog": {
        "title": "Actualidad",
        "description": "Noticias y artículos sobre prevención de riesgos laborales",
        "read_more": "Leer más",
        "back": "Volver al blog",
        "related": "Artículos relacionados"
    },
    "hero": {
        "title": "CIMA 20",
        "subtitle": "Seguridad, Prevención, Medio Ambiente y Calidad",
        "cta_primary": "Solicitar Presupuesto",
        "cta_secondary": "Nuestros Servicios",
        "badge_iso": "Certificados ISO",
        "badge_companies": "+300 Empresas",
        "badge_years": "+20 Años Experiencia"
    },
    "home": {
        "services_badge": "Nuestros Servicios",
        "services_title": "Soluciones integrales para su empresa",
        "services_desc": "Ofrecemos un servicio completo en materia de seguridad, prevención, medio ambiente y calidad, adaptado a las necesidades de cada organización.",
        "service_work_safety_title": "Seguridad en el Trabajo",
        "service_work_safety_desc": "Evaluación y gestión integral de riesgos laborales para garantizar entornos de trabajo seguros y conformes con la normativa vigente.",
        "service_risk_prevention_title": "Prevención de Riesgos",
        "service_risk_prevention_desc": "Planes de prevención personalizados, vigilancia de la salud y asesoramiento técnico para proteger a sus trabajadores.",
        "service_environment_title": "Medio Ambiente",
        "service_environment_desc": "Estudios de impacto ambiental, gestión de residuos y consultoría para el cumplimiento de la normativa medioambiental.",
        "service_quality_title": "Calidad y Normativas",
        "service_quality_desc": "Implantación de sistemas de gestión de calidad ISO, auditorías internas y asesoramiento en certificaciones.",
        "stat_years": "Años de Experiencia",
        "stat_companies": "Empresas Confían en Nosotros",
        "stat_professionals": "Profesionales Especializados",
        "stat_audits": "Auditorías Realizadas",
        "why_badge": "Por Qué Elegirnos",
        "why_title": "Su confianza es nuestra prioridad",
        "why_desc": "Combinamos experiencia, profesionalidad y cercanía para ofrecer un servicio de máxima calidad.",
        "feature_cert_title": "Certificación Garantizada",
        "feature_cert_desc": "Profesionales certificados con amplia experiencia en todas las especialidades de prevención.",
        "feature_speed_title": "Respuesta Rápida",
        "feature_speed_desc": "Atención ágil y personalizada. Nos adaptamos a sus plazos y necesidades operativas.",
        "feature_custom_title": "Soluciones a Medida",
        "feature_custom_desc": "Cada empresa es única. Diseñamos planes de prevención adaptados a su sector y actividad.",
        "feature_improve_title": "Mejora Continua",
        "feature_improve_desc": "Auditorías periódicas y seguimiento para asegurar la mejora continua en sus procesos.",
        "feature_commitment_title": "Compromiso Total",
        "feature_commitment_desc": "Acompañamos a nuestros clientes en todo el proceso, desde la evaluación hasta la implantación.",
        "feature_training_title": "Formación Especializada",
        "feature_training_desc": "Cursos y jornadas formativas adaptadas a su equipo para una cultura preventiva sólida.",
        "cta_badge": "Comience hoy",
        "cta_title": "¿Listo para mejorar la seguridad de su empresa?",
        "cta_desc": "Contacte con nosotros y reciba una consultoría personalizada sin compromiso.",
        "cta_primary": "Solicitar Presupuesto",
        "cta_secondary": "Ver Servicios"
    }
} },
      { code: 'ca', name: 'Català', language: 'ca-ES', messages: {
    "nav": {
        "home": "Inici",
        "about": "Qui som",
        "services": "Serveis",
        "courses": "Cursos",
        "mobile_units": "Unitats Mòbils",
        "news": "Actualitat",
        "gallery": "Galeria",
        "contact": "Contacte"
    },
    "footer": {
        "copyright": "© CIMA 20 - Tots els drets reservats",
        "legal": "Avís Legal",
        "privacy": "Privacitat",
        "cookies": "Cookies",
        "terms": "Condicions Legals",
        "data_protection": "Protecció de Dades",
        "navigation": "Navegació",
        "services": "Serveis",
        "contact": "Contacte",
        "brand_description": "Més de 20 anys especialitzats en Seguretat, Prevenció de Riscos Laborals, Medi Ambient i Qualitat. El vostre partner de confiança en salut laboral."
    },
    "contact": {
        "title": "Contacte",
        "name": "Nom",
        "email": "Correu electrònic",
        "phone": "Telèfon",
        "subject": "Assumpte",
        "message": "Missatge",
        "send": "Enviar missatge",
        "sending": "Enviant...",
        "success": "Missatge enviat correctament",
        "success_desc": "Ens posarem en contacte amb vostè aviat.",
        "error": "Error en enviar el missatge",
        "form_title": "Formulari de contacte",
        "address": "Adreça",
        "schedule": "Horari",
        "schedule_detail": "Dilluns – Divendres: 9:00 – 18:00",
        "required_fields": "Els camps marcats amb * són obligatoris",
        "name_required": "El nom és obligatori",
        "name_min": "Mínim 2 caràcters",
        "email_required": "El correu és obligatori",
        "email_invalid": "Correu no vàlid",
        "phone_invalid": "Telèfon no vàlid",
        "message_required": "El missatge és obligatori",
        "message_min": "Mínim 10 caràcters",
        "name_placeholder": "El vostre nom",
        "subject_placeholder": "Sobre què ens voleu consultar?",
        "message_placeholder": "Escriviu el vostre missatge aquí...",
        "review_fields": "Reviseu els camps marcats",
        "review_desc": "Alguns camps tenen errors",
        "cta_button": "Contactar"
    },
    "blog": {
        "title": "Actualitat",
        "description": "Notícies i articles sobre prevenció de riscos laborals",
        "read_more": "Llegir més",
        "back": "Tornar al blog",
        "related": "Articles relacionats"
    },
    "hero": {
        "title": "CIMA 20",
        "subtitle": "Seguretat, Prevenció, Medi Ambient i Qualitat",
        "cta_primary": "Sol·licitar Pressupost",
        "cta_secondary": "Els Nostres Serveis",
        "badge_iso": "Certificats ISO",
        "badge_companies": "+300 Empreses",
        "badge_years": "+20 Anys Experiència"
    },
    "footer_services": {
        "work_safety": "Seguretat al Treball",
        "risk_prevention": "Prevenció de Riscos",
        "environment": "Medi Ambient",
        "quality_standards": "Qualitat i Normatives",
        "audits": "Auditories",
        "training": "Formació"
    },
    "footer_nav": {
        "home": "Inici",
        "services": "Serveis",
        "about": "Sobre Nosaltres",
        "blog": "Blog",
        "contact": "Contacte"
    },
    "home": {
        "services_badge": "Els Nostres Serveis",
        "services_title": "Solucions integrals per a la seva empresa",
        "services_desc": "Oferim un servei complet en matèria de seguretat, prevenció, medi ambient i qualitat, adaptat a les necessitats de cada organització.",
        "service_work_safety_title": "Seguretat al Treball",
        "service_work_safety_desc": "Avaluació i gestió integral de riscos laborals per garantir entorns de treball segurs i conformes amb la normativa vigent.",
        "service_risk_prevention_title": "Prevenció de Riscos",
        "service_risk_prevention_desc": "Plans de prevenció personalitzats, vigilància de la salut i assessorament tècnic per protegir els seus treballadors.",
        "service_environment_title": "Medi Ambient",
        "service_environment_desc": "Estudis d'impacte ambiental, gestió de residus i consultoria per al compliment de la normativa mediambiental.",
        "service_quality_title": "Qualitat i Normatives",
        "service_quality_desc": "Implantació de sistemes de gestió de qualitat ISO, auditories internes i assessorament en certificacions.",
        "stat_years": "Anys d'Experiència",
        "stat_companies": "Empreses Confien en Nosaltres",
        "stat_professionals": "Professionals Especialitzats",
        "stat_audits": "Auditories Realitzades",
        "why_badge": "Per Què Triar-nos",
        "why_title": "La seva confiança és la nostra prioritat",
        "why_desc": "Combinem experiència, professionalitat i proximitat per oferir un servei de màxima qualitat.",
        "feature_cert_title": "Certificació Garantida",
        "feature_cert_desc": "Professionals certificats amb àmplia experiència en totes les especialitats de prevenció.",
        "feature_speed_title": "Resposta Ràpida",
        "feature_speed_desc": "Atenció àgil i personalitzada. Ens adaptem als seus terminis i necessitats operatives.",
        "feature_custom_title": "Solucions a Mida",
        "feature_custom_desc": "Cada empresa és única. Dissenyem plans de prevenció adaptats al seu sector i activitat.",
        "feature_improve_title": "Millora Contínua",
        "feature_improve_desc": "Auditories periòdiques i seguiment per assegurar la millora contínua en els seus processos.",
        "feature_commitment_title": "Compromís Total",
        "feature_commitment_desc": "Acompanyem els nostres clients en tot el procés, des de l'avaluació fins a la implantació.",
        "feature_training_title": "Formació Especialitzada",
        "feature_training_desc": "Cursos i jornades formatives adaptades al seu equip per a una cultura preventiva sòlida.",
        "cta_badge": "Comenci avui",
        "cta_title": "A punt per millorar la seguretat de la seva empresa?",
        "cta_desc": "Contacti amb nosaltres i rebi una consultoria personalitzada sense compromís.",
        "cta_primary": "Sol·licitar Pressupost",
        "cta_secondary": "Veure Serveis"
    }
} }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.cima20.com',
    name: 'CIMA 20',
    description: 'Seguretat, Prevenció, Medi Ambient i Qualitat',
    defaultLocale: 'es',
  },
  ogImage: {
    enabled: false,
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/admin/', '/api/', '/_nuxt/', '/_ipx/'],
    Sitemap: 'https://www.cima20.com/sitemap.xml',
  },
  sitemap: {
    sources: [
      '/api/sitemap-urls',
    ],
    autoLastmod: true,
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
    },
    xslColumns: [
      { label: 'URL', width: '65%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
    ],
  },
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || 'cima2024',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    contactEmail: process.env.CONTACT_EMAIL,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  }
})
