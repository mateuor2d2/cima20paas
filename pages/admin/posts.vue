<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { siteId } = useSite()

// Query all posts
const { data: posts, refresh } = await useAsyncData(`admin-posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .all()
})

// Delete handler
async function handleDelete(path: string) {
  if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return

  try {
    await $fetch('/api/admin/posts', {
      method: 'DELETE',
      body: { path },
    })
    await refresh()
  } catch (e: any) {
    alert('Error al eliminar: ' + (e.data?.message || e.message))
  }
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

useSeoMeta({
  title: 'Admin - Blog Posts',
  description: 'Gestionar artículos',
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Blog Posts</h1>
      <NuxtLink to="/admin/posts/create" class="inline-flex items-center gap-2">
        <UButton icon="i-heroicons-plus" size="sm">Nuevo post</UButton>
      </NuxtLink>
    </div>

    <div v-if="posts?.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <table class="w-full">
        <thead class="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Título</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categoría</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fecha</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Autor</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr v-for="post in posts" :key="post.path" class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
            <td class="px-4 py-3">
              <NuxtLink :to="`/admin/posts/edit${post.path}`" class="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary transition-colors">
                {{ post.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3">
              <span v-if="post.category" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {{ post.category }}
              </span>
              <span v-else class="text-neutral-400 text-sm">—</span>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ formatDate(post.date) }}</td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ post.author || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="post.path" target="_blank" class="text-sm text-primary hover:underline">
                  Ver
                </NuxtLink>
                <NuxtLink :to="`/admin/posts/edit${post.path}`" class="text-sm text-primary hover:underline">
                  Editar
                </NuxtLink>
                <button
                  class="text-sm text-red-500 hover:underline"
                  @click="handleDelete(post.path)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <UIcon name="i-heroicons-newspaper" class="w-12 h-12 text-neutral-300 mx-auto mb-3" />
      <p class="text-neutral-500">No hay posts disponibles.</p>
    </div>
  </div>
</template>
