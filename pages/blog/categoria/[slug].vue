<script setup>
const { siteId } = useSite()
const route = useRoute()
const slug = String(route.params.slug)

// Query all posts in this category
const { data: posts } = await useAsyncData(`posts-cat-${slug}-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .where('category', '=', slug)
    .order('date', 'DESC')
    .all()
})

if (!posts.value?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada' })
}

const categoryName = computed(() => {
  return slug.charAt(0).toUpperCase() + slug.slice(1)
})

useSeoMeta({
  title: `Categoría: ${categoryName.value} | Blog | PROJECTES TÈCNICS SL`,
  description: `Artículos en la categoría ${categoryName.value}`
})

defineOgImage({
  title: `Categoría: ${categoryName.value}`,
  description: `Artículos en la categoría ${categoryName.value}`,
})

useCimaBreadcrumbs([
  { name: 'Inicio', to: '/' },
  { name: 'Blog', to: '/blog' },
  { name: categoryName.value, to: `/blog/categoria/${slug}` }
])
</script>

<template>
  <div>
    <UContainer class="py-12">
      <nav class="text-sm text-neutral-500 mb-6">
        <NuxtLink to="/blog" class="hover:text-primary transition-colors">← Volver al blog</NuxtLink>
      </nav>

      <h1 class="text-4xl font-bold mb-4">Categoría: {{ categoryName }}</h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-12">
        {{ posts?.length || 0 }} artículo{{ (posts?.length || 0) !== 1 ? 's' : '' }} en esta categoría.
      </p>

      <div v-if="posts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in posts"
          :key="post.path"
          class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
              <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
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
