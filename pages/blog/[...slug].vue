
<script setup>
const route = useRoute()
const { siteId } = useSite()

const slug = computed(() => {
  if (Array.isArray(route.params.slug)) {
    return route.params.slug.join('/')
  }
  return route.params.slug
})

const contentPath = computed(() => {
  return `/sites/${siteId.value}/posts/${slug.value}`
})

const { data: post } = await useAsyncData(`post-${siteId.value}-${slug.value}`, () => {
  return queryCollection('posts').path(contentPath.value).first()
})

// Get related posts (same tags, excluding current)
const { data: relatedPosts } = await useAsyncData(`related-${siteId.value}-${slug.value}`, async () => {
  if (!post.value?.tags?.length) return []
  return queryCollection('posts')
    .where('path', '<>', contentPath.value)
    .where('tags', 'LIKE', `%${post.value.tags[0]}%`)
    .limit(3)
    .all()
})

useSeoMeta({
  title: post.value?.title || 'Artículo',
  description: post.value?.description || ''
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}
</script>

<template>
  <div v-if="post">
    <UContainer class="py-12">
      <article class="max-w-3xl mx-auto">
        <!-- Header -->
        <header class="mb-8">
          <div class="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <span>{{ new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
            <span v-if="post.author">· {{ post.author }}</span>
          </div>
          
          <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
          
          <p v-if="post.description" class="text-xl text-neutral-600 dark:text-neutral-400">
            {{ post.description }}
          </p>
          
          <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </header>

        <!-- Content -->
        <div class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="post" />
        </div>

        <!-- Back to blog -->
        <div class="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <NuxtLink to="/blog" class="text-primary hover:underline">
            ← Volver al blog
          </NuxtLink>
        </div>

        <!-- Related posts -->
        <div v-if="relatedPosts?.length" class="mt-12">
          <h2 class="text-2xl font-semibold mb-6">Artículos relacionados</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article
              v-for="related in relatedPosts"
              :key="related.path"
              class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
            >
              <NuxtLink :to="related.path" class="hover:text-primary transition-colors">
                <h3 class="font-semibold mb-2">{{ related.title }}</h3>
                <p class="text-sm text-neutral-500">{{ related.description }}</p>
              </NuxtLink>
            </article>
          </div>
        </div>
      </article>
    </UContainer>
  </div>
</template>
