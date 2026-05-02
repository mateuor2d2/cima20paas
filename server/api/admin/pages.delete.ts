import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path: contentPath } = body

  if (!contentPath) {
    throw createError({ statusCode: 400, statusMessage: 'path is required' })
  }

  // contentPath is like /sites/cima/pages/servicios/seguridad
  // We need to find the actual .md file
  const relativePath = contentPath.replace(/^\//, '') // sites/cima/pages/servicios/seguridad
  const fullPath = join(process.cwd(), 'content', `${relativePath}.md`)

  try {
    await unlink(fullPath)
    return { success: true }
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
