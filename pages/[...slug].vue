
<script setup>
const route = useRoute()
const { siteId } = useSite()

// Handle catch-all slug (e.g., servicios/seguridad)
const slugPath = computed(() => {
  if (Array.isArray(route.params.slug)) {
    return route.params.slug.join('/')
  }
  return route.params.slug
})

// In Nuxt Content v3, the path includes the source directory structure
const contentPath = computed(() => {
  return `/sites/${siteId.value}/pages/${slugPath.value}`
})

// Query the page content from Nuxt Content by path
const { data: page } = await useAsyncData(`page-${siteId.value}-${slugPath.value}`, () => {
  return queryCollection('pages').path(contentPath.value).first()
})

// Set SEO meta
useSeoMeta({
  title: page.value?.title || slugPath.value,
  description: page.value?.description || ''
})

// Dynamic OG Image
defineOgImage({
  title: page.value?.title || slugPath.value,
  description: page.value?.description || '',
})

// Structured data: Breadcrumbs for all content pages
const breadcrumbItems = computed(() => {
  const items = [{ name: 'Inicio', to: '/' }]
  if (slugPath.value.includes('/')) {
    const parts = slugPath.value.split('/')
    items.push({ name: parts[0].charAt(0).toUpperCase() + parts[0].slice(1), to: `/${parts[0]}` })
  }
  items.push({ name: page.value?.title || slugPath.value, to: `/${slugPath.value}` })
  return items
})
useCimaBreadcrumbs(breadcrumbItems.value)

// If page not found, show 404
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada' })
}
</script>

<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-4xl font-bold mb-4">{{ page?.title || slugPath }}</h1>
      <p v-if="page?.description" class="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
        {{ page.description }}
      </p>

      <div v-if="page?.body" class="prose dark:prose-invert max-w-none">
        <ContentRenderer :value="page" />
      </div>
    </UContainer>
  </div>
</template>
