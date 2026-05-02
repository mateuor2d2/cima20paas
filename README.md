# CIMA20 — CMS Multi-Sitio con Nuxt

CMS estilo WordPress multi-sitio construido con **Nuxt 3 + Nuxt Content v3 + Nuxt UI v3** para PROJECTES TÈCNICS SL. Soporta múltiples sitios/URLs desde una sola codebase, con panel admin, blog avanzado, SEO profesional, y deploy en Docker/Dokploy.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Nuxt | latest | Framework Vue full-stack (SSR) |
| Nuxt Content v3 | latest | CMS basado en Markdown |
| Nuxt UI v3 | latest | Componentes UI (Tailwind + Headless UI) |
| @nuxtjs/seo | latest | SEO (sitemap, robots, OG, schema.org) |
| @nuxtjs/i18n | latest | Internacionalización ES/CA |
| @nuxt/image | latest | Optimización de imágenes |
| better-sqlite3 | latest | Base de datos para Nuxt Content |
| Bun | latest | Package manager y runtime |

## Arquitectura Multi-Site

El sistema detecta el hostname de la petición y carga la configuración del sitio correspondiente:

```
www.cima20.com      →  sitio: "cima",    tema: "cima"
www.otro-site.com   →  sitio: "cliente",  tema: "default"
```

### Sistema de Temas

Los componentes se resuelven dinámicamente por tema mediante `composables/useThemeComponent.ts`:

1. Busca `components/themes/{theme}/Cima{Component}.vue` (override del tema)
2. Fallback a `components/site/Site{Component}.vue` (componente base)

Temas disponibles: `cima` (CIMA20), `default` (fallback genérico).

## Estructura del Proyecto

```
cima-wp-cms/
  app.vue                    # App root
  error.vue                  # Custom error page (404, 500...)
  nuxt.config.ts             # Configuración Nuxt
  content.config.ts          # Colecciones Nuxt Content
  Dockerfile                 # Multi-stage Docker build
  docker-compose.yml         # Deploy con Traefik
  content/
    sites/
      cima/                  # Sitio cima20.com
        pages/               # 23 páginas migradas de WordPress
          index.md
          servicios/
            prevencion.md
            reconocimientos-medicos.md
            ...
        posts/               # Blog posts (8 artículos)
        config.yml           # Config: nombre, tema, nav, footer
  components/
    site/                    # Componentes base (SiteHeader, SiteFooter, SiteHero)
    themes/cima/             # Tema CIMA20 (CimaHeader, CimaFooter, CimaHero)
    blog/                    # Componentes del blog (BlogSidebar)
    content/                 # ContentPage, ContentPost
    OgImage/                 # OG Image template
  composables/
    useSite.ts               # Detección de sitio por hostname
    useThemeComponent.ts     # Resolución de componentes por tema
  layouts/
    default.vue              # Layout principal con tema dinámico
    admin.vue                # Layout del panel admin
  pages/
    index.vue                # Homepage
    [...slug].vue            # Catch-all para páginas anidadas
    contacto.vue             # Formulario de contacto
    blog/
      index.vue              # Listado con paginación
      [slug].vue             # Post individual
      categoria/[slug].vue   # Filtro por categoría
      tag/[slug].vue         # Filtro por tag
    admin/                   # Panel admin CRUD
  server/
    api/
      contact.post.ts        # Envío de email con nodemailer
      health.get.ts          # Health check
      sitemap-urls.get.ts    # URLs dinámicas para sitemap
      admin/                 # CRUD APIs para páginas, posts, config
    middleware/
      security-headers.ts    # Headers de seguridad OWASP
  locales/
    es.json                  # Traducciones español
    ca.json                  # Traducciones catalán
  assets/css/
    a11y.css                 # Estilos de accesibilidad
```

## Comandos

```bash
# Instalar dependencias
bun install

# Desarrollo (puerto 3000)
bun run dev

# Build producción
bun run build

# Preview del build
bun run preview

# Tests
bun run test:unit          # Tests unitarios (Vitest)
bun run test:integration   # Tests de integración
bun run test:e2e           # Tests E2E (Playwright)
```

## Variables de Entorno

```env
# Obligatorias en producción
NODE_ENV=production
NUXT_PUBLIC_SITE_URL=https://www.cima20.com
PORT=3001                            # ⚠️ OBLIGATORIO: Dokploy usa 3000

# Email (formulario de contacto)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
CONTACT_EMAIL=info@cima20.com

# Admin panel
ADMIN_PASSWORD=tu-password-seguro

# Opcional
NUXT_HOST=0.0.0.0
```

## Deploy en Dokploy (Producción)

### Requisitos

- VPS con Dokploy instalado
- Docker + Docker Compose
- Red Traefik `dokploy-network` configurada
- DNS apuntando al VPS

### Deploy

```bash
# 1. Clonar en el VPS
git clone https://github.com/mateuor2d2/cima20paas.git /opt/cima20paas
cd /opt/cima20paas

# 2. Crear .env
cp .env.example .env
# Editar con las variables reales

# 3. Build y deploy
docker compose up -d --build

# 4. Verificar (dentro del contenedor, no hay mapeo de puertos)
docker exec cima20paas-cima20paas-1 wget -q -O- http://localhost:3001/api/health
```

### Verificación

```bash
# Health check
docker exec cima20paas-cima20paas-1 wget -q -O- http://localhost:3001/api/health

# SSR verification
docker exec cima20paas-cima20paas-1 sh -c 'wget -S -O /dev/null http://localhost:3001/ 2>&1 | head -5'

# Rebuild limpio
docker compose down && docker system prune -f && docker compose up -d --build
```

### Troubleshooting

| Problema | Solución |
|---|---|
| `better-sqlite3` falla en build | Instalar `python3 make g++ gcc libc-dev` en Alpine |
| `ofetch` missing en runtime | Copiar `node_modules` + symlink a `.output/server/node_modules` |
| `bun.lock` desactualizado | Usar `bun install` sin `--frozen-lockfile` |
| 404 desde Dokploy en puerto 3000 | Dokploy usa 3000. Tu app debe usar `PORT=3001` |
| `NUXT_PORT` ignorado | Usar `PORT=3001`, no `NUXT_PORT` — Nitro ignora este último |
| curl desde host devuelve 000/404 | El contenedor usa red Traefik. Usar `docker exec` para testear |

## Características Implementadas

- ✅ **Multi-site por hostname** — detección automática del sitio
- ✅ **23 páginas migradas** desde WordPress original
- ✅ **Blog avanzado** — paginación, categorías, tags, sidebar, posts relacionados
- ✅ **8 artículos de blog** con contenido realista
- ✅ **SEO profesional** — sitemap.xml, robots.txt, OG images, schema.org, meta tags
- ✅ **Panel admin CRUD** — editar páginas, posts y configuración con Nuxt UI
- ✅ **Formulario de contacto** — nodemailer con SMTP, validación, honeypot anti-spam
- ✅ **i18n español/catalán** con selector de idioma
- ✅ **Sistema de temas** — componentes dinámicos por tema con fallback
- ✅ **Página 404 custom** con buscador y enlaces populares
- ✅ **Accesibilidad WCAG AA** — skip-to-content, aria-labels, roles semánticos, focus visible
- ✅ **Headers de seguridad** — X-Content-Type-Options, X-Frame-Options, CSP, etc.
- ✅ **Optimización de imágenes** — WebP/AVIF, lazy loading, placeholders
- ✅ **Docker + Traefik** — deploy production-ready con SSL automático
- ✅ **87 tests** — unitarios (Vitest), integración y E2E (Playwright)

## Colecciones de Contenido

### pages
Páginas del sitio con frontmatter: `title`, `description`, `site`, `navOrder`, `hero`.

### posts
Posts del blog con: `title`, `description`, `site`, `date`, `category`, `tags`, `author`, `image`.

### site_config
Configuración del sitio: `name`, `tagline`, `theme`, `primaryColor`, `navigation[]`, `footer{}`.

## Desarrollo Local

```bash
# 1. Clonar
git clone https://github.com/mateuor2d2/cima20paas.git
cd cima20paas

# 2. Instalar
bun install

# 3. Ejecutar
bun run dev

# 4. Abrir
open http://localhost:3000
```

El sitio se sirve en localhost:3000 y se detecta como sitio "cima" automáticamente.

## Licencia

MIT — PROJECTES TÈCNICS SL
