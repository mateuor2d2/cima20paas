<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const { siteId } = useSite()

// The slug param contains the full path from the catch-all route
// e.g., /admin/posts/edit/sites/cima/posts/my-post  =>  slug = ["edit", "sites", "cima", "posts", "my-post"]
// e.g., /admin/posts/create                         =>  slug = ["create"]
const fullPath = computed(() => {
  const slugParam = route.params.slug
  if (Array.isArray(slugParam)) {
    return slugParam.join('/')
  }
  return slugParam || ''
})

const isNewPost = computed(() => {
  return fullPath.value === 'create' || fullPath.value === ''
})

// Extract the content path for existing posts
// fullPath: "edit/sites/cima/posts/my-post" => content path: "/sites/cima/posts/my-post"
const contentPath = computed(() => {
  if (isNewPost.value) return ''
  // Remove the "edit/" prefix if present
  const cleaned = fullPath.value.replace(/^edit\//, '')
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
})

// Load existing post data if editing
const { data: existingPost } = await useAsyncData(`admin-edit-post-${fullPath.value}`, async () => {
  if (isNewPost.value) return null
  return queryCollection('posts').path(contentPath.value).first()
}, { watch: [contentPath] })

// Available categories (derived from existing posts)
const categories = ['prevención', 'seguridad', 'medio ambiente', 'legislación', 'salud']

// Form state
const form = ref({
  title: existingPost.value?.title || '',
  description: existingPost.value?.description || '',
  date: existingPost.value?.date ? new Date(existingPost.value.date as string).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  category: existingPost.value?.category || '',
  tags: (existingPost.value?.tags as string[]) || [],
  author: existingPost.value?.author || 'CIMA 20',
  image: existingPost.value?.image || '',
  body: '',
})

// Slug for new posts
const newSlug = ref('')

// Tags input
const tagInput = ref('')

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(index: number) {
  form.value.tags.splice(index, 1)
}

// Load body content on mount
onMounted(() => {
  if (!isNewPost.value && existingPost.value) {
    form.value.body = (existingPost.value as any)?.body || ''
  }
})

const saving = ref(false)
const message = ref('')
const showPreview = ref(false)

// Determine slug for saving
function getSlug(): string {
  if (isNewPost.value) {
    if (newSlug.value) return newSlug.value
    return form.value.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  // Extract slug from contentPath: /sites/cima/posts/my-post => my-post
  const parts = contentPath.value.split('/')
  return parts[parts.length - 1]
}

async function savePost() {
  if (!form.value.title) {
    message.value = 'Error: El título es obligatorio'
    return
  }

  saving.value = true
  message.value = ''

  try {
    if (isNewPost.value) {
      // Create new post
      await $fetch('/api/admin/posts', {
        method: 'POST',
        body: {
          slug: getSlug(),
          title: form.value.title,
          description: form.value.description,
          site: siteId.value,
          date: form.value.date,
          category: form.value.category,
          tags: form.value.tags,
          author: form.value.author,
          image: form.value.image,
          body: form.value.body,
        },
      })
    } else {
      // Update existing post
      await $fetch('/api/admin/posts', {
        method: 'PUT',
        body: {
          path: contentPath.value,
          title: form.value.title,
          description: form.value.description,
          site: siteId.value,
          date: form.value.date,
          category: form.value.category,
          tags: form.value.tags,
          author: form.value.author,
          image: form.value.image,
          body: form.value.body,
        },
      })
    }

    message.value = 'Post guardado correctamente'
    setTimeout(() => router.push('/admin/posts'), 1000)
  } catch (e: any) {
    message.value = 'Error: ' + (e.data?.message || e.message)
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: isNewPost.value ? 'Admin - Nuevo post' : `Admin - Editar: ${existingPost.value?.title || ''}`,
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/posts" class="text-neutral-500 hover:text-primary transition-colors">
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">
        {{ isNewPost ? 'Nuevo post' : `Editar: ${existingPost?.title || ''}` }}
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Editor -->
      <div class="space-y-4">
        <!-- Metadata -->
        <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Título *</label>
            <UInput v-model="form.title" placeholder="Título del post" size="lg" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <UTextarea v-model="form.description" placeholder="Descripción breve para SEO" :rows="2" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Fecha</label>
              <UInput v-model="form.date" type="date" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Autor</label>
              <UInput v-model="form.author" placeholder="CIMA 20" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Categoría</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">— Sin categoría —</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Imagen destacada</label>
              <UInput v-model="form.image" placeholder="/img/post.jpg" />
            </div>
          </div>

          <!-- Slug for new posts -->
          <div v-if="isNewPost">
            <label class="block text-sm font-medium mb-1">Slug (URL)</label>
            <UInput v-model="newSlug" placeholder="Se genera del título automáticamente" />
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium mb-1">Tags</label>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span
                v-for="(tag, i) in form.tags"
                :key="i"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {{ tag }}
                <button type="button" class="hover:text-red-500" @click="removeTag(i)">×</button>
              </span>
            </div>
            <div class="flex gap-2">
              <UInput v-model="tagInput" placeholder="Añadir tag" class="flex-1" @keydown.enter.prevent="addTag" />
              <UButton size="sm" variant="outline" @click="addTag">+</UButton>
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
          <UButton size="lg" :loading="saving" @click="savePost">
            {{ isNewPost ? 'Crear post' : 'Guardar cambios' }}
          </UButton>
          <NuxtLink to="/admin/posts" class="text-sm text-neutral-500 hover:text-primary">
            Cancelar
          </NuxtLink>
          <p v-if="message" :class="message.startsWith('Error') ? 'text-red-500' : 'text-green-600'" class="text-sm">
            {{ message }}
          </p>
        </div>
      </div>

      <!-- Right panel -->
      <div class="space-y-4">
        <div v-if="!isNewPost && existingPost" class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 class="text-sm font-semibold mb-3">Información</h3>
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-neutral-500">Path</dt>
              <dd class="font-mono break-all">{{ contentPath }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">Sitio</dt>
              <dd>{{ siteId }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">Slug</dt>
              <dd class="font-mono">{{ getSlug() }}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 text-sm">
          <p class="font-medium text-blue-800 dark:text-blue-200 mb-1">📝 Tips para posts</p>
          <ul class="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>El título y descripción se usan para SEO</li>
            <li>La fecha debe tener formato YYYY-MM-DD</li>
            <li>Los tags ayudan a filtrar contenido en el blog</li>
            <li>La imagen destacada aparece en el hero del post</li>
            <li>Usa Markdown estándar para el contenido</li>
            <li>El slug se genera automáticamente del título</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
