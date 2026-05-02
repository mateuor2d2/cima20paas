import { defineEventHandler, readBody, createError } from 'h3'

/**
 * Sanitize user input to prevent XSS and injection attacks.
 * Strips HTML tags, trims whitespace, and escapes special characters.
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Validate and sanitize form fields.
 * Returns an object with sanitized fields or throws an error.
 */
function validateAndSanitize(body: Record<string, any>) {
  const errors: string[] = []

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  // Honeypot field check — if filled, it's a bot
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

  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: errors.join('. ')
    })
  }

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

  // Validate and sanitize all fields
  const { name, email, phone, subject, message, honeypot } = validateAndSanitize(body)

  // Honeypot: silently "succeed" to not alert bots
  if (honeypot) {
    return {
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
    }
  }

  // Get SMTP config from runtime config
  const config = useRuntimeConfig()

  // Rate limiting basic: check if required SMTP config exists
  if (!config.smtpHost || !config.smtpUser) {
    console.warn('SMTP not configured — contact form submission logged only')
    console.info(`Contact form: ${name} <${email}> - ${subject}`)
    // In dev mode, still return success so the form flow works
    if (process.dev) {
      return {
        success: true,
        message: 'Mensaje registrado (modo desarrollo — SMTP no configurado).'
      }
    }
    throw createError({
      statusCode: 503,
      statusMessage: 'El servicio de correo no está configurado. Por favor, contacta por teléfono.'
    })
  }

  try {
    const nodemailer = await import('nodemailer')

    const transporter = nodemailer.default.createTransport({
      host: config.smtpHost,
      port: parseInt(config.smtpPort || '587'),
      secure: config.smtpPort === '465',
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    })

    const recipientEmail = config.contactEmail || 'info@cima20.com'
    const formattedDate = new Date().toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short'
    })

    // Send HTML email with professional template
    await transporter.sendMail({
      from: `"CIMA20 Web" <${config.smtpUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[Web] ${subject}`,
      text: `
Nuevo mensaje de contacto
==========================
Fecha: ${formattedDate}

Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Asunto: ${subject}

Mensaje:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- Header -->
    <tr>
      <td style="background-color: #2563eb; padding: 24px 32px;">
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Nuevo mensaje de contacto</h1>
        <p style="margin: 4px 0 0 0; color: #93c5fd; font-size: 14px;">PROJECTES TÈCNICS SL — Web</p>
      </td>
    </tr>
    <!-- Date -->
    <tr>
      <td style="padding: 16px 32px 0; font-size: 13px; color: #737373;">
        📅 ${formattedDate}
      </td>
    </tr>
    <!-- Contact Info -->
    <tr>
      <td style="padding: 16px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 6px; padding: 16px;">
          <tr>
            <td style="padding: 8px 16px; font-size: 14px;">
              <strong style="color: #374151;">Nombre:</strong>
              <span style="color: #1f2937; margin-left: 8px;">${name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 14px;">
              <strong style="color: #374151;">Email:</strong>
              <a href="mailto:${email}" style="color: #2563eb; margin-left: 8px;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 14px;">
              <strong style="color: #374151;">Teléfono:</strong>
              <span style="color: #1f2937; margin-left: 8px;">${phone || 'No proporcionado'}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 16px; font-size: 14px;">
              <strong style="color: #374151;">Asunto:</strong>
              <span style="color: #1f2937; margin-left: 8px;">${subject}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Message -->
    <tr>
      <td style="padding: 0 32px 24px;">
        <h2 style="margin: 0 0 12px; font-size: 16px; color: #374151;">Mensaje</h2>
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; font-size: 14px; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${message}</div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
          Este mensaje fue enviado desde el formulario de contacto de cima20.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    })

    return {
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
    }
  } catch (error: any) {
    console.error('Contact form email error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde o contacta por teléfono.'
    })
  }
})
