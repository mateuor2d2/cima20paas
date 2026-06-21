import { writeFile } from 'fs/promises'
import { join } from 'path'
import { validateSiteId } from '~/server/utils/path-security'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { siteId, config } = body

  if (!siteId || !config) {
    throw createError({ statusCode: 400, statusMessage: 'siteId and config are required' })
  }

  const safeSiteId = validateSiteId(siteId)

  // Build YAML config with site field
  const configData = {
    site: safeSiteId,
    name: config.name,
    tagline: config.tagline || '',
    theme: config.theme || 'default',
    primaryColor: config.primaryColor || 'blue',
    navigation: config.navigation || [],
    footer: config.footer || { text: '', links: [] },
  }

  // Safe path: only alphanumeric siteId, fixed filename
  const fullPath = join(process.cwd(), 'content', 'sites', safeSiteId, 'config.yml')

  const yamlContent = objectToYaml(configData)

  await writeFile(fullPath, yamlContent, 'utf-8')

  return { success: true }
})

function objectToYaml(obj: Record<string, any>, indent: number = 0): string {
  const prefix = '  '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      lines.push(`${prefix}${key}: `)
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${prefix}${key}: []`)
      } else if (typeof value[0] === 'object') {
        lines.push(`${prefix}${key}:`)
        value.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${prefix}  -`)
            for (const [k, v] of Object.entries(item)) {
              if (typeof v === 'string') {
                lines.push(`${prefix}    ${k}: '${v.replace(/'/g, "\\'")}'`)
              } else {
                lines.push(`${prefix}    ${k}: ${v}`)
              }
            }
          } else {
            lines.push(`${prefix}  - ${typeof item === 'string' ? `'${item}'` : item}`)
          }
        })
      } else {
        lines.push(`${prefix}${key}:`)
        value.forEach(item => {
          lines.push(`${prefix}  - ${typeof item === 'string' ? `'${item}'` : item}`)
        })
      }
    } else if (typeof value === 'object') {
      lines.push(`${prefix}${key}:`)
      lines.push(objectToYaml(value, indent + 1))
    } else if (typeof value === 'string') {
      lines.push(`${prefix}${key}: '${value.replace(/'/g, "\\'")}'`)
    } else if (typeof value === 'boolean') {
      lines.push(`${prefix}${key}: ${value}`)
    } else {
      lines.push(`${prefix}${key}: ${value}`)
    }
  }

  return lines.join('\n')
}
