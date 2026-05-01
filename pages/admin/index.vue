
<script setup>
// Simple admin dashboard placeholder
// In production, this should be protected with authentication

definePageMeta({
  layout: 'default'
})

const sections = [
  { title: 'Páginas', description: 'Gestionar contenido de páginas', to: '/admin/pages', icon: 'i-heroicons-document-text' },
  { title: 'Blog', description: 'Gestionar artículos del blog', to: '/admin/posts', icon: 'i-heroicons-newspaper' },
  { title: 'Configuración', description: 'Configuración del sitio', to: '/admin/config', icon: 'i-heroicons-cog-6-tooth' },
  { title: 'Media', description: 'Gestionar imágenes y archivos', to: '/admin/media', icon: 'i-heroicons-photo' }
]
</script>

<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="section in sections"
          :key="section.title"
          :to="section.to"
          class="block p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary dark:hover:border-primary transition-colors"
        >
          <div class="flex items-center gap-3 mb-3">
            <UIcon :name="section.icon" class="w-6 h-6 text-primary" />
            <h2 class="text-lg font-semibold">{{ section.title }}</h2>
          </div>
          <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ section.description }}</p>
        </NuxtLink>
      </div>
    </UContainer>
  </div>
</template>
