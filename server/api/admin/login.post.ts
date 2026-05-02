export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const adminPassword = config.adminPassword || 'cima2024'

  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required',
    })
  }

  if (password === adminPassword) {
    return { success: true }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid password',
  }
)
})
