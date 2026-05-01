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
      'localhost:3456': 'cima',
      '127.0.0.1': 'cima',
      '127.0.0.1:3000': 'cima',
      '127.0.0.1:3456': 'cima',
    }
    return map[hostname] || 'default'
  })

  return { siteId, hostname }
}
