<script setup>
/**
 * CimaHero — Premium SaaS-style hero for CIMA20 / PROJECTES TÈCNICS SL.
 * Full-width gradient with mesh overlay, decorative shapes, gradient text, dual CTAs.
 */
const props = defineProps({
  page: { type: Object, required: true },
  showCta: { type: Boolean, default: true },
})

const { siteId } = useSite()
const { data: siteConfig } = await useAsyncData(`config-hero-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const tagline = computed(() => siteConfig.value?.tagline || 'Seguridad y Prevención Profesional')
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 text-white">
    <!-- Mesh overlay -->
    <div class="saas-hero-mesh absolute inset-0" aria-hidden="true" />

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-[0.04]" aria-hidden="true"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"
    />

    <!-- Decorative animated circles -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="saas-float absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
      <div class="saas-float-delayed absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-blue-400/10 blur-xl" />
      <div class="saas-pulse-soft absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl" />
      <div class="saas-float-delayed absolute top-10 left-1/3 w-24 h-24 rounded-full bg-white/5" />
      <div class="saas-float absolute bottom-10 right-10 w-16 h-16 rounded-full bg-blue-200/10" />
    </div>

    <UContainer class="relative py-20 md:py-28 lg:py-36">
      <div class="max-w-3xl">
        <!-- Tagline -->
        <p class="saas-label text-blue-200 mb-4">
          {{ tagline }}
        </p>

        <!-- Main heading with gradient text -->
        <h1 class="saas-heading-lg text-4xl md:text-5xl lg:text-6xl mb-6">
          <span class="block text-white">{{ page.title }}</span>
        </h1>

        <!-- Description -->
        <p v-if="page.description" class="text-lg md:text-xl text-blue-100/90 mb-10 leading-relaxed max-w-2xl">
          {{ page.description }}
        </p>

        <!-- CTA Buttons -->
        <div v-if="showCta" class="flex flex-wrap gap-4 mb-10">
          <UButton
            to="/contacto"
            size="xl"
            icon="i-lucide-mail"
            class="bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-lg shadow-blue-900/20"
            :ui="{ base: 'px-7 py-3.5' }"
          >
            Solicitar Presupuesto
          </UButton>
          <UButton
            to="/servicios"
            size="xl"
            variant="outline"
            icon="i-lucide-arrow-right"
            class="border-white/30 text-white hover:bg-white/10"
            :ui="{ base: 'px-7 py-3.5' }"
          >
            Nuestros Servicios
          </UButton>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap gap-3">
          <span class="saas-trust-badge">
            <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5" />
            Certificados ISO
          </span>
          <span class="saas-trust-badge">
            <UIcon name="i-lucide-users" class="w-3.5 h-3.5" />
            +300 Empresas
          </span>
          <span class="saas-trust-badge">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            +20 Años Experiencia
          </span>
        </div>
      </div>
    </UContainer>

    <!-- Bottom wave separator -->
    <div class="absolute bottom-0 left-0 right-0" aria-hidden="true">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 26C672 32 768 40 864 40C960 40 1056 32 1152 26C1248 20 1344 16 1392 14L1440 12V60H0Z" fill="white" class="dark:fill-neutral-950" />
      </svg>
    </div>
  </section>
</template>
