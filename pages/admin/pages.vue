<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { siteId } = useSite()

// Query all pages for this site
const { data: pages, refresh } = await useAsyncData(`admin-pages-${siteId.value}`, () => {
  return queryCollection('pages')
    .where('site', '=', siteId.value)
    .order('path', 'ASC')
    .all()
})

// Delete handler
async function handleDelete(path: string) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta página?')) return

  try {
    await $fetch('/api/admin/pages', {
      method: 'DELETE',
      body: { path },
    })
    await refresh()
  } catch (e: any) {
    alert('Error al eliminar: ' + (e.data?.message || e.message))
  }
}

useSeoMeta({
  title: 'Admin - Páginas',
  description: 'Gestionar páginas',
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Páginas</h1>
      <NuxtLink to="/admin/pages/create" class="inline-flex items-center gap-2">
        <UButton icon="i-heroicons-plus" size="sm">Nueva página</UButton>
      </NuxtLink>
    </div>

    <div v-if="pages?.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <table class="w-full">
        <thead class="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Título</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Path</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Orden</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <tr v-for="page in pages" :key="page.path" class="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
            <td class="px-4 py-3">
              <NuxtLink :to="`/admin/pages/edit?path=${encodeURIComponent(page.path)}`" class="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary transition-colors">
                {{ page.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ page.path }}</td>
            <td class="px-4 py-3 text-sm text-neutral-500">{{ page.navOrder ?? '—' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="page.path" target="_blank" class="text-sm text-primary hover:underline">
                  Ver
                </NuxtLink>
                <NuxtLink :to="`/admin/pages/edit?path=${encodeURIComponent(page.path)}`" class="text-sm text-primary hover:underline">
                  Editar
                </NuxtLink>
                <button
                  class="text-sm text-red-500 hover:underline"
                  @click="handleDelete(page.path)"
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
      <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-neutral-300 mx-auto mb-3" />
      <p class="text-neutral-500">No hay páginas disponibles.</p>
    </div>
  </div>
</template>
