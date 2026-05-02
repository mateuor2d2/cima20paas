<script setup>
const { siteId } = useSite()
const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`post-${siteId.value}-${slug}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .where('path', 'LIKE', `%${slug}%`)
    .first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post Not Found' })
}

// Fetch related posts (same category, excluding current)
const { data: relatedPosts } = await useAsyncData(`related-${siteId.value}-${slug}`, () => {
  if (!post.value?.category) return Promise.resolve([])
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .where('category', '=', post.value.category)
    .all()
})

const filteredRelated = computed(() => {
  if (!relatedPosts.value) return []
  return relatedPosts.value
    .filter(p => p.path !== post.value?.path)
    .slice(0, 3)
})

// Format date nicely
const formattedDate = computed(() => {
  if (!post.value?.date) return ''
  return new Date(post.value.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

useSeoMeta({
  title: post.value?.title || 'Blog | PROJECTES TÈCNICS SL',
  description: post.value?.description || 'Noticias y artículos sobre prevención de riesgos laborales y salud ocupacional'
})

// Dynamic OG Image for blog post
if (post.value) {
  defineOgImage({
    title: post.value.title || 'Blog',
    description: post.value.description || '',
  })
}

// Structured data: Article schema on blog posts
if (post.value) {
  useCimaArticle(
    post.value.title || '',
    post.value.description || '',
    post.value.date || new Date().toISOString(),
    post.value.author,
    post.value.image
  )
  useCimaBreadcrumbs([
    { name: 'Inicio', to: '/' },
    { name: 'Blog', to: '/blog' },
    { name: post.value.title || slug, to: `/blog/${slug}` }
  ])
}
</script>

<template>
  <div v-if="post">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <UContainer class="py-12 md:py-16 max-w-4xl">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6" aria-label="Breadcrumb">
          <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink to="/blog" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</NuxtLink>
          <span v-if="post.category">/</span>
          <NuxtLink
            v-if="post.category"
            :to="`/blog/categoria/${post.category}`"
            class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {{ post.category }}
          </NuxtLink>
        </nav>

        <!-- Category Badge -->
        <div v-if="post.category" class="mb-4">
          <NuxtLink
            :to="`/blog/categoria/${post.category}`"
            class="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {{ post.category }}
          </NuxtLink>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-tight mb-6">
          {{ post.title }}
        </h1>

        <!-- Description -->
        <p v-if="post.description" class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-6">
          {{ post.description }}
        </p>

        <!-- Meta: date, author -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            <time :datetime="post.date">{{ formattedDate }}</time>
          </div>
          <div v-if="post.author" class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="w-4 h-4" />
            <span>{{ post.author }}</span>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-5">
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag"
            :to="`/blog/tag/${tag}`"
            class="px-3 py-1 text-xs rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <!-- Featured Image -->
    <UContainer v-if="post.image" class="max-w-4xl pt-8">
      <NuxtImg
        :src="post.image"
        :alt="post.title"
        width="896"
        height="504"
        format="webp"
        quality="80"
        loading="eager"
        class="w-full rounded-xl shadow-lg"
      />
    </UContainer>

    <!-- Article Content -->
    <UContainer class="py-10 md:py-14 max-w-3xl">
      <article class="prose prose-lg prose-neutral dark:prose-invert max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-md
        prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-800">
        <ContentRenderer :value="post" />
      </article>
    </UContainer>

    <!-- Related Posts -->
    <div v-if="filteredRelated.length" class="bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
      <UContainer class="py-12 max-w-4xl">
        <h2 class="text-2xl font-bold mb-8">Artículos relacionados</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in filteredRelated"
            :key="related.path"
            :to="related.path"
            class="group bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              <span v-if="related.category" class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {{ related.category }}
              </span>
              <span>{{ new Date(related.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
            </div>
            <h3 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {{ related.title }}
            </h3>
            <p v-if="related.description" class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2">
              {{ related.description }}
            </p>
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <!-- Back to Blog -->
    <UContainer class="py-8">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Volver al blog
      </NuxtLink>
    </UContainer>
  </div>
</template>
