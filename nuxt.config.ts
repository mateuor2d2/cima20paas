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
