<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const sections = [
  { title: 'Páginas', description: 'Gestionar contenido de páginas', to: '/admin/pages', icon: 'i-heroicons-document-text' },
  { title: 'Blog Posts', description: 'Gestionar artículos del blog', to: '/admin/posts', icon: 'i-heroicons-newspaper' },
  { title: 'Configuración', description: 'Configuración del sitio', to: '/admin/config', icon: 'i-heroicons-cog-6-tooth' },
]

const stats = ref([
  { label: 'Páginas', value: '...', icon: 'i-heroicons-document-text' },
  { label: 'Posts', value: '...', icon: 'i-heroicons-newspaper' },
])

const { siteId } = useSite()

// Get counts
const { data: pagesCount } = await useAsyncData('admin-pages-count', () => {
  return queryCollection('pages').where('site', '=', siteId.value).count()
})

const { data: postsCount } = await useAsyncData('admin-posts-count', () => {
  return queryCollection('posts').where('site', '=', siteId.value).count()
})

stats.value = [
  { label: 'Páginas', value: String(pagesCount.value || 0), icon: 'i-heroicons-document-text' },
  { label: 'Posts', value: String(postsCount.value || 0), icon: 'i-heroicons-newspaper' },
]

useSeoMeta({
  title: 'Admin - Dashboard',
  description: 'Panel de administración CIMA20',
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6"
      >
        <div class="flex items-center gap-3">
          <UIcon :name="stat.icon" class="w-8 h-8 text-primary" />
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm text-neutral-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <h2 class="text-lg font-semibold mb-4">Secciones</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="section in sections"
        :key="section.title"
        :to="section.to"
        class="block p-5 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary transition-colors"
      >
        <div class="flex items-center gap-3 mb-2">
          <UIcon :name="section.icon" class="w-5 h-5 text-primary" />
          <h3 class="font-semibold">{{ section.title }}</h3>
        </div>
        <p class="text-sm text-neutral-500">{{ section.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
