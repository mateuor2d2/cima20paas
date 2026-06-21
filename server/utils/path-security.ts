import { resolve, join } from 'path'
import { createError } from 'h3'

/**
 * Validate that a path stays within the allowed base directory.
 * Throws 400 if the resolved path escapes the base.
 * Returns the resolved path if safe.
 */
export function safeJoin(base: string, ...segments: string[]): string {
  // Remove any '.' or '..' path segments from user-supplied parts
  const sanitized = segments.map(s => s.replace(/\.\./g, '').replace(/^\/+/, ''))
  const resolved = resolve(join(base, ...sanitized))

  // Ensure the resolved path stays within the base directory
  if (!resolved.startsWith(resolve(base) + '/') && resolved !== resolve(base)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid path: path traversal detected'
    })
  }

  return resolved
}

/**
 * Validate a site ID — only allow alphanumeric, hyphens, underscores.
 */
export function validateSiteId(siteId: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(siteId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid siteId: only alphanumeric, hyphens and underscores allowed'
    })
  }
  return siteId
}
