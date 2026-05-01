export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  ssr: true,
  nitro: {
    preset: 'node-server',
    prerender: {
      routes: ['/']
    }
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/i18n',
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
    strategy: 'prefix_except_default',
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
