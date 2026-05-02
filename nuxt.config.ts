export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  ssr: true,
  nitro: {
    preset: 'node-server'
  },
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
    format: ['webp', 'jpg'],
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
    strategy: 'no_prefix',
    defaultLocale: 'es',
    locales: [
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'ca', name: 'Català', file: 'ca.json' }
    ],
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.cima20.com',
    name: 'PROJECTES TÈCNICS SL',
    description: 'Seguretat, Prevenció, Medi Ambient i Qualitat',
    defaultLocale: 'es',
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/admin/', '/api/', '/_nuxt/', '/_ipx/'],
    Sitemap: 'https://www.cima20.com/sitemap.xml',
  },
  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    contactEmail: process.env.CONTACT_EMAIL,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  }
})
