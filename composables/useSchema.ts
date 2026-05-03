import { useSchemaOrg, defineOrganization, defineLocalBusiness, defineArticle, defineBreadcrumb } from '#imports'

/**
 * Schema.org structured data composables for CIMA20 CMS
 * Uses nuxt-schema-org (included in @nuxtjs/seo)
 */

export function useCimaOrganization() {
  useSchemaOrg([
    defineOrganization({
      name: 'CIMA 20',
      description: 'Seguridad, Prevención de Riesgos Laborales, Medio Ambiente y Calidad',
      url: 'https://www.cima20.com',
      logo: 'https://www.cima20.com/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'C/Pau Piferrer, 8',
        addressLocality: 'Palma',
        addressRegion: 'Illes Balears',
        postalCode: '07011',
        addressCountry: 'ES',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+34971714584',
        email: 'cima20@cima20.com',
        availableLanguage: ['Spanish', 'Catalan'],
      },
      sameAs: [],
    }),
  ])
}

export function useCimaLocalBusiness() {
  useSchemaOrg([
    defineLocalBusiness({
      name: 'CIMA 20',
      description: 'Servicios de Seguridad, Prevención de Riesgos Laborales, Medio Ambiente y Calidad',
      url: 'https://www.cima20.com',
      logo: 'https://www.cima20.com/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'C/Pau Piferrer, 8',
        addressLocality: 'Palma',
        addressRegion: 'Illes Balears',
        postalCode: '07011',
        addressCountry: 'ES',
      },
      telephone: '+34971714584',
      email: 'cima20@cima20.com',
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
      author: author ? { name: author } : { name: 'CIMA 20' },
      image: image || 'https://www.cima20.com/logo.png',
      publisher: {
        name: 'CIMA 20',
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
