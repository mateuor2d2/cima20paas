<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const { siteId } = useSite()

// Extract the page path from the query param
const pagePath = computed(() => {
  return (route.query.path as string) || ''
})

const isNewPage = computed(() => !pagePath.value)

// Load existing page data if editing
const { data: existingPage } = await useAsyncData(`admin-edit-page-${pagePath.value}`, async () => {
  if (!pagePath.value) return null
  return queryCollection('pages').path(pagePath.value).first()
})

// Form state
const form = ref({
  title: existingPage.value?.title || '',
  description: existingPage.value?.description || '',
  navOrder: existingPage.value?.navOrder ?? undefined as number | undefined,
  hero: existingPage.value?.hero || false,
  body: '',
})

// Load body content
onMounted(() => {
  if (existingPage.value) {
    // The body field from content query may contain the rendered body
    // We'll try to get it from the raw content
    form.value.body = (existingPage.value as any)?.body || ''
  }
})

const saving = ref(false)
const message = ref('')
const showPreview = ref(false)

// Determine the relative slug for saving (strip the /sites/cima/pages/ prefix)
function getRelativeSlug(): string {
  if (!pagePath.value) {
    // New page: generate slug from title
    return form.value.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  // Extract relative path: /sites/cima/pages/servicios/seguridad -> servicios/seguridad
  const prefix = `/sites/${siteId.value}/pages/`
  if (pagePath.value.startsWith(prefix)) {
    return pagePath.value.slice(prefix.length)
  }
  return pagePath.value
}

async function savePage() {
  if (!form.value.title) {
    message.value = 'Error: El título es obligatorio'
    return
  }

  saving.value = true
  message.value = ''

  try {
    const slug = getRelativeSlug()
    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        path: slug,
        title: form.value.title,
        description: form.value.description,
        site: siteId.value,
        navOrder: form.value.navOrder,
        hero: form.value.hero,
        body: form.value.body,
      },
    })
    message.value = 'Página guardada correctamente'
    setTimeout(() => router.push('/admin/pages'), 1000)
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
              <label class="block text-sm font-medium mb-1">Orden navegación</label>
              <UInput v-model.number="form.navOrder" type="number" placeholder="0" />
            </div>
            <div class="flex items-end pb-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.hero" type="checkbox" class="rounded border-neutral-300 text-primary focus:ring-primary" />
                <span class="text-sm font-medium">Mostrar hero</span>
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
                :class="['text-xs px-2 py-1 rounded transition-colors', !showPreview ? 'bg-primary text-white' : 'text-neutral-500 hover:text-primary']"
                @click="showPreview = false"
              >
                Editor
              </button>
              <button
                :class="['text-xs px-2 py-1 rounded transition-colors', showPreview ? 'bg-primary text-white' : 'text-neutral-500 hover:text-primary']"
                @click="showPreview = true"
              >
                Preview
              </button>
            </div>
          </div>
          <div v-if="!showPreview">
            <textarea
              v-model="form.body"
              class="w-full h-96 p-4 bg-transparent text-sm font-mono resize-y focus:outline-none"
              placeholder="Escribe el contenido en Markdown..."
            />
          </div>
          <div v-else class="p-4 prose dark:prose-invert max-w-none">
            <pre v-if="form.body" class="whitespace-pre-wrap text-sm">{{ form.body }}</pre>
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

      <!-- Right panel -->
      <div class="space-y-4">
        <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 class="text-sm font-semibold mb-3">Información</h3>
          <dl class="space-y-2 text-sm">
            <div v-if="pagePath">
              <dt class="text-neutral-500">Path</dt>
              <dd class="font-mono break-all">{{ pagePath }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">Sitio</dt>
              <dd>{{ siteId }}</dd>
            </div>
            <div v-if="existingPage?.path">
              <dt class="text-neutral-500">Slug</dt>
              <dd class="font-mono">{{ getRelativeSlug() }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 p-4 text-sm">
          <p class="font-medium text-amber-800 dark:text-amber-200 mb-1">💡 Tips</p>
          <ul class="text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
            <li>Usa Markdown estándar para el contenido</li>
            <li>El título se usa para SEO y breadcrumbs</li>
            <li>Orden de navegación controla la posición en el menú</li>
            <li>Para sub-páginas usa el formato: carpeta/nombre</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
