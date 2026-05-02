export function useSite() {
  const hostname = process.server
    ? useRequestHeaders()['host'] || 'localhost'
    : (typeof window !== 'undefined' ? window.location.host : 'localhost')

  const siteId = computed(() => {
    // Normalize localhost/127.0.0.1 by stripping the port — any local port maps to 'cima'
    const normalizedHost = hostname.replace(/^(localhost|127\.0\.0\.1)(:\d+)?$/, '$1')
    const map: Record<string, string> = {
      'www.cima20.com': 'cima',
      'cima20.com': 'cima',
      'localhost': 'cima',
      '127.0.0.1': 'cima',
    }
    return map[normalizedHost] || 'default'
  })

  return { siteId, hostname }
}
