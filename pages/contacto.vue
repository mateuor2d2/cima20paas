<script setup>
const route = useRoute()
const { siteId } = useSite()

const contentPath = computed(() => `/sites/${siteId.value}/pages/contacto`)

const { data: page } = await useAsyncData(`page-${siteId.value}-contacto`, () => {
  return queryCollection('pages').path(contentPath.value).first()
})

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function submitForm() {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form
    })
    
    success.value = true
    // Reset form
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'Error al enviar el mensaje'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: page.value?.title || 'Contacto',
  description: page.value?.description || 'Contacta con PROJECTES TÈCNICS SL'
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Content from Markdown -->
        <div>
          <h1 class="text-4xl font-bold mb-4">{{ page?.title || 'Contacto' }}</h1>
          <div v-if="page?.body" class="prose dark:prose-invert max-w-none">
            <ContentRenderer :value="page" />
          </div>
        </div>
        
        <!-- Contact Form -->
        <div class="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h2 class="text-2xl font-semibold mb-6">Formulario de contacto</h2>
          
          <!-- Success message -->
          <div v-if="success" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-green-700 dark:text-green-400 font-medium">✓ Mensaje enviado correctamente</p>
            <p class="text-green-600 dark:text-green-500 text-sm mt-1">Nos pondremos en contacto contigo pronto.</p>
          </div>
          
          <!-- Error message -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-red-700 dark:text-red-400 font-medium">✗ {{ error }}</p>
          </div>
          
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre * </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email * </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Teléfono</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+34 123 456 789"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Asunto</label>
              <input
                v-model="form.subject"
                type="text"
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="¿Sobre qué nos quieres consultar?"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mensaje * </label>
              <textarea
                v-model="form.message"
                required
                rows="5"
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Enviando...</span>
              <span v-else>Enviar mensaje</span>
            </button>
          </form>
        </div>
      </div>
    </UContainer>
  </div>
</template>
