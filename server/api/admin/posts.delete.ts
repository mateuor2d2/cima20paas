import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { path: contentPath } = body

  if (!contentPath) {
    throw createError({ statusCode: 400, statusMessage: 'path is required' })
  }

  // contentPath is like /sites/cima/posts/my-post
  const relativePath = contentPath.replace(/^\//, '')
  const fullPath = join(process.cwd(), 'content', `${relativePath}.md`)

  try {
    await unlink(fullPath)
    return { success: true }
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
