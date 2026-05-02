/**
 * useThemeComponent — Resolves theme-specific components with fallback to base.
 *
 * Resolution order:
 *   1. components/themes/{theme}/Cima{N}.vue  (theme override)
 *   2. components/site/Site{N}.vue             (base component)
 *
 * The theme is read from the site config (config.yml → theme field).
 * Falls back to "default" when no theme is specified.
 */
export function useThemeComponent(name: string) {
  const { siteId } = useSite()

  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

  // Build candidate component names in priority order
  const candidates = computed(() => {
    // We'll resolve theme from siteId mapping for now
    // since config needs async loading
    const themeMap: Record<string, string> = {
      cima: 'Cima',
      default: 'Default',
    }
    const prefix = themeMap[siteId.value] || 'Site'

    return [
      `${prefix}${capitalizedName}`,   // e.g. CimaHeader
      `Site${capitalizedName}`,         // e.g. SiteHeader (base)
    ]
  })

  const resolvedComponent = computed(() => {
    for (const candidate of candidates.value) {
      const resolved = resolveComponent(candidate)
      // resolveComponent returns the name as string if not found
      if (typeof resolved !== 'string') {
        return resolved
      }
    }
    // Return a generic fallback div
    return null
  })

  const componentName = computed(() => {
    if (resolvedComponent.value) {
      return candidates.value[0] // theme-specific name
    }
    return candidates.value[1]   // base name
  })

  return {
    component: resolvedComponent,
    componentName,
    isThemed: computed(() => resolvedComponent.value !== null && candidates.value[0] !== candidates.value[1]),
  }
}

/**
 * Helper: get the current theme name for the active site.
 */
export function useTheme() {
  const { siteId } = useSite()

  const themeMap: Record<string, string> = {
    cima: 'cima',
    default: 'default',
  }

  const theme = computed(() => themeMap[siteId.value] || 'default')

  return { theme, siteId }
}
