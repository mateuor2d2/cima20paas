export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
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
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})
