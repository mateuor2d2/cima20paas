import { useSchemaOrg, defineOrganization, defineLocalBusiness, defineArticle, defineBreadcrumb } from '#imports'

/**
 * Schema.org structured data composables for CIMA20 CMS
 * Uses nuxt-schema-org (included in @nuxtjs/seo)
 */

export function useCimaOrganization() {
  useSchemaOrg([
    defineOrganization({
      name: 'PROJECTES TÈCNICS SL',
      description: 'Seguridad, Prevención de Riesgos Laborales, Medio Ambiente y Calidad',
      url: 'https://www.cima20.com',
      logo: 'https://www.cima20.com/logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Barcelona',
        addressRegion: 'BCN',
        addressCountry: 'ES',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'info@cima20.com',
        availableLanguage: ['Spanish', 'Catalan'],
      },
      sameAs: [],
    }),
  ])
}

export function useCimaLocalBusiness() {
  useSchemaOrg([
    defineLocalBusiness({
      name: 'PROJECTES TÈCNICS SL',
      description: 'Servicios de Seguridad, Prevención de Riesgos Laborales, Medio Ambiente y Calidad',
      url: 'https://www.cima20.com',
      logo: 'https://www.cima20.com/logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Barcelona',
        addressRegion: 'BCN',
        addressCountry: 'ES',
      },
      telephone: undefined,
      email: 'info@cima20.com',
      priceRange: '$$',
    }),
  ])
}

export function useCimaArticle(title: string, description: string, date: string, author?: string, image?: string) {
  useSchemaOrg([
    defineArticle({
      headline: title,
      description: description,
      datePublished: date,
      author: author ? { name: author } : { name: 'PROJECTES TÈCNICS SL' },
      image: image || 'https://www.cima20.com/logo.png',
      publisher: {
        name: 'PROJECTES TÈCNICS SL',
        logo: 'https://www.cima20.com/logo.png',
      },
    }),
  ])
}

export function useCimaBreadcrumbs(items: { name: string; to: string }[]) {
  const siteUrl = 'https://www.cima20.com'
  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: items.map((item, index) => ({
        name: item.name,
        url: item.to.startsWith('http') ? item.to : `${siteUrl}${item.to}`,
      })),
    }),
  ])
}
