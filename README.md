# CIMA20 PaaS

CMS estilo WordPress multi-sitio construido con Nuxt 3 + Nuxt Content v3 + Nuxt UI v3.

## Deploy en Render

### Opción 1: Dashboard Web (Recomendado)

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Conecta el repo GitHub: `mateuor2d2/cima20paas`
4. Configura:
   - **Name**: `cima20paas`
   - **Runtime**: Node
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `node .output/server/index.mjs`
   - **Plan**: Starter ($7/month)
5. Añade Environment Variables:
   - `NODE_ENV=production`
   - `NUXT_PUBLIC_SITE_URL=https://cima20paas.onrender.com`
6. Click **Create Web Service**

### Opción 2: Blueprint (render.yaml)

El archivo `render.yaml` está incluido en el repo. Render lo detectará automáticamente al conectar el repo.

### Opción 3: CLI

```bash
# Instalar Render CLI
curl -fsSL https://raw.githubusercontent.com/render-oss/render-cli/main/install.sh | bash

# Deploy
render deploy --service cima20paas
```

## Estructura del Proyecto

```
cima-wp-cms/
  content/
    sites/
      cima/           # Contenido de cima20.com
        pages/        # Páginas estáticas
        posts/        # Blog posts
        config.yml    # Config del sitio
  pages/
    index.vue         # Homepage
    [...slug].vue     # Páginas dinámicas
  layouts/
    default.vue       # Layout con navegación
```

## Comandos

```bash
# Desarrollo
bun run dev

# Build
bun run build

# Preview
bun run preview
```

## Stack

- **Nuxt 4.4.4** - Framework Vue
- **Nuxt Content 3.13.0** - CMS Markdown
- **Nuxt UI 4.7.1** - Componentes UI
- **Vue 3.5.33** - Framework UI
- **Tailwind CSS** - Estilos
- **Bun** - Package manager

## Características

- ✅ Multi-site por hostname
- ✅ Contenido en Markdown
- ✅ Navegación dinámica
- ✅ SEO meta por página
- ✅ Dark mode
- ✅ Responsive design
