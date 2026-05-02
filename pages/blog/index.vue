
<script setup>
const { siteId } = useSite()

// Query all posts
const { data: posts } = await useAsyncData(`posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .order('date', 'DESC')
    .all()
})

useSeoMeta({
  title: 'Blog | PROJECTES TÈCNICS SL',
  description: 'Noticias y artículos sobre prevención de riesgos laborales y salud ocupacional'
})

// Dynamic OG Image for blog listing
defineOgImage({
  title: 'Blog | PROJECTES TÈCNICS SL',
  description: 'Noticias y artículos sobre prevención de riesgos laborales y salud ocupacional',
})

// Structured data: Breadcrumbs for blog
useCimaBreadcrumbs([
  { name: 'Inicio', to: '/' },
  { name: 'Blog', to: '/blog' }
])
</script>

<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-4xl font-bold mb-4">Actualidad</h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-12">
        Noticias, artículos y novedades sobre prevención de riesgos laborales y salud ocupacional.
      </p>

      <div v-if="posts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in posts"
          :key="post.path"
          class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
              <span>{{ new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
              <span v-if="post.author">· {{ post.author }}</span>
            </div>
            
            <h2 class="text-xl font-semibold mb-3 line-clamp-2">
              <NuxtLink :to="post.path" class="hover:text-primary transition-colors">
                {{ post.title }}
              </NuxtLink>
            </h2>
            
            <p v-if="post.description" class="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4">
              {{ post.description }}
            </p>
            
            <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-neutral-500">No hay artículos disponibles.</p>
      </div>
    </UContainer>
  </div>
</template>
