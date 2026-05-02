<script setup>
const { siteId } = useSite()
const route = useRoute()
const slug = String(route.params.slug)

// Query all posts, then filter by tag client-side (Nuxt Content v3 doesn't support array-contains)
const { data: allPosts } = await useAsyncData(`posts-tag-${slug}-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .all()
})

const posts = computed(() => {
  if (!allPosts.value) return []
  return allPosts.value.filter(post => post.tags?.includes(slug))
})

if (!posts.value.length) {
  throw createError({ statusCode: 404, statusMessage: 'Tag no encontrado' })
}

useSeoMeta({
  title: `Tag: ${slug} | Blog | PROJECTES TÈCNICS SL`,
  description: `Artículos etiquetados con "${slug}"`
})

defineOgImage({
  title: `Tag: ${slug}`,
  description: `Artículos etiquetados con "${slug}"`,
})

useCimaBreadcrumbs([
  { name: 'Inicio', to: '/' },
  { name: 'Blog', to: '/blog' },
  { name: `Tag: ${slug}`, to: `/blog/tag/${slug}` }
])
</script>

<template>
  <div>
    <UContainer class="py-12">
      <nav class="text-sm text-neutral-500 mb-6">
        <NuxtLink to="/blog" class="hover:text-primary transition-colors">← Volver al blog</NuxtLink>
      </nav>

      <h1 class="text-4xl font-bold mb-4">Tag: {{ slug }}</h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-12">
        {{ posts.length }} artículo{{ posts.length !== 1 ? 's' : '' }} con esta etiqueta.
      </p>

      <div v-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in posts"
          :key="post.path"
          class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
              <span v-if="post.category" class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                {{ post.category }}
              </span>
              <span>{{ new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            </div>

            <h2 class="text-xl font-semibold mb-3 line-clamp-2">
              <NuxtLink :to="post.path" class="hover:text-primary transition-colors">
                {{ post.title }}
              </NuxtLink>
            </h2>

            <p v-if="post.description" class="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3">
              {{ post.description }}
            </p>
          </div>
        </article>
      </div>
    </UContainer>
  </div>
</template>
