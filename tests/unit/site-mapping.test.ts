import { describe, expect, it } from 'vitest'

/**
 * Unit tests for the site mapping logic from composables/useSite.ts
 * 
 * The site mapping determines which site config to load based on hostname.
 * We test the pure mapping logic without needing the Nuxt context.
 */

function resolveSiteId(hostname: string): string {
  // Normalize localhost/127.0.0.1 by stripping the port — mirrors useSite.ts
  const normalizedHost = hostname.replace(/^(localhost|127\.0\.0\.1)(:\d+)?$/, '$1')
  const map: Record<string, string> = {
    'www.cima20.com': 'cima',
    'cima20.com': 'cima',
    'localhost': 'cima',
    '127.0.0.1': 'cima',
  }
  return map[normalizedHost] || 'default'
}

describe('Site mapping logic', () => {
  describe('CIMA20 domains', () => {
    it('maps www.cima20.com to cima', () => {
      expect(resolveSiteId('www.cima20.com')).toBe('cima')
    })

    it('maps cima20.com (bare domain) to cima', () => {
      expect(resolveSiteId('cima20.com')).toBe('cima')
    })
  })

  describe('Localhost variants', () => {
    it('maps localhost to cima', () => {
      expect(resolveSiteId('localhost')).toBe('cima')
    })

    it('maps localhost:3000 to cima', () => {
      expect(resolveSiteId('localhost:3000')).toBe('cima')
    })

    it('maps localhost:3456 to cima', () => {
      expect(resolveSiteId('localhost:3456')).toBe('cima')
    })

    it('maps localhost:3099 to cima (test port)', () => {
      expect(resolveSiteId('localhost:3099')).toBe('cima')
    })

    it('maps localhost with any port to cima', () => {
      expect(resolveSiteId('localhost:8080')).toBe('cima')
      expect(resolveSiteId('localhost:4000')).toBe('cima')
      expect(resolveSiteId('localhost:1')).toBe('cima')
    })

    it('maps 127.0.0.1 to cima', () => {
      expect(resolveSiteId('127.0.0.1')).toBe('cima')
    })

    it('maps 127.0.0.1 with any port to cima', () => {
      expect(resolveSiteId('127.0.0.1:3000')).toBe('cima')
      expect(resolveSiteId('127.0.0.1:3456')).toBe('cima')
      expect(resolveSiteId('127.0.0.1:3099')).toBe('cima')
      expect(resolveSiteId('127.0.0.1:8080')).toBe('cima')
    })
  })

  describe('Unknown domains default to default', () => {
    it('maps unknown domain to default', () => {
      expect(resolveSiteId('www.otro-site.com')).toBe('default')
    })

    it('maps unknown IP to default', () => {
      expect(resolveSiteId('192.168.1.1')).toBe('default')
    })

    it('maps empty string to default', () => {
      expect(resolveSiteId('')).toBe('default')
    })
  })

  describe('Edge cases', () => {
    it('handles case-sensitive hostnames (no match for uppercase)', () => {
      // Hostnames are case-insensitive in HTTP, but the map is lowercase
      // This test documents the current behavior
      expect(resolveSiteId('WWW.CIMA20.COM')).toBe('default')
    })

    it('handles port-only hostname as default', () => {
      expect(resolveSiteId(':3000')).toBe('default')
    })

    it('handles hostname with trailing slash as default', () => {
      expect(resolveSiteId('www.cima20.com/')).toBe('default')
    })

    it('does not strip port from production domains', () => {
      // Only localhost/127.0.0.1 get port normalization
      expect(resolveSiteId('www.cima20.com:8080')).toBe('default')
    })
  })
})
