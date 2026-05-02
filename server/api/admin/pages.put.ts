import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path: contentPath, title, description, site, navOrder, hero, body: markdownBody } = body

  if (!contentPath || !title || !site) {
    throw createError({ statusCode: 400, statusMessage: 'path, title, and site are required' })
  }

  // Build frontmatter
  const frontmatter: Record<string, any> = { title, site }
  if (description) frontmatter.description = description
  if (navOrder !== undefined) frontmatter.navOrder = navOrder
  if (hero !== undefined) frontmatter.hero = hero

  const frontmatterStr = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v.replace(/'/g, "\\'")}'` : v}`)
    .join('\n')

  const fullPath = join(process.cwd(), 'content', 'sites', site, 'pages', contentPath.replace(/^\//, ''))

  // Ensure directory exists
  await mkdir(dirname(fullPath), { recursive: true })

  const content = `---\n${frontmatterStr}\n---\n\n${markdownBody || ''}\n`

  await writeFile(fullPath, content, 'utf-8')

  return { success: true, path: contentPath }
})
