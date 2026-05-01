
<script setup>
const { siteId } = useSite()

// Query all pages
const { data: pages } = await useAsyncData(`admin-pages-${siteId.value}`, () => {
  return queryCollection('pages')
    .order('path', 'ASC')
    .all()
})

useSeoMeta({
  title: 'Admin - Páginas',
  description: 'Gestionar páginas'
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Páginas</h1>
        <NuxtLink to="/admin" class="text-primary hover:underline">
          ← Volver al panel
        </NuxtLink>
      </div>

      <div v-if="pages?.length" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table class="w-full">
          <thead class="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Título</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Path</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
            <tr v-for="page in pages" :key="page.path" class="hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td class="px-4 py-3">
                <NuxtLink :to="page.path" class="font-medium hover:text-primary transition-colors">
                  {{ page.title }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3 text-sm text-neutral-500">{{ page.path }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="page.path" target="_blank" class="text-sm text-primary hover:underline">
                  Ver →
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-neutral-500">No hay páginas disponibles.</p>
      </div>
    </UContainer>
  </div>
</template>
