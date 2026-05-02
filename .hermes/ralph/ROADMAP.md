# Roadmap: CMS WordPress con Nuxt para cima20

## Meta

Llevar el CMS multi-sitio CIMA20 (Nuxt 3 + Nuxt Content v3 + Nuxt UI v3) desde su estado actual (base funcional con 23 páginas migradas, blog básico, Docker, i18n) hasta production-ready: sitio web profesional completo con SEO, blog avanzado, panel admin funcional, formulario con SMTP real, performance optimizada, tests, accesibilidad y deploy en Dokploy con DNS/Traefik.

---

## Milestone 1: SEO y Meta Foundation (tareas 1-7)

- [x] 1. Instalar y configurar `@nuxtjs/seo` (nuxt-og-image, nuxt-site-config, nuxt-simple-robots, nuxt-simple-sitemap, nuxt-schema-org, nuxt-seo-utils, nuxt-link-checker) via `bun add -D @nuxtjs/seo` y añadir a `modules` en `nuxt.config.ts`
- [x] 2. Configurar `nuxt.config.ts` con `site.url`, `site.name`, `site.description` y `site.defaultLocale` para que todos los módulos SEO hereden la configuración base
- [x] 3. Añadir `useSeoMeta()` en todas las páginas (`index.vue`, `[...slug].vue`, `blog/index.vue`, `blog/[slug].vue`) usando los campos `title`, `description`, `og:image` del frontmatter de cada contenido
- [x] 4. Configurar `nuxt-simple-robots` para permitir indexación de páginas y blog, bloquear `/admin/`, `/api/` y assets — crear `public/robots.txt` como fallback y verificar que los meta robots se inyectan correctamente
- [ ] 5. Configurar `nuxt-simple-sitemap` para generar sitemap.xml dinámico — query todas las páginas y posts de Nuxt Content e inyectarlas como URLs adicionales en el sitemap
- [ ] 6. Añadir structured data (JSON-LD) con `useSchemaOrg()`: Organization para la home, LocalBusiness en contacto, Article en posts del blog, BreadcrumbList en todas las páginas
- [ ] 7. Implementar Open Graph images dinámicas con `nuxt-og-image` — crear plantilla `components/OgImage/Main.vue` que renderice título + descripción + logo sobre fondo con colores CIMA20

## Milestone 2: Blog Avanzado y Contenido Profesional (tareas 8-14)

- [ ] 8. Añadir campos `category` y `tags` al schema de la colección `posts` en `content.config.ts` — actualizar frontmatter de los 4 posts existentes con categorías reales (prevención, seguridad, salud, legislación)
- [ ] 9. Implementar paginación en `pages/blog/index.vue` — query posts con `queryCollection('posts')`, calcular totalPages, y navegar con query param `?page=N` mostrando 6 posts por página
- [ ] 10. Crear `pages/blog/categoria/[slug].vue` — página dinámica que filtra posts por `category` usando `.where('category', '=', slug)` y los muestra en grid con breadcrumb
- [ ] 11. Crear `pages/blog/tag/[slug].vue` — página dinámica que filtra posts por tag (usando `.where()` con array contains si Nuxt Content lo soporta, o filtrado client-side)
- [ ] 12. Añadir sidebar de blog con widget de categorías (con count), widget de tags como nube, y widget de posts recientes — componente `components/blog/BlogSidebar.vue`
- [ ] 13. Mejorar layout del post individual `blog/[slug].vue` — añadir hero con imagen destacada, fecha formateada, autor, breadcrumbs, contenido con tipografía profesional, artículos relacionados al final (misma categoría)
- [ ] 14. Crear 4 posts adicionales de ejemplo con contenido realista sobre servicios CIMA20 (reconocimientos médicos, unidades móviles, análisis legionella, formación PRL) para demostrar paginación y categorías

## Milestone 3: Panel Admin Funcional (tareas 15-21)

- [ ] 15. Crear layout dedicado `layouts/admin.vue` con sidebar de navegación (Dashboard, Páginas, Posts, Config, Blog Categories) usando Nuxt UI `UNavigationMenu` y proteger la ruta `/admin` con middleware de autenticación básica (password simple en runtimeConfig)
- [ ] 16. Implementar listado CRUD de páginas en `pages/admin/pages.vue` — usar server API `server/api/admin/pages.get.ts` que lee todos los .md del sitio, tabla con UTable, botones de editar/eliminar que navegan al editor
- [ ] 17. Crear editor de páginas `pages/admin/pages/[slug].vue` — formulario con UForm: título, descripción, navOrder, hero toggle, textarea para markdown con preview en vivo, y endpoint `server/api/admin/pages.put.ts` que escribe el archivo .md con `fs.writeFile`
- [ ] 18. Implementar listado CRUD de posts en `pages/admin/posts.vue` — tabla con UTable mostrando título, fecha, categoría, tags, botones editar/eliminar, botón crear nuevo post
- [ ] 19. Crear editor de posts `pages/admin/posts/[slug].vue` — formulario con campos: título, descripción, fecha (UDatePicker), categoría (select), tags (multi-select con UInputMenu), imagen destacada, textarea markdown con preview
- [ ] 20. Crear endpoints server API para CRUD de posts: `server/api/admin/posts.get.ts`, `.post.ts` (crear), `.put.ts` (editar), `.delete.ts` (eliminar) — leer/escribir archivos .md en `content/sites/cima/posts/`
- [ ] 21. Crear página de configuración del sitio `pages/admin/config.vue` — formulario editable con nombre, tagline, colores, navegación (array dinámico con UFieldArray de Nuxt UI), footer — guarda en `content/sites/cima/config.yml`

## Milestone 4: Formulario, Performance y Accesibilidad (tareas 22-28)

- [ ] 22. Implementar envío real de email en `server/api/contact.post.ts` con nodemailer usando las cred vars del runtimeConfig — validar campos, sanitizar input, enviar email HTML formateado con los datos del formulario, y devolver respuesta JSON success/error
- [ ] 23. Añadir feedback visual al formulario de contacto — UToast de Nuxt UI para confirmación de envío, estados de loading en botón, validación client-side con feedback inline, honeypot anti-spam
- [ ] 24. Configurar lazy loading y code splitting — usar `defineAsyncComponent` para componentes pesados, `Lazy` prefix en componentes, verificar que Nuxt hace code splitting automático por ruta, y añadir `loading.vue` en páginas pesadas
- [ ] 25. Optimizar imágenes y assets — verificar que `@nuxt/image` usa `NuxtImg` en todas las imágenes del content, configurar formatos webp/avif, añadir placeholder blur para imágenes hero, preload del logo en `<head>`
- [ ] 26. Auditoría de accesibilidad WCAG AA — añadir `alt` text a todas las imágenes, labels en todos los formularios, atributos `aria-label` en nav y botones, skip-to-content link, roles semánticos (`<main>`, `<nav>`, `<article>`, `<footer>`), verificar contraste de colores con Lighthouse
- [ ] 27. Añadir foco visible y navegación por teclado — estilos `:focus-visible` en todos los interactivos, orden de tabulación lógico, manejo de focus en modales/diálogos del admin, trap focus en menú móvil
- [ ] 28. Crear tests básicos de rutas con Vitest — instalar `vitest` + `@vue/test-utils` + `nuxt-vitest` via bun, escribir tests para: homepage renderiza, `/servicios/seguridad` devuelve 200, `/blog` lista posts, `/contacto` muestra formulario, `/admin` redirige sin auth, 404 en ruta inexistente

## Milestone 5: Deploy Production-Ready y Pulido Final (tareas 29-35)

- [ ] 29. Configurar DNS en el dominio cima20.com — apuntar registro A del VPS, configurar CNAME www, verificar propagación con `dig cima20.com`
- [ ] 30. Ajustar labels Traefik en `docker-compose.yml` para dominio real — cambiar `Host(cima20paas.cima20.com)` a `Host(www.cima20.com,cima20.com)`, verificar certbot Let's Encrypt genera certificado SSL automáticamente
- [ ] 31. Configurar headers de seguridad en Nitro — añadir headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=()`, y Content-Security-Policy básica
- [ ] 32. Implementar sistema de temas funcional — crear `components/themes/cima/` con overrides de header/footer/hero específicos para CIMA20, `composables/useThemeComponent.ts` que resuelva componentes del tema activo, y tema `default` como fallback
- [ ] 33. Añadir página 404 custom con diseño CIMA20 — crear `error.vue` en raíz con layout CIMA, mensaje descriptivo, enlace a home y a servicios principales, buscador de contenido
- [ ] 34. Verificar todo el flujo end-to-end en producción — deploy con `docker compose up -d --build`, testear: todas las rutas responden 200, blog con paginación funciona, formulario envía email, admin edita contenido, SSL activo, sitemap accesible en /sitemap.xml, Lighthouse score > 80 en las 4 categorías
- [ ] 35. Documentar el proyecto — actualizar README.md con: arquitectura, comandos, variables de entorno, guía de deploy, estructura de contenido, y actualizar el skill `cima-wp-cms` con las decisiones tomadas y pitfalls descubiertos durante el desarrollo

---

## Decisiones tomadas
- (vacio al inicio)

## Skills generados durante el loop
- (vacio al inicio)
