
<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value)
})

useSeoMeta({
  title: 'Admin - Configuración',
  description: 'Configuración del sitio'
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Configuración</h1>
        <NuxtLink to="/admin" class="text-primary hover:underline">
          ← Volver al panel
        </NuxtLink>
      </div>

      <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 class="text-xl font-semibold mb-4">Idioma</h2>
        
        <div class="flex items-center gap-4">
          <p class="text-neutral-600 dark:text-neutral-400">
            Idioma actual: <strong>{{ locale === 'es' ? 'Español' : 'Català' }}</strong>
          </p>
          
          <div class="flex gap-2">
            <NuxtLink
              v-for="loc in availableLocales"
              :key="loc.code"
              :to="switchLocalePath(loc.code)"
              class="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {{ loc.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
