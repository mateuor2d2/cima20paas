import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path: contentPath, title, description, site, date, category, tags, author, image, body: markdownBody } = body

  if (!contentPath || !title || !site) {
    throw createError({ statusCode: 400, statusMessage: 'path, title, and site are required' })
  }

  // Build frontmatter
  const frontmatter: Record<string, any> = { title, site }
  if (date) frontmatter.date = date
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

  // contentPath is like /sites/cima/posts/my-post
  const relativePath = contentPath.replace(/^\//, '')
  const fullPath = join(process.cwd(), 'content', `${relativePath}.md`)

  const content = `${frontmatterLines.join('\n')}\n\n${markdownBody || ''}\n`

  await writeFile(fullPath, content, 'utf-8')

  return { success: true, path: contentPath }
})
