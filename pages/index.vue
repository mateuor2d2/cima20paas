<script setup>
const { siteId } = useSite()

// In Nuxt Content v3, the path includes the source directory structure
// pages are stored as sites/:siteId/pages/:slug.md
const contentPath = computed(() => {
  return `/sites/${siteId.value}/pages/index`
})

// Query the homepage content from Nuxt Content
const { data: page } = await useAsyncData(`homepage-${siteId.value}`, () => {
  return queryCollection('pages').path(contentPath.value).first()
})

// Query site config
const { data: siteConfig } = await useAsyncData(`config-${siteId.value}`, () => {
  return queryCollection('site_config').path(`/sites/${siteId.value}/config`).first()
})

// Set SEO meta from content or defaults
useSeoMeta({
  title: page.value?.title || 'PROJECTES TÈCNICS SL',
  description: page.value?.description || 'Seguridad, Prevención, Medio Ambiente y Calidad'
})

// Structured data: Organization schema on homepage
useCimaOrganization()
useCimaBreadcrumbs([
  { name: 'Inicio', to: '/' }
])
</script>

<template>
  <div>
    <UContainer class="py-12">
      <!-- Hero section -->
      <div v-if="page?.hero" class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
          {{ page.title }}
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          {{ page.description }}
        </p>
      </div>

      <!-- Regular title (non-hero) -->
      <div v-else class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ page?.title || 'PROJECTES TÈCNICS SL' }}</h1>
        <p v-if="page?.description" class="text-lg text-neutral-600 dark:text-neutral-400">
          {{ page.description }}
        </p>
      </div>

      <!-- Content rendered from Markdown -->
      <div v-if="page?.body" class="prose dark:prose-invert max-w-none">
        <ContentRenderer :value="page" />
      </div>

      <!-- Fallback if no content found -->
      <div v-else class="prose dark:prose-invert max-w-none">
        <h2>Bienvenidos a PROJECTES TÈCNICS SL</h2>
        <p>Somos una empresa especializada en <strong>Seguridad</strong>, <strong>Prevención de Riesgos Laborales</strong>, <strong>Medio Ambiente</strong> y <strong>Calidad</strong>.</p>
        <p><a href="/contacto">Contáctanos</a> para más información.</p>
      </div>
    </UContainer>
  </div>
</template>
