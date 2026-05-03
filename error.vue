<script setup>
/**
 * error.vue — Custom error page with CIMA20 branding.
 * Handles 404, 500 and other error codes with themed design.
 */
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
})

const is404 = computed(() => props.error.statusCode === 404)

const errorTitle = computed(() => {
  if (is404.value) return 'Página no encontrada'
  if (props.error.statusCode === 500) return 'Error del servidor'
  if (props.error.statusCode === 403) return 'Acceso denegado'
  return 'Algo salió mal'
})

const errorMessage = computed(() => {
  if (is404.value) return 'La página que buscas no existe o ha sido movida.'
  if (props.error.statusCode === 500) return 'Ha ocurrido un error interno. Por favor, inténtalo más tarde.'
  if (props.error.statusCode === 403) return 'No tienes permisos para acceder a esta página.'
  return props.error.message || 'Ha ocurrido un error inesperado.'
})

const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/blog?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

useSeoMeta({
  title: `${errorTitle.value} | CIMA 20`,
  description: errorMessage.value,
})
</script>

<template>
  <NuxtLayout>
    <div class="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div class="text-center max-w-lg">
        <!-- Error code illustration -->
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-6">
            <span class="text-5xl font-bold text-primary-600 dark:text-primary-400">
              {{ error.statusCode }}
            </span>
          </div>
        </div>

        <!-- Error text -->
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          {{ errorTitle }}
        </h1>
        <p class="text-lg text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
          {{ errorMessage }}
        </p>

        <!-- Search bar -->
        <div v-if="is404" class="mb-8">
          <form class="flex gap-2 max-w-md mx-auto" @submit.prevent="handleSearch">
            <div class="flex-1 relative">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Buscar en el sitio..."
                class="w-full px-4 py-2.5 pl-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                aria-label="Buscar contenido"
              />
              <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>
            <button
              type="submit"
              class="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              Buscar
            </button>
          </form>
        </div>

        <!-- Navigation links -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            <UIcon name="i-lucide-home" class="w-4 h-4" />
            Ir al inicio
          </NuxtLink>
          <NuxtLink
            to="/servicios"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            <UIcon name="i-lucide-briefcase" class="w-4 h-4" />
            Servicios
          </NuxtLink>
          <NuxtLink
            to="/contacto"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            <UIcon name="i-lucide-mail" class="w-4 h-4" />
            Contacto
          </NuxtLink>
        </div>

        <!-- Quick links for 404 -->
        <div v-if="is404" class="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p class="text-sm text-neutral-500 mb-4">Páginas populares:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <NuxtLink
              v-for="link in [
                { to: '/quienes-somos', label: 'Quiénes somos' },
                { to: '/prevencion', label: 'Prevención' },
                { to: '/reconocimientos-medicos', label: 'Reconocimientos Médicos' },
                { to: '/blog', label: 'Blog' },
                { to: '/asesoria', label: 'Empresa Saludable' },
              ]"
              :key="link.to"
              :to="link.to"
              class="text-xs px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
