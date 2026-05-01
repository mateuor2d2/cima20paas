export default defineNuxtPlugin(async () => {
  const { siteId, config } = useSite()
  
  // Precarga la configuración del sitio para que esté disponible en SSR
  if (!config.value) {
    console.warn(`[site-init] No config found for site: ${siteId.value}`)
  }
})
