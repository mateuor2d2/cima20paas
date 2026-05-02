<script setup>
/**
 * CimaHero — Theme-specific hero section for CIMA20.
 * Professional hero with gradient, tagline and CTA button.
 */
const props = defineProps({
  page: { type: Object, required: true },
  showCta: { type: Boolean, default: true },
})

const { siteId } = useSite()
const { data: siteConfig } = await useAsyncData(`config-hero-${siteId.value}`, () => {
  return queryCollection('site_config').path(`/sites/${siteId.value}/config`).first()
})

const tagline = computed(() => siteConfig.value?.tagline || '')
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700 text-white">
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full" />
      <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full" />
    </div>

    <UContainer class="relative py-20 md:py-28">
      <div class="max-w-3xl">
        <p v-if="tagline" class="text-primary-200 text-sm font-medium uppercase tracking-wider mb-3">
          {{ tagline }}
        </p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {{ page.title }}
        </h1>
        <p v-if="page.description" class="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
          {{ page.description }}
        </p>
        <div v-if="showCta" class="flex flex-wrap gap-4">
          <NuxtLink
            to="/contacto"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            <UIcon name="i-lucide-mail" class="w-4 h-4" />
            Contactar
          </NuxtLink>
          <NuxtLink
            to="/servicios"
            class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            Nuestros servicios
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </section>
</template>
