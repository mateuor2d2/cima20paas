export function useNavigation() {
  const { config } = useSite()

  const navItems = computed(() => {
    return config.value?.navigation || []
  })

  const footerLinks = computed(() => {
    return config.value?.footer?.links || []
  })

  const footerText = computed(() => {
    return config.value?.footer?.text || ''
  })

  return { navItems, footerLinks, footerText }
}
