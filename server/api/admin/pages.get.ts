import { readFile, readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { siteId } = getQuery(event)

  if (!siteId || typeof siteId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'siteId is required' })
  }

  const contentDir = join(process.cwd(), 'content', 'sites', siteId, 'pages')

  try {
    const files = await walkDir(contentDir, contentDir)
    return files
  } catch (e: any) {
    // If directory doesn't exist, return empty
    if (e.code === 'ENOENT') return []
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})

async function walkDir(dir: string, baseDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walkDir(fullPath, baseDir))
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath.replace(baseDir + '/', ''))
    }
  }

  return files
}
