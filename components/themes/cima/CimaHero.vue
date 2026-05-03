<script setup>
/**
 * CimaHero — Premium hero for CIMA20 / PROJECTES TÈCNICS SL.
 * Full-width animated gradient with mesh overlay, decorative shapes, gradient text, dual CTAs.
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
  <section class="relative overflow-hidden saas-hero-gradient text-white">
    <!-- Mesh overlay -->
    <div class="saas-hero-mesh absolute inset-0" aria-hidden="true" />

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;);"
    />

    <!-- Decorative animated shapes -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="saas-float absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/[0.07] blur-3xl" />
      <div class="saas-float-delayed absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-blue-400/10 blur-2xl" />
      <div class="saas-pulse-soft absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-blue-300/8 blur-3xl" />
      <div class="saas-float-delayed absolute top-12 left-1/3 w-28 h-28 rounded-full bg-white/[0.04]" />
      <div class="saas-float absolute bottom-16 right-16 w-20 h-20 rounded-full bg-blue-200/10" />
      <!-- Subtle diagonal lines -->
      <div class="absolute top-0 right-0 w-full h-full opacity-[0.02]"
        style="background: repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(255,255,255,0.5) 80px, rgba(255,255,255,0.5) 81px);"
      />
    </div>

    <UContainer class="relative py-24 md:py-32 lg:py-40">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="max-w-3xl">
          <!-- Tagline -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
            <p class="text-blue-100 text-xs font-semibold tracking-[0.1em] uppercase">
              {{ tagline }}
            </p>
          </div>

          <!-- Main heading with gradient text -->
          <h1 class="saas-heading-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.08]">
            <span class="block text-white drop-shadow-sm">{{ page.title }}</span>
          </h1>

          <!-- Description -->
          <p v-if="page.description" class="text-lg md:text-xl text-blue-100/85 mb-12 leading-relaxed max-w-2xl">
            {{ page.description }}
          </p>

          <!-- CTA Buttons -->
          <div v-if="showCta" class="flex flex-wrap gap-4 mb-14">
            <UButton
              to="/contacto"
              size="xl"
              icon="i-lucide-mail"
              class="bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-xl shadow-blue-950/20 hover:shadow-2xl hover:shadow-blue-950/30 transition-all duration-300 hover:-translate-y-0.5"
              :ui="{ base: 'px-8 py-4' }"
            >
              Solicitar Presupuesto
            </UButton>
            <UButton
              to="/servicios"
              size="xl"
              variant="outline"
              icon="i-lucide-arrow-right"
              class="border-white/25 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
              :ui="{ base: 'px-8 py-4' }"
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

        <!-- Right side: Abstract illustration placeholder -->
        <div class="hidden lg:flex items-center justify-center" aria-hidden="true">
          <div class="relative w-80 h-80 xl:w-96 xl:h-96">
            <!-- Outer ring -->
            <div class="absolute inset-0 rounded-full border border-white/10" />
            <div class="absolute inset-4 rounded-full border border-white/[0.06]" />
            <div class="absolute inset-8 rounded-full border border-white/[0.03]" />
            <!-- Central icon cluster -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="grid grid-cols-3 gap-5">
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float">
                  <UIcon name="i-lucide-shield" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float-delayed">
                  <UIcon name="i-lucide-heart-pulse" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float">
                  <UIcon name="i-lucide-leaf" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float-delayed">
                  <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center saas-pulse-soft">
                  <UIcon name="i-lucide-award" class="w-7 h-7 text-white/90" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float">
                  <UIcon name="i-lucide-zap" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float">
                  <UIcon name="i-lucide-target" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float-delayed">
                  <UIcon name="i-lucide-book-open" class="w-6 h-6 text-blue-200/80" />
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center saas-float">
                  <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-blue-200/80" />
                </div>
              </div>
            </div>
            <!-- Floating accent dots -->
            <div class="absolute top-8 right-8 w-3 h-3 rounded-full bg-blue-300/40 saas-pulse-soft" />
            <div class="absolute bottom-12 left-6 w-2 h-2 rounded-full bg-white/30 saas-float-delayed" />
            <div class="absolute top-1/3 left-2 w-2.5 h-2.5 rounded-full bg-blue-200/25 saas-float" />
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Bottom wave separator -->
    <div class="absolute bottom-0 left-0 right-0" aria-hidden="true">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 48C1200 48 1320 40 1380 36L1440 32V80H0Z" fill="white" class="dark:fill-neutral-950" />
      </svg>
    </div>
  </section>
</template>
