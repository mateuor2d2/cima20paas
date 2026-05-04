<script setup>
/**
 * Homepage — Professional landing page for CIMA20 / CIMA 20.
 * Sections: Hero (CimaHero), Services Grid, Stats, Why Choose Us, CTA Banner.
 */
const { siteId } = useSite()
const { t } = useI18n()

const contentPath = computed(() => `/sites/${siteId.value}/pages/index`)

const { data: page } = await useAsyncData(`homepage-${siteId.value}`, () => {
  return queryCollection('pages').path(contentPath.value).first()
})

const { data: siteConfig } = await useAsyncData(`config-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

useSeoMeta({
  title: page.value?.title || 'CIMA 20',
  description: page.value?.description || t('hero.subtitle')
})

defineOgImage({
  title: page.value?.title || 'CIMA 20',
  description: page.value?.description || t('hero.subtitle'),
})

useCimaOrganization()
useCimaBreadcrumbs([{ name: t('nav.home'), to: '/' }])

// Scroll-reveal: add 'is-visible' to .saas-fade-in elements on viewport entry
onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.saas-fade-in').forEach((el) => observer.observe(el))
})

// Service cards data
const services = [
  { icon: 'i-lucide-shield', title: t('home.service_work_safety_title'), description: t('home.service_work_safety_desc') },
  { icon: 'i-lucide-heart-pulse', title: t('home.service_risk_prevention_title'), description: t('home.service_risk_prevention_desc') },
  { icon: 'i-lucide-leaf', title: t('home.service_environment_title'), description: t('home.service_environment_desc') },
  { icon: 'i-lucide-check-circle-2', title: t('home.service_quality_title'), description: t('home.service_quality_desc') },
]

// Stats data
const stats = [
  { value: '20+', label: t('home.stat_years'), icon: 'i-lucide-calendar' },
  { value: '300+', label: t('home.stat_companies'), icon: 'i-lucide-building-2' },
  { value: '15+', label: t('home.stat_professionals'), icon: 'i-lucide-users' },
  { value: '1000+', label: t('home.stat_audits'), icon: 'i-lucide-clipboard-check' },
]

// Why choose us features
const features = [
  { icon: 'i-lucide-award', title: t('home.feature_cert_title'), description: t('home.feature_cert_desc') },
  { icon: 'i-lucide-zap', title: t('home.feature_speed_title'), description: t('home.feature_speed_desc') },
  { icon: 'i-lucide-target', title: t('home.feature_custom_title'), description: t('home.feature_custom_desc') },
  { icon: 'i-lucide-trending-up', title: t('home.feature_improve_title'), description: t('home.feature_improve_desc') },
  { icon: 'i-lucide-handshake', title: t('home.feature_commitment_title'), description: t('home.feature_commitment_desc') },
  { icon: 'i-lucide-book-open', title: t('home.feature_training_title'), description: t('home.feature_training_desc') },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <CimaHero :page="page || { title: t('hero.title'), description: t('hero.subtitle') }" />

    <!-- Services Grid Section -->
    <section class="saas-fade-in py-20 md:py-28 bg-white dark:bg-neutral-950" :aria-label="t('nav.services')">
      <UContainer>
        <!-- Section header -->
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 mb-5">
            <UIcon name="i-lucide-layers" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span class="saas-label text-blue-600 dark:text-blue-400">{{ t('home.services_badge') }}</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-5 tracking-tight">
            {{ t('home.services_title') }}
          </h2>
          <p class="text-neutral-500 dark:text-neutral-300 text-base leading-relaxed">
            {{ t('home.services_desc') }}
          </p>
        </div>

        <!-- Cards grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <SiteServiceIcon
            v-for="svc in services"
            :key="svc.title"
            :icon="svc.icon"
            :title="svc.title"
            :description="svc.description"
          />
        </div>
      </UContainer>
    </section>

    <!-- Stats Section -->
    <section class="saas-fade-in relative py-20 md:py-24 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden" :aria-label="t('nav.services')">
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 opacity-[0.015]" aria-hidden="true"
        style="background-image: radial-gradient(circle, #2563eb 1px, transparent 1px); background-size: 32px 32px;"
      />
      <UContainer class="relative">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
          <div v-for="stat in stats" :key="stat.label" class="text-center group">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-300">
              <UIcon :name="stat.icon" class="w-7 h-7" />
            </div>
            <div class="saas-stat-number text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">
              {{ stat.value }}
            </div>
            <p class="text-sm text-neutral-500 dark:text-neutral-300 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Why Choose Us Section -->
    <section class="saas-fade-in py-20 md:py-28 bg-white dark:bg-neutral-950" :aria-label="t('home.why_badge')">
      <UContainer>
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 mb-5">
            <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span class="saas-label text-blue-600 dark:text-blue-400">{{ t('home.why_badge') }}</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-5 tracking-tight">
            {{ t('home.why_title') }}
          </h2>
          <p class="text-neutral-500 dark:text-neutral-300 text-base leading-relaxed">
            {{ t('home.why_desc') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="saas-card group flex gap-5 p-7 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <div class="saas-service-icon w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
              <UIcon :name="feat.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {{ feat.title }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">
                {{ feat.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Banner Section -->
    <section class="saas-fade-in relative overflow-hidden saas-cta-gradient py-20 md:py-24" aria-label="Call to action">
      <!-- Decorative shapes -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="saas-pulse-soft absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div class="saas-float absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/10 blur-2xl" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <UContainer class="relative text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
          <UIcon name="i-lucide-rocket" class="w-3.5 h-3.5 text-blue-200" />
          <span class="text-blue-100 text-xs font-semibold tracking-[0.1em] uppercase">{{ t('home.cta_badge') }}</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
          {{ t('home.cta_title') }}
        </h2>
        <p class="text-blue-100/85 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {{ t('home.cta_desc') }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton
            to="/contacto"
            size="xl"
            icon="i-lucide-mail"
            class="bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-xl shadow-blue-950/20 hover:shadow-2xl hover:shadow-blue-950/30 transition-all duration-300 hover:-translate-y-0.5"
            :ui="{ base: 'px-8 py-4' }"
          >
            {{ t('home.cta_primary') }}
          </UButton>
          <UButton
            to="/servicios"
            size="xl"
            variant="outline"
            icon="i-lucide-arrow-right"
            class="border-white/25 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            :ui="{ base: 'px-8 py-4' }"
          >
            {{ t('home.cta_secondary') }}
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Content from CMS (if any) -->
    <section v-if="page?.body" class="saas-fade-in py-16 bg-white dark:bg-neutral-950" aria-label="Content">
      <UContainer>
        <div class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </div>
      </UContainer>
    </section>
  </div>
</template>
