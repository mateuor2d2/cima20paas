<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const { siteId } = useSite()

// The slug param contains the full path from the catch-all route
// e.g., /admin/pages/edit/sites/cima/pages/servicios/seguridad
const fullPath = computed(() => {
  const slugParam = route.params.slug
  if (Array.isArray(slugParam)) {
    return slugParam.join('/')
  }
  return slugParam || ''
})

const isNewPage = computed(() => fullPath.value === 'create' || fullPath.value === '')

// Load existing page data if editing
const { data: existingPage } = await useAsyncData(`admin-edit-page-${fullPath.value}`, async () => {
  if (isNewPage.value) return null
  return queryCollection('pages').path(`/${fullPath.value}`).first()
}, { watch: [fullPath] })

// Form state
const form = ref({
  title: existingPage.value?.title || '',
  description: existingPage.value?.description || '',
  navOrder: existingPage.value?.navOrder ?? undefined as number | undefined,
  hero: existingPage.value?.hero || false,
  body: '',
})

// Load body content from file
const bodyLoaded = ref(false)
onMounted(async () => {
  if (!isNewPage.value && existingPage.value) {
    try {
      const content = existingPage.value.body
      if (content) {
        form.value.body = content
      }
    } catch (e) {
      // body may not be available directly
    }
  }
  bodyLoaded.value = true
})

const saving = ref(false)
const message = ref('')
const showPreview = ref(false)

// Determine file path for saving
function getSavePath(): string {
  if (isNewPage.value) {
    // Use title as slug for new pages
    return form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñç\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  // For existing pages, extract the relative path
  // fullPath is like "sites/cima/pages/servicios/seguridad"
  const parts = fullPath.value.split('/')
  const pagesIdx = parts.indexOf('pages')
  if (pagesIdx >= 0) {
    return parts.slice(pagesIdx + 1).join('/')
  }
  return fullPath.value
}

async function savePage() {
  if (!form.value.title) {
    message.value = 'Error: El título es obligatorio'
    return
  }

  saving.value = true
  message.value = ''

  try {
    const savePath = getSavePath()
    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        path: savePath,
        title: form.value.title,
        description: form.value.description,
        site: siteId.value,
        navOrder: form.value.navOrder,
        hero: form.value.hero,
        body: form.value.body,
      },
    })
    message.value = 'Página guardada correctamente'
    if (isNewPage.value) {
      router.push('/admin/pages')
    }
  } catch (e: any) {
    message.value = 'Error: ' + (e.data?.message || e.message)
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: isNewPage.value ? 'Admin - Nueva página' : `Admin - Editar: ${existingPage.value?.title || ''}`,
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/pages" class="text-neutral-500 hover:text-primary transition-colors">
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">
        {{ isNewPage ? 'Nueva página' : `Editar: ${existingPage?.title || ''}` }}
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Editor -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Título *</label>
            <UInput v-model="form.title" placeholder="Título de la página" size="lg" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <UTextarea v-model="form.description" placeholder="Descripción breve para SEO" :rows="2" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Orden de navegación</label>
              <UInput v-model.number="form.navOrder" type="number" placeholder="0" />
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.hero" type="checkbox" class="rounded border-neutral-300 text-primary focus:ring-primary" />
                <span class="text-sm">Mostrar hero</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Markdown editor -->
        <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
            <label class="text-sm font-medium">Contenido (Markdown)</label>
            <div class="flex items-center gap-2">
              <button
                :class="['text-xs px-2 py-1 rounded', !showPreview ? 'bg-primary text-white' : 'text-neutral-500 hover:text-primary']"
                @click="showPreview = false"
              >
                Editor
              </button>
              <button
                :class="['text-xs px-2 py-1 rounded', showPreview ? 'bg-primary text-white' : 'text-neutral-500 hover:text-primary']"
                @click="showPreview = true"
              >
                Preview
              </button>
            </div>
          </div>
          <div v-if="!showPreview" class="p-0">
            <textarea
              v-model="form.body"
              class="w-full h-96 p-4 bg-transparent text-sm font-mono resize-y focus:outline-none"
              placeholder="Escribe el contenido en Markdown..."
            />
          </div>
          <div v-else class="p-4 prose dark:prose-invert max-w-none">
            <div v-if="form.body" v-html="renderMarkdown(form.body)" />
            <p v-else class="text-neutral-400 text-sm">No hay contenido para previsualizar</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <UButton size="lg" :loading="saving" @click="savePage">
            {{ isNewPage ? 'Crear página' : 'Guardar cambios' }}
          </UButton>
          <NuxtLink to="/admin/pages" class="text-sm text-neutral-500 hover:text-primary">
            Cancelar
          </NuxtLink>
          <p v-if="message" :class="message.startsWith('Error') ? 'text-red-500' : 'text-green-600'" class="text-sm">
            {{ message }}
          </p>
        </div>
      </div>

      <!-- Metadata panel -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 class="text-sm font-semibold mb-3">Información</h3>
          <dl class="space-y-2 text-sm">
            <div v-if="!isNewPage && existingPage">
              <dt class="text-neutral-500">Path</dt>
              <dd class="font-mono">{{ existingPage.path }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">Sitio</dt>
              <dd>{{ siteId }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4 text-sm">
          <p class="font-medium text-amber-800 dark:text-amber-200 mb-1">💡 Tips</p>
          <ul class="text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
            <li>Usa Markdown estándar para el contenido</li>
            <li>El título se usa para el SEO y breadcrumbs</li>
            <li>El orden de navegación controla la posición en el menú</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
