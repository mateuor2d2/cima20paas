# CIMA WP CMS

CMS estilo WordPress multi-sitio con Nuxt 3 + NuxtPress (Nuxt Content v3) + Nuxt UI v3.

## Stack

- **Nuxt 3** — Framework Vue full-stack
- **Nuxt Content v3** — CMS basado en Markdown con query builder
- **Nuxt UI v3** — Componentes UI
- **@nuxt/image** — Optimización de imágenes

## Arquitectura Multi-Site

Detecta el hostname y carga contenido específico:

- `www.cima20.com` → sitio `cima`
- Otros dominios → sitio `default` (fallback)

## Estructura de contenido

```
content/sites/
  cima/           # Contenido de cima20.com
    pages/        # Páginas estáticas
    posts/        # Blog posts
    config.yml    # Config del sitio
  default/        # Fallback
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run generate
```

## Variables de entorno

```
NUXT_PUBLIC_SITE_URL=https://www.cima20.com
```

## Deployment

### Render.com

```yaml
services:
  - type: web
    name: cima-wp-cms
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: node .output/server/index.mjs
```
