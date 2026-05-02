import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { slug, title, description, site, date, category, tags, author, image, body: markdownBody } = body

  if (!slug || !title || !site || !date) {
    throw createError({ statusCode: 400, statusMessage: 'slug, title, site, and date are required' })
  }

  // Build frontmatter
  const frontmatter: Record<string, any> = { title, site, date }
  if (description) frontmatter.description = description
  if (category) frontmatter.category = category
  if (tags?.length) frontmatter.tags = tags
  if (author) frontmatter.author = author
  if (image) frontmatter.image = image

  const frontmatterLines = ['---']
  for (const [k, v] of Object.entries(frontmatter)) {
    if (Array.isArray(v)) {
      frontmatterLines.push(`${k}:`)
      v.forEach(item => frontmatterLines.push(`  - ${typeof item === 'string' ? `'${item}'` : item}`))
    } else if (typeof v === 'string') {
      frontmatterLines.push(`${k}: '${v.replace(/'/g, "\\'")}'`)
    } else {
      frontmatterLines.push(`${k}: ${v}`)
    }
  }
  frontmatterLines.push('---')

  const slugClean = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
  const fullPath = join(process.cwd(), 'content', 'sites', site, 'posts', `${slugClean}.md`)

  // Ensure directory exists
  await mkdir(dirname(fullPath), { recursive: true })

  const content = `${frontmatterLines.join('\n')}\n\n${markdownBody || ''}\n`

  await writeFile(fullPath, content, 'utf-8')

  return { success: true, slug: slugClean }
})
