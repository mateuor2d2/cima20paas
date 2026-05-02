import { defineEventHandler, setResponseHeaders } from 'h3'

/**
 * Security headers middleware for all responses.
 * Applies OWASP-recommended security headers via Nitro middleware.
 */
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Prevent clickjacking — deny framing (adjust to SAMEORIGIN if needed)
    'X-Frame-Options': 'DENY',
    // Enable browser XSS filter (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    // Control referrer information leakage
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Disable access to camera and microphone
    'Permissions-Policy': 'camera=(), microphone=()',
    // Content Security Policy — basic restrictive policy
    // Allows: scripts from self and inline, styles from self and inline (Tailwind/Nuxt UI needs this),
    // images from self and data: (for optimized images), fonts from Google Fonts,
    // connections to self (API calls), frame-ancestors none (prevents framing)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    // Strict Transport Security — 1 year, include subdomains
    // Only effective over HTTPS; will be ignored on HTTP
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  })
})
