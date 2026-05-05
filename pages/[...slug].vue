<script setup>
const route = useRoute()
const { siteId } = useSite()
const { locale } = useI18n()

// Handle catch-all slug (e.g., servicios/seguridad)
// With prefix_except_default strategy, i18n strips the locale prefix from route.params
// So /ca/servicios gives route.params.slug = 'servicios', not 'ca/servicios'
const slugPath = computed(() => {
  let slug = route.params.slug
  if (Array.isArray(slug)) {
    slug = slug.join('/')
  }
  return slug || 'index'
})

// Build content path with locale prefix for non-default locales
const contentPath = computed(() => {
  if (locale.value !== 'es') {
    return `/sites/${siteId.value}/pages/${locale.value}/${slugPath.value}`
  }
  return `/sites/${siteId.value}/pages/${slugPath.value}`
})

const contentPathDefault = computed(() => {
  return `/sites/${siteId.value}/pages/${slugPath.value}`
})

// Query the page content — try locale version first, fallback to default language
const { data: page } = await useAsyncData(`page-${siteId.value}-${locale.value}-${slugPath.value}`, async () => {
  // Try localized content first
  if (locale.value !== 'es') {
    const localized = await queryCollection('pages').path(contentPath.value).first()
    if (localized) return localized
  }
  // Fallback to default language
  return queryCollection('pages').path(contentPathDefault.value).first()
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
      <article>
        <h1 class="text-4xl font-bold mb-4">{{ page?.title || slugPath }}</h1>
        <p v-if="page?.description" class="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
          {{ page.description }}
        </p>

        <div v-if="page?.body" class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </div>
      </article>
    </UContainer>
  </div>
</template>
