export function useSite() {
  const hostname = process.server
    ? useRequestHeaders()['host'] || 'localhost'
    : (typeof window !== 'undefined' ? window.location.host : 'localhost')

  const siteId = computed(() => {
    const map: Record<string, string> = {
      'www.cima20.com': 'cima',
      'cima20.com': 'cima',
      'localhost': 'cima',
      'localhost:3000': 'cima',
    }
    return map[hostname] || 'default'
  })

  const { data: config } = useAsyncData(`site-config-${siteId.value}`, () => {
    return queryCollection('site_config')
      .where('site', '=', siteId.value)
      .first()
  })

  return { siteId, config, hostname }
}
