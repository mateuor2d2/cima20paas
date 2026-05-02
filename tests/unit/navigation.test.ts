import { describe, expect, it } from 'vitest'

/**
 * Unit tests for navigation config parsing logic.
 * Tests the data structures used in composables/useNavigation.ts
 * and the config.yml schema from content.config.ts
 */

interface NavItem {
  label: string
  to: string
  icon?: string
  children?: { label: string; to: string }[]
}

interface FooterConfig {
  text: string
  links?: { label: string; to: string }[]
}

interface SiteConfig {
  site: string
  name: string
  tagline?: string
  theme: string
  primaryColor: string
  navigation?: NavItem[]
  footer?: FooterConfig
}

function extractNavItems(config: SiteConfig | null): NavItem[] {
  return config?.navigation || []
}

function extractFooterLinks(config: SiteConfig | null): { label: string; to: string }[] {
  return config?.footer?.links || []
}

function extractFooterText(config: SiteConfig | null): string {
  return config?.footer?.text || ''
}

function flattenNavItems(items: NavItem[]): { label: string; to: string }[] {
  const flat: { label: string; to: string }[] = []
  for (const item of items) {
    flat.push({ label: item.label, to: item.to })
    if (item.children) {
      for (const child of item.children) {
        flat.push({ label: child.label, to: child.to })
      }
    }
  }
  return flat
}

describe('Navigation config parsing', () => {
  const sampleConfig: SiteConfig = {
    site: 'cima',
    name: 'PROJECTES TÈCNICS SL',
    tagline: 'Seguridad, Prevención, Medio Ambiente y Calidad',
    theme: 'cima',
    primaryColor: 'blue',
    navigation: [
      { label: 'Inicio', to: '/' },
      {
        label: 'Servicios',
        to: '/servicios',
        children: [
          { label: 'Seguridad', to: '/servicios/seguridad' },
          { label: 'Prevención', to: '/servicios/prevencion' },
          { label: 'Medio Ambiente', to: '/servicios/medio-ambiente' },
          { label: 'Calidad', to: '/servicios/calidad' },
        ]
      },
      { label: 'Sobre Nosotros', to: '/sobre-nosotros' },
      { label: 'Contacto', to: '/contacto' },
    ],
    footer: {
      text: '© PROJECTES TÈCNICS SL - Todos los derechos reservados',
      links: [
        { label: 'Aviso Legal', to: '/aviso-legal' },
        { label: 'Privacidad', to: '/privacidad' },
      ]
    }
  }

  describe('extractNavItems', () => {
    it('extracts navigation items from config', () => {
      const items = extractNavItems(sampleConfig)
      expect(items).toHaveLength(4)
      expect(items[0].label).toBe('Inicio')
    })

    it('returns empty array for null config', () => {
      expect(extractNavItems(null)).toEqual([])
    })

    it('returns empty array for config without navigation', () => {
      expect(extractNavItems({ ...sampleConfig, navigation: undefined })).toEqual([])
    })
  })

  describe('extractFooterLinks', () => {
    it('extracts footer links from config', () => {
      const links = extractFooterLinks(sampleConfig)
      expect(links).toHaveLength(2)
      expect(links[0].label).toBe('Aviso Legal')
    })

    it('returns empty array for null config', () => {
      expect(extractFooterLinks(null)).toEqual([])
    })

    it('returns empty array when footer has no links', () => {
      const config = { ...sampleConfig, footer: { text: 'Test' } }
      expect(extractFooterLinks(config)).toEqual([])
    })
  })

  describe('extractFooterText', () => {
    it('extracts footer text from config', () => {
      expect(extractFooterText(sampleConfig)).toBe('© PROJECTES TÈCNICS SL - Todos los derechos reservados')
    })

    it('returns empty string for null config', () => {
      expect(extractFooterText(null)).toBe('')
    })

    it('returns empty string when no footer', () => {
      const config = { ...sampleConfig, footer: undefined }
      expect(extractFooterText(config)).toBe('')
    })
  })

  describe('flattenNavItems', () => {
    it('flattens nested navigation into flat list', () => {
      const flat = flattenNavItems(sampleConfig.navigation!)
      expect(flat).toHaveLength(8) // 4 top-level + 4 children
    })

    it('includes children after parent', () => {
      const flat = flattenNavItems(sampleConfig.navigation!)
      const serviciosIdx = flat.findIndex(i => i.label === 'Servicios')
      expect(flat[serviciosIdx + 1].label).toBe('Seguridad')
    })

    it('handles empty navigation', () => {
      expect(flattenNavItems([])).toEqual([])
    })

    it('handles items without children', () => {
      const items = [{ label: 'Test', to: '/test' }]
      expect(flattenNavItems(items)).toEqual(items)
    })
  })
})
