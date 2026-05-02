/**
 * Normalize a string to a URL-safe slug.
 * Removes diacritics (accents), replaces spaces/special chars with hyphens,
 * lowercases, and strips non-alphanumeric characters.
 *
 * Examples:
 *   "prevención" → "prevencion"
 *   "medio ambiente" → "medio-ambiente"
 *   "Legislación PRL" → "legislacion-prl"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')                    // Decompose accented chars: é → e + ́
    .replace(/[\u0300-\u036f]/g, '')     // Remove combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')        // Remove non-alphanumeric (except space/hyphen)
    .replace(/[\s_]+/g, '-')             // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')                 // Collapse multiple hyphens
    .replace(/^-|-$/g, '')               // Trim leading/trailing hyphens
}
