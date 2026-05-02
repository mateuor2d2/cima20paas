<script setup>
const route = useRoute()
const { siteId } = useSite()
const toast = useToast()

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
  message: '',
  website: '' // Honeypot — hidden field for bots
})

// Validation state
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const touched = reactive({
  name: false,
  email: false,
  phone: false,
  subject: false,
  message: false
})

const loading = ref(false)
const success = ref(false)

// Inline validation functions
function validateField(field: keyof typeof errors) {
  errors[field] = ''
  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'El nombre es obligatorio'
      } else if (form.name.trim().length < 2) {
        errors.name = 'Mínimo 2 caracteres'
      }
      break
    case 'email':
      if (!form.email.trim()) {
        errors.email = 'El email es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Email no válido'
      }
      break
    case 'phone':
      if (form.phone && !/^[\d\s+\-()]{6,20}$/.test(form.phone.trim())) {
        errors.phone = 'Teléfono no válido'
      }
      break
    case 'message':
      if (!form.message.trim()) {
        errors.message = 'El mensaje es obligatorio'
      } else if (form.message.trim().length < 10) {
        errors.message = 'Mínimo 10 caracteres'
      }
      break
  }
}

function onBlur(field: keyof typeof touched) {
  touched[field] = true
  validateField(field)
}

function validateAll(): boolean {
  let valid = true
  for (const field of ['name', 'email', 'phone', 'message'] as const) {
    touched[field] = true
    validateField(field)
    if (errors[field]) valid = false
  }
  return valid
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  form.website = ''
  for (const key of Object.keys(errors) as (keyof typeof errors)[]) {
    errors[key] = ''
  }
  for (const key of Object.keys(touched) as (keyof typeof touched)[]) {
    touched[key] = false
  }
}

async function submitForm() {
  // Validate all fields first
  if (!validateAll()) {
    toast.add({
      title: 'Revisa los campos marcados',
      description: 'Algunos campos tienen errores',
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle'
    })
    return
  }

  // Honeypot: if website is filled, silently "succeed"
  if (form.website) {
    success.value = true
    toast.add({
      title: 'Mensaje enviado',
      description: 'Nos pondremos en contacto contigo pronto.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    resetForm()
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || 'Consulta desde la web',
        message: form.message,
        website: form.website // honeypot
      }
    })

    success.value = true
    toast.add({
      title: '✓ Mensaje enviado correctamente',
      description: 'Nos pondremos en contacto contigo pronto.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
      duration: 5000
    })
    resetForm()
  } catch (err: any) {
    const errorMessage = err.data?.statusMessage || err.message || 'Error al enviar el mensaje'
    toast.add({
      title: 'Error al enviar',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-x-circle',
      duration: 8000
    })
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: page.value?.title || 'Contacto',
  description: page.value?.description || 'Contacta con PROJECTES TÈCNICS SL'
})

// Structured data: LocalBusiness on contact page
useCimaLocalBusiness()
useCimaBreadcrumbs([
  { name: 'Inicio', to: '/' },
  { name: 'Contacto', to: '/contacto' }
])
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

          <form @submit.prevent="submitForm" class="space-y-4" novalidate>
            <!-- Honeypot — hidden from users, visible to bots -->
            <div class="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabindex="-1">
              <label for="website">No rellenar este campo</label>
              <input
                id="website"
                v-model="form.website"
                type="text"
                name="website"
                autocomplete="off"
                tabindex="-1"
              />
            </div>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :class="[
                  'w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                  touched.name && errors.name
                    ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary'
                ]"
                placeholder="Tu nombre"
                @blur="onBlur('name')"
                @input="touched.name && validateField('name')"
              />
              <p v-if="touched.name && errors.name" class="mt-1 text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :class="[
                  'w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                  touched.email && errors.email
                    ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary'
                ]"
                placeholder="tu@email.com"
                @blur="onBlur('email')"
                @input="touched.email && validateField('email')"
              />
              <p v-if="touched.email && errors.email" class="mt-1 text-sm text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Teléfono
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                :class="[
                  'w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                  touched.phone && errors.phone
                    ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary'
                ]"
                placeholder="+34 123 456 789"
                @blur="onBlur('phone')"
                @input="touched.phone && validateField('phone')"
              />
              <p v-if="touched.phone && errors.phone" class="mt-1 text-sm text-red-500">
                {{ errors.phone }}
              </p>
            </div>

            <!-- Subject -->
            <div>
              <label for="subject" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Asunto
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary transition-colors"
                placeholder="¿Sobre qué nos quieres consultar?"
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Mensaje <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                :class="[
                  'w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors resize-vertical',
                  touched.message && errors.message
                    ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary'
                ]"
                placeholder="Escribe tu mensaje aquí..."
                @blur="onBlur('message')"
                @input="touched.message && validateField('message')"
              ></textarea>
              <p v-if="touched.message && errors.message" class="mt-1 text-sm text-red-500">
                {{ errors.message }}
              </p>
            </div>

            <!-- Submit -->
            <UButton
              type="submit"
              block
              size="lg"
              :loading="loading"
              :disabled="loading"
              icon="i-heroicons-paper-airplane"
              class="mt-2"
            >
              {{ loading ? 'Enviando...' : 'Enviar mensaje' }}
            </UButton>

            <p class="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
              Los campos marcados con <span class="text-red-500">*</span> son obligatorios
            </p>
          </form>
        </div>
      </div>
    </UContainer>
  </div>
</template>
