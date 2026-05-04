import { defineEventHandler, readBody, createError } from 'h3'

function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function validateAndSanitize(body: Record<string, any>) {
  const errors: string[] = []
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const honeypot = typeof body.website === 'string' ? body.website : ''

  if (!name || name.length < 2) errors.push('El nombre es obligatorio (mínimo 2 caracteres)')
  if (name.length > 100) errors.push('El nombre es demasiado largo (máximo 100 caracteres)')
  if (!email) { errors.push('El email es obligatorio') } else {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('El email no es válido')
  }
  if (!message || message.length < 10) errors.push('El mensaje es obligatorio (mínimo 10 caracteres)')
  if (message.length > 5000) errors.push('El mensaje es demasiado largo (máximo 5000 caracteres)')
  if (phone && !/^[\d\s+\-()]{6,20}$/.test(phone)) errors.push('El teléfono no es válido')

  if (errors.length > 0) throw createError({ statusCode: 400, statusMessage: errors.join('. ') })

  return {
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    phone: sanitizeInput(phone),
    subject: sanitizeInput(subject || 'Consulta desde la web'),
    message: sanitizeInput(message),
    honeypot
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, phone, subject, message, honeypot } = validateAndSanitize(body)

  if (honeypot) {
    return { success: true, message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.' }
  }

  const config = useRuntimeConfig()
  const apiKey = config.mailgunApiKey
  const domain = config.mailgunDomain

  if (!apiKey || !domain) {
    console.warn('Mailgun not configured — contact form submission logged only')
    console.info(`Contact form: ${name} <${email}> - ${subject}`)
    if (process.dev) {
      return { success: true, message: 'Mensaje registrado (modo desarrollo — Mailgun no configurado).' }
    }
    throw createError({ statusCode: 503, statusMessage: 'El servicio de correo no está configurado.' })
  }

  try {
    const recipientEmail = config.contactEmail || 'info@cima20.com'
    const formattedDate = new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })

    const mailgunBody = new URLSearchParams({
      from: `CIMA20 Web <postmaster@${domain}>`,
      to: recipientEmail,
      'h:Reply-To': email,
      subject: `[Web] ${subject}`,
      text: `Nuevo mensaje de contacto\n${'='.repeat(40)}\nFecha: ${formattedDate}\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || 'No proporcionado'}\nAsunto: ${subject}\n\nMensaje:\n${message}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
<tr><td style="background:#2563eb;padding:24px 32px;"><h1 style="margin:0;color:#fff;font-size:20px;">Nuevo mensaje de contacto</h1><p style="margin:4px 0 0;color:#93c5fd;font-size:14px;">CIMA 20 — Web</p></td></tr>
<tr><td style="padding:16px 32px 0;font-size:13px;color:#737373;">&#128197; ${formattedDate}</td></tr>
<tr><td style="padding:16px 32px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:6px;padding:16px;">
<tr><td style="padding:8px 16px;font-size:14px;"><strong style="color:#374151;">Nombre:</strong> <span style="color:#1f2937;margin-left:8px;">${name}</span></td></tr>
<tr><td style="padding:8px 16px;font-size:14px;"><strong style="color:#374151;">Email:</strong> <a href="mailto:${email}" style="color:#2563eb;margin-left:8px;">${email}</a></td></tr>
<tr><td style="padding:8px 16px;font-size:14px;"><strong style="color:#374151;">Teléfono:</strong> <span style="color:#1f2937;margin-left:8px;">${phone || 'No proporcionado'}</span></td></tr>
<tr><td style="padding:8px 16px;font-size:14px;"><strong style="color:#374151;">Asunto:</strong> <span style="color:#1f2937;margin-left:8px;">${subject}</span></td></tr>
</table></td></tr>
<tr><td style="padding:0 32px 24px;"><h2 style="margin:0 0 12px;font-size:16px;color:#374151;">Mensaje</h2><div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:16px;font-size:14px;color:#1f2937;line-height:1.6;white-space:pre-wrap;">${message}</div></td></tr>
<tr><td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e5e7eb;"><p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Mensaje enviado desde el formulario de contacto de cima20.com</p></td></tr>
</table></body></html>`
    })

    const auth = Buffer.from(`api:${apiKey}`).toString('base64')
    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: mailgunBody.toString()
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Mailgun API error:', res.status, errText)
      throw new Error(`Mailgun API error: ${res.status}`)
    }

    const result = await res.json()
    console.info('Mailgun sent:', JSON.stringify(result))

    return { success: true, message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.' }
  } catch (error: any) {
    console.error('Contact form error:', error?.message || error)
    throw createError({ statusCode: 500, statusMessage: 'Error al enviar el mensaje. Inténtalo de nuevo más tarde.' })
  }
})
