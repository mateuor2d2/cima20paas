import { readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { siteId } = getQuery(event)

  if (!siteId || typeof siteId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'siteId is required' })
  }

  const postsDir = join(process.cwd(), 'content', 'sites', siteId, 'posts')

  try {
    const files = await readdir(postsDir)
    return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
  } catch (e: any) {
    if (e.code === 'ENOENT') return []
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
