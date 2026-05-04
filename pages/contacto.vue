<script setup lang="ts">
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
function validateField(field: string) {
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

function onBlur(field: string) {
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
  for (const key of Object.keys(errors) as string[]) {
    errors[key] = ''
  }
  for (const key of Object.keys(touched) as string[]) {
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
  description: page.value?.description || 'Contacta con CIMA 20'
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
    <!-- Page header -->
    <div class="bg-gradient-to-b from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
      <UContainer class="pt-12 pb-6">
        <h1 class="text-4xl font-bold text-neutral-900 dark:text-white">{{ page?.title || 'Contacto' }}</h1>
        <p v-if="page?.description" class="mt-3 text-lg text-neutral-500 dark:text-neutral-300 max-w-2xl">{{ page.description }}</p>
        <div v-if="page?.body" class="prose dark:prose-invert max-w-none mt-4">
          <ContentRenderer :value="page" />
        </div>
      </UContainer>
    </div>

    <UContainer class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Left: Contact Info Sidebar -->
        <div class="space-y-6">
          <!-- Address Card -->
          <div class="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Dirección</h3>
                <p class="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">C/Pau Piferrer, 8<br>07011 Palma (Illes Balears)</p>
              </div>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-phone" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Teléfono</h3>
                <a href="tel:+34971714584" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">971 714 584</a>
              </div>
            </div>
          </div>

          <!-- Email Card -->
          <div class="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-mail" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Email</h3>
                <a href="mailto:cima20@cima20.com" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">cima20@cima20.com</a>
              </div>
            </div>
          </div>

          <!-- Hours Card -->
          <div class="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-clock" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Horario</h3>
                <p class="text-sm text-neutral-500 dark:text-neutral-300">Lunes – Viernes<br>9:00 – 18:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Contact Form -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
            <div class="flex items-center gap-3 mb-6 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div class="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <UIcon name="i-lucide-message-square" class="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">Formulario de contacto</h2>
            </div>

            <form @submit.prevent="submitForm" class="space-y-4" novalidate aria-label="Formulario de contacto">
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

              <!-- Name & Email row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      'w-full px-4 py-2.5 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                      touched.name && errors.name
                        ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                        : 'border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    ]"
                    placeholder="Tu nombre"
                    @blur="onBlur('name')"
                    @input="touched.name && validateField('name')"
                  />
                  <p v-if="touched.name && errors.name" class="mt-1 text-sm text-red-500">
                    {{ errors.name }}
                  </p>
                </div>

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
                      'w-full px-4 py-2.5 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                      touched.email && errors.email
                        ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                        : 'border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    ]"
                    placeholder="tu@email.com"
                    @blur="onBlur('email')"
                    @input="touched.email && validateField('email')"
                  />
                  <p v-if="touched.email && errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                  </p>
                </div>
              </div>

              <!-- Phone & Subject row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="phone" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    :class="[
                      'w-full px-4 py-2.5 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors',
                      touched.phone && errors.phone
                        ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                        : 'border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    ]"
                    placeholder="+34 971 714 584"
                    @blur="onBlur('phone')"
                    @input="touched.phone && validateField('phone')"
                  />
                  <p v-if="touched.phone && errors.phone" class="mt-1 text-sm text-red-500">
                    {{ errors.phone }}
                  </p>
                </div>

                <div>
                  <label for="subject" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Asunto
                  </label>
                  <input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="¿Sobre qué nos quieres consultar?"
                  />
                </div>
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
                    'w-full px-4 py-2.5 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white transition-colors resize-vertical',
                    touched.message && errors.message
                      ? 'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400'
                      : 'border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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

              <p class="text-xs text-neutral-500 dark:text-neutral-300 text-center mt-2">
                Los campos marcados con <span class="text-red-500">*</span> son obligatorios
              </p>
            </form>
          </div>

          <!-- Map Placeholder -->
          <div class="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <div class="relative w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-800 dark:to-neutral-900">
              <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-3">
                  <UIcon name="i-lucide-map" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-300">C/Pau Piferrer, 8 · 07011 Palma</p>
                <p class="text-xs text-neutral-400 dark:text-neutral-300 mt-1">Illes Balears</p>
              </div>
              <!-- Subtle grid pattern -->
              <div class="absolute inset-0 opacity-[0.04]" aria-hidden="true"
                style="background-image: radial-gradient(circle, #2563eb 1px, transparent 1px); background-size: 24px 24px;"
              />
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
