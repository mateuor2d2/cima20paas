import { describe, expect, it } from 'vitest'

/**
 * Unit tests for sanitizeInput and validation logic from contact.post.ts
 * These are pure functions so we can test them directly.
 */

// --- Extract pure functions for testing (mirroring server/api/contact.post.ts) ---

function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function validateFormFields(body: Record<string, any>): { errors: string[], data: Record<string, any> } {
  const errors: string[] = []

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const honeypot = typeof body.website === 'string' ? body.website : ''

  if (!name || name.length < 2) {
    errors.push('El nombre es obligatorio (mínimo 2 caracteres)')
  }
  if (name.length > 100) {
    errors.push('El nombre es demasiado largo (máximo 100 caracteres)')
  }

  if (!email) {
    errors.push('El email es obligatorio')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('El email no es válido')
    }
  }

  if (!message || message.length < 10) {
    errors.push('El mensaje es obligatorio (mínimo 10 caracteres)')
  }
  if (message.length > 5000) {
    errors.push('El mensaje es demasiado largo (máximo 5000 caracteres)')
  }

  if (phone && !/^[\d\s+\-()]{6,20}$/.test(phone)) {
    errors.push('El teléfono no es válido')
  }

  return {
    errors,
    data: {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      subject: sanitizeInput(subject || 'Consulta desde la web'),
      message: sanitizeInput(message),
      honeypot
    }
  }
}

describe('sanitizeInput', () => {
  it('escapes HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's a test")).toBe("it&#x27;s a test")
  })

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world')
  })

  it('handles normal text without changes', () => {
    expect(sanitizeInput('Juan García')).toBe('Juan García')
  })

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('escapes double quotes', () => {
    expect(sanitizeInput('say "hello"')).toBe('say &quot;hello&quot;')
  })
})

describe('validateFormFields', () => {
  it('accepts valid form data', () => {
    const result = validateFormFields({
      name: 'Juan García',
      email: 'juan@example.com',
      message: 'Me gustaría información sobre sus servicios de prevención.'
    })
    expect(result.errors).toHaveLength(0)
    expect(result.data.name).toBe('Juan García')
    expect(result.data.email).toBe('juan@example.com')
    expect(result.data.subject).toBe('Consulta desde la web') // default
  })

  it('rejects missing name', () => {
    const result = validateFormFields({
      name: '',
      email: 'test@test.com',
      message: 'Este es un mensaje de prueba suficientemente largo'
    })
    expect(result.errors).toContain('El nombre es obligatorio (mínimo 2 caracteres)')
  })

  it('rejects short name (1 char)', () => {
    const result = validateFormFields({
      name: 'J',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar'
    })
    expect(result.errors).toContain('El nombre es obligatorio (mínimo 2 caracteres)')
  })

  it('rejects name too long (>100 chars)', () => {
    const result = validateFormFields({
      name: 'A'.repeat(101),
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar'
    })
    expect(result.errors).toContain('El nombre es demasiado largo (máximo 100 caracteres)')
  })

  it('rejects missing email', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: '',
      message: 'Un mensaje suficientemente largo para pasar'
    })
    expect(result.errors).toContain('El email es obligatorio')
  })

  it('rejects invalid email format', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'not-an-email',
      message: 'Un mensaje suficientemente largo para pasar'
    })
    expect(result.errors).toContain('El email no es válido')
  })

  it('rejects various invalid emails', () => {
    const invalidEmails = ['@test.com', 'test@', 'test', 'test @test.com', 'test@.com']
    for (const email of invalidEmails) {
      const result = validateFormFields({
        name: 'Juan',
        email,
        message: 'Un mensaje suficientemente largo para pasar'
      })
      expect(result.errors.length).toBeGreaterThan(0)
    }
  })

  it('accepts valid email formats', () => {
    const validEmails = ['user@example.com', 'user+tag@domain.org', 'user.name@co.uk']
    for (const email of validEmails) {
      const result = validateFormFields({
        name: 'Juan',
        email,
        message: 'Un mensaje suficientemente largo para pasar'
      })
      expect(result.errors).not.toContain('El email no es válido')
    }
  })

  it('rejects missing message', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: ''
    })
    expect(result.errors).toContain('El mensaje es obligatorio (mínimo 10 caracteres)')
  })

  it('rejects short message (<10 chars)', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Hola'
    })
    expect(result.errors).toContain('El mensaje es obligatorio (mínimo 10 caracteres)')
  })

  it('rejects message too long (>5000 chars)', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'A'.repeat(5001)
    })
    expect(result.errors).toContain('El mensaje es demasiado largo (máximo 5000 caracteres)')
  })

  it('accepts exactly 10-char message', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: '1234567890'
    })
    expect(result.errors).not.toContain('El mensaje es obligatorio (mínimo 10 caracteres)')
  })

  it('rejects invalid phone number', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar',
      phone: 'abc'
    })
    expect(result.errors).toContain('El teléfono no es válido')
  })

  it('accepts valid phone numbers', () => {
    const validPhones = ['+34 612 345 678', '612345678', '+34-612-345-678', '(93) 123 4567']
    for (const phone of validPhones) {
      const result = validateFormFields({
        name: 'Juan',
        email: 'test@test.com',
        message: 'Un mensaje suficientemente largo para pasar',
        phone
      })
      expect(result.errors).not.toContain('El teléfono no es válido')
    }
  })

  it('accepts empty phone (optional field)', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar',
      phone: ''
    })
    expect(result.errors).not.toContain('El teléfono no es válido')
  })

  it('detects honeypot field (bot)', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar',
      website: 'http://spam.com'
    })
    expect(result.data.honeypot).toBe('http://spam.com')
  })

  it('sanitizes XSS in name field', () => {
    const result = validateFormFields({
      name: '<script>alert(1)</script>',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar'
    })
    expect(result.data.name).toContain('&lt;script&gt;')
  })

  it('handles non-string fields gracefully', () => {
    const result = validateFormFields({
      name: 123,
      email: null,
      message: undefined
    })
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors).toContain('El nombre es obligatorio (mínimo 2 caracteres)')
    expect(result.errors).toContain('El email es obligatorio')
    expect(result.errors).toContain('El mensaje es obligatorio (mínimo 10 caracteres)')
  })

  it('uses default subject when empty', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar',
      subject: ''
    })
    expect(result.data.subject).toBe('Consulta desde la web')
  })

  it('uses provided subject when present', () => {
    const result = validateFormFields({
      name: 'Juan',
      email: 'test@test.com',
      message: 'Un mensaje suficientemente largo para pasar',
      subject: 'Consulta sobre servicios'
    })
    expect(result.data.subject).toBe('Consulta sobre servicios')
  })

  it('returns multiple errors at once', () => {
    const result = validateFormFields({})
    expect(result.errors.length).toBeGreaterThanOrEqual(3)
  })
})
