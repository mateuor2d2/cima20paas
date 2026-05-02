<script setup>
const { siteId } = useSite()
const route = useRoute()

const POSTS_PER_PAGE = 6
const currentPage = computed(() => Number(route.query.page) || 1)

// Query all posts for the current site
const { data: allPosts } = await useAsyncData(`posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .all()
})

// Pagination logic
const totalPosts = computed(() => allPosts.value?.length || 0)
const totalPages = computed(() => Math.ceil(totalPosts.value / POSTS_PER_PAGE))

const posts = computed(() => {
  if (!allPosts.value) return []
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return allPosts.value.slice(start, start + POSTS_PER_PAGE)
})

useSeoMeta({
  title: currentPage.value > 1 ? `Blog (página ${currentPage.value}) | PROJECTES TÈCNICS SL` : 'Blog | PROJECTES TÈCNICS SL',
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

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <div v-if="posts?.length" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article
              v-for="post in posts"
              :key="post.path"
              :aria-label="`Artículo: ${post.title}`"
              class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="p-6">
                <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                  <span v-if="post.category" class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {{ post.category }}
                  </span>
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
                  <NuxtLink
                    v-for="tag in post.tags"
                    :key="tag"
                    :to="`/blog/tag/${tag}`"
                    class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {{ tag }}
                  </NuxtLink>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="text-center py-12">
            <p class="text-neutral-500">No hay artículos disponibles.</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-12">
            <NuxtLink
              v-if="currentPage > 1"
              :to="{ path: '/blog', query: { page: currentPage - 1 } }"
              class="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              ← Anterior
            </NuxtLink>

            <template v-for="p in totalPages" :key="p">
              <NuxtLink
                v-if="totalPages <= 7 || Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages"
                :to="{ path: '/blog', query: p > 1 ? { page: p } : {} }"
                class="w-10 h-10 flex items-center justify-center text-sm rounded-lg border transition-colors"
                :class="p === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
              >
                {{ p }}
              </NuxtLink>
              <span v-else-if="Math.abs(p - currentPage) === 3" class="text-neutral-400">…</span>
            </template>

            <NuxtLink
              v-if="currentPage < totalPages"
              :to="{ path: '/blog', query: { page: currentPage + 1 } }"
              class="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Siguiente →
            </NuxtLink>
          </div>
        </div>

        <!-- Sidebar (lazy loaded) -->
        <div class="lg:w-80 shrink-0">
          <LazyBlogSidebar />
        </div>
      </div>
    </UContainer>
  </div>
</template>
