<script setup lang="ts">
const { siteId } = useSite()
const route = useRoute()

// Fetch all posts for computing categories, tags, and recent posts
const { data: allPosts } = await useAsyncData(`sidebar-posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .all()
})

// Categories with counts
const categories = computed(() => {
  if (!allPosts.value) return []
  const cats = new Map()
  allPosts.value.forEach(post => {
    if (post.category) {
      cats.set(post.category, (cats.get(post.category) || 0) + 1)
    }
  })
  return Array.from(cats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// Tags with counts (for cloud)
const tags = computed(() => {
  if (!allPosts.value) return []
  const tagMap = new Map()
  allPosts.value.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    }
  })
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// Tag cloud sizes based on count
function tagSize(count: number) {
  const max = Math.max(...tags.value.map(t => t.count), 1)
  const ratio = count / max
  if (ratio > 0.7) return 'text-base font-semibold'
  if (ratio > 0.4) return 'text-sm font-medium'
  return 'text-xs'
}

// Recent posts (latest 5)
const recentPosts = computed(() => {
  if (!allPosts.value) return []
  return allPosts.value.slice(0, 5)
})

// Current category for active state
const currentCategory = computed(() => {
  if (route.path.startsWith('/blog/categoria/')) {
    return route.params.slug
  }
  return null
})

// Current tag for active state
const currentTag = computed(() => {
  if (route.path.startsWith('/blog/tag/')) {
    return route.params.slug
  }
  return null
})
</script>

<template>
  <aside class="space-y-8">
    <!-- Search (future placeholder) -->

    <!-- Categories Widget -->
    <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
        Categorías
      </h3>
      <ul class="space-y-2">
        <li>
          <NuxtLink
            to="/blog"
            class="flex items-center justify-between text-sm py-1.5 px-2 rounded-md transition-colors"
            :class="!currentCategory
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
          >
            <span>Todas</span>
            <span class="text-xs text-neutral-400 dark:text-neutral-500">{{ allPosts?.length || 0 }}</span>
          </NuxtLink>
        </li>
        <li v-for="cat in categories" :key="cat.name">
          <NuxtLink
            :to="`/blog/categoria/${cat.name}`"
            class="flex items-center justify-between text-sm py-1.5 px-2 rounded-md transition-colors"
            :class="currentCategory === cat.name
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
          >
            <span>{{ cat.name }}</span>
            <span class="text-xs text-neutral-400 dark:text-neutral-500">{{ cat.count }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Tags Cloud Widget -->
    <div v-if="tags.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
        Etiquetas
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in tags"
          :key="tag.name"
          :to="`/blog/tag/${tag.name}`"
          class="inline-block px-2.5 py-1 rounded-full border transition-colors"
          :class="[
            currentTag === tag.name
              ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
              : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
            tagSize(tag.count)
          ]"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Posts Widget -->
    <div v-if="recentPosts.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
        Últimos artículos
      </h3>
      <ul class="space-y-3">
        <li v-for="post in recentPosts" :key="post.path">
          <NuxtLink
            :to="post.path"
            class="block group"
          >
            <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {{ post.title }}
            </span>
            <span class="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">
              {{ new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
