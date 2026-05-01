
<script setup>
const { siteId } = useSite()

// Query all posts
const { data: posts } = await useAsyncData(`admin-posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .order('date', 'DESC')
    .all()
})

useSeoMeta({
  title: 'Admin - Blog',
  description: 'Gestionar artículos'
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Artículos del Blog</h1>
        <NuxtLink to="/admin" class="text-primary hover:underline">
          ← Volver al panel
        </NuxtLink>
      </div>

      <div v-if="posts?.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table class="w-full">
          <thead class="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Título</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Fecha</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Autor</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
            <tr v-for="post in posts" :key="post.path" class="hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td class="px-4 py-3">
                <NuxtLink :to="post.path" class="font-medium hover:text-primary transition-colors">
                  {{ post.title }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3 text-sm text-neutral-500">
                {{ new Date(post.date).toLocaleDateString('es-ES') }}
              </td>
              <td class="px-4 py-3 text-sm text-neutral-500">{{ post.author }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="post.path" target="_blank" class="text-sm text-primary hover:underline">
                  Ver →
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-neutral-500">No hay artículos disponibles.</p>
      </div>
    </UContainer>
  </div>
</template>
