import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  const { name, email, phone, subject, message } = body
  
  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos obligatorios (nombre, email, mensaje)'
    })
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email no válido'
    })
  }
  
  // Get SMTP config from runtime config
  const config = useRuntimeConfig()
  
  try {
    // If SMTP is configured, send email
    if (config.smtpHost && config.smtpUser) {
      // Dynamic import of nodemailer
      const nodemailer = await import('nodemailer')
      
      const transporter = nodemailer.default.createTransport({
        host: config.smtpHost,
        port: parseInt(config.smtpPort || '587'),
        secure: false,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        }
      })
      
      await transporter.sendMail({
        from: `"CIMA20 Web" <${config.smtpUser}>`,
        to: config.contactEmail || 'info@cima20.com',
        replyTo: email,
        subject: `Contacto web: ${subject || 'Sin asunto'}`,
        text: `
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Asunto: ${subject || 'Sin asunto'}

Mensaje:
${message}
        `,
        html: `
<h2>Nuevo mensaje de contacto desde la web</h2>
<p><strong>Nombre:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
<p><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
<hr>
<p><strong>Mensaje:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    }
    
    // Return success
    return {
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
    }
  } catch (error: any) {
    console.error('Contact form error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error al enviar el mensaje: ${error.message}`
    })
  }
})
