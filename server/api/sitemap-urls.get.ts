import { defineEventHandler } from 'h3'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://www.cima20.com'
  const urls = []

  try {
    // Query all pages from Nuxt Content v3
    const pages = await serverQueryContent(event, 'pages')
      .where('site', '=', 'cima')
      .find()

    for (const page of pages) {
      // Extract the public-facing path from the content path
      // Content path: /sites/cima/pages/servicios/seguridad
      // Public path: /servicios/seguridad
      let publicPath = page.path || ''
      if (publicPath.startsWith('/sites/cima/pages')) {
        publicPath = publicPath.replace('/sites/cima/pages', '')
        // Handle index page
        if (publicPath === '' || publicPath === '/index') {
          publicPath = '/'
        }
      }

      if (publicPath) {
        urls.push({
          loc: `${siteUrl}${publicPath}`,
          lastmod: page.updatedAt || page.date || new Date().toISOString(),
          changefreq: publicPath === '/' ? 'weekly' : 'monthly',
          priority: publicPath === '/' ? 1.0 : 0.8,
        })
      }
    }

    // Query all blog posts
    const posts = await serverQueryContent(event, 'posts')
      .where('site', '=', 'cima')
      .find()

    for (const post of posts) {
      let publicPath = post.path || ''
      if (publicPath.startsWith('/sites/cima/posts')) {
        publicPath = publicPath.replace('/sites/cima/posts', '/blog')
      }

      if (publicPath) {
        urls.push({
          loc: `${siteUrl}${publicPath}`,
          lastmod: post.date || post.updatedAt || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        })
      }
    }

    // Add static routes
    urls.push(
      { loc: `${siteUrl}/blog`, changefreq: 'weekly', priority: 0.8 },
      { loc: `${siteUrl}/contacto`, changefreq: 'monthly', priority: 0.7 },
    )
  } catch (error) {
    console.error('Error generating sitemap URLs:', error)
  }

  return urls
})
