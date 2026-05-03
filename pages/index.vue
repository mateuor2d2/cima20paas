<script setup>
/**
 * Homepage — Professional SaaS landing page for CIMA20 / PROJECTES TÈCNICS SL.
 * Sections: Hero (CimaHero), Services Grid, Stats, Why Choose Us, CTA Banner.
 */
const { siteId } = useSite()

const contentPath = computed(() => `/sites/${siteId.value}/pages/index`)

const { data: page } = await useAsyncData(`homepage-${siteId.value}`, () => {
  return queryCollection('pages').path(contentPath.value).first()
})

const { data: siteConfig } = await useAsyncData(`config-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

useSeoMeta({
  title: page.value?.title || 'PROJECTES TÈCNICS SL',
  description: page.value?.description || 'Seguridad, Prevención, Medio Ambiente y Calidad'
})

defineOgImage({
  title: page.value?.title || 'PROJECTES TÈCNICS SL',
  description: page.value?.description || 'Seguridad, Prevención, Medio Ambiente y Calidad',
})

useCimaOrganization()
useCimaBreadcrumbs([{ name: 'Inicio', to: '/' }])

// Service cards data
const services = [
  {
    icon: 'i-lucide-shield',
    title: 'Seguridad en el Trabajo',
    description: 'Evaluación y gestión integral de riesgos laborales para garantizar entornos de trabajo seguros y conformes con la normativa vigente.'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Prevención de Riesgos',
    description: 'Planes de prevención personalizados, vigilancia de la salud y asesoramiento técnico para proteger a sus trabajadores.'
  },
  {
    icon: 'i-lucide-leaf',
    title: 'Medio Ambiente',
    description: 'Estudios de impacto ambiental, gestión de residuos y consultoría para el cumplimiento de la normativa medioambiental.'
  },
  {
    icon: 'i-lucide-check-circle-2',
    title: 'Calidad y Normativas',
    description: 'Implantación de sistemas de gestión de calidad ISO, auditorías internas y asesoramiento en certificaciones.'
  }
]

// Stats data
const stats = [
  { value: '20+', label: 'Años de Experiencia', icon: 'i-lucide-calendar' },
  { value: '300+', label: 'Empresas Confían en Nosotros', icon: 'i-lucide-building-2' },
  { value: '15+', label: 'Profesionales Especializados', icon: 'i-lucide-users' },
  { value: '1000+', label: 'Auditorías Realizadas', icon: 'i-lucide-clipboard-check' },
]

// Why choose us features
const features = [
  {
    icon: 'i-lucide-award',
    title: 'Certificación Garantizada',
    description: 'Profesionales certificados con amplia experiencia en todas las especialidades de prevención.'
  },
  {
    icon: 'i-lucide-zap',
    title: 'Respuesta Rápida',
    description: 'Atención ágil y personalizada. Nos adaptamos a sus plazos y necesidades operativas.'
  },
  {
    icon: 'i-lucide-target',
    title: 'Soluciones a Medida',
    description: 'Cada empresa es única. Diseñamos planes de prevención adaptados a su sector y actividad.'
  },
  {
    icon: 'i-lucide-trending-up',
    title: 'Mejora Continua',
    description: 'Auditorías periódicas y seguimiento para asegurar la mejora continua en sus procesos.'
  },
  {
    icon: 'i-lucide-handshake',
    title: 'Compromiso Total',
    description: 'Acompañamos a nuestros clientes en todo el proceso, desde la evaluación hasta la implantación.'
  },
  {
    icon: 'i-lucide-book-open',
    title: 'Formación Especializada',
    description: 'Cursos y jornadas formativas adaptadas a su equipo para una cultura preventiva sólida.'
  },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <CimaHero :page="page || { title: 'PROJECTES TÈCNICS SL', description: 'Seguridad, Prevención, Medio Ambiente y Calidad' }" />

    <!-- Services Grid Section -->
    <section class="py-16 md:py-24 bg-white dark:bg-neutral-950" aria-label="Servicios">
      <UContainer>
        <!-- Section header -->
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="saas-label text-blue-600 dark:text-blue-400 mb-3">Nuestros Servicios</p>
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
            Soluciones integrales para su empresa
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Ofrecemos un servicio completo en materia de seguridad, prevención, medio ambiente y calidad, adaptado a las necesidades de cada organización.
          </p>
        </div>

        <!-- Cards grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <section class="py-16 md:py-20 bg-neutral-50 dark:bg-neutral-900/50" aria-label="Estadísticas">
      <UContainer>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4">
              <UIcon :name="stat.icon" class="w-6 h-6" />
            </div>
            <div class="saas-stat-number text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-1">
              {{ stat.value }}
            </div>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ stat.label }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-16 md:py-24 bg-white dark:bg-neutral-950" aria-label="Por qué elegirnos">
      <UContainer>
        <div class="text-center max-w-2xl mx-auto mb-14">
          <p class="saas-label text-blue-600 dark:text-blue-400 mb-3">Por Qué Elegirnos</p>
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
            Su confianza es nuestra prioridad
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            Combinamos experiencia, profesionalidad y cercanía para ofrecer un servicio de máxima calidad.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="saas-card group flex gap-4 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          >
            <div class="saas-service-icon w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
              <UIcon :name="feat.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ feat.title }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {{ feat.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Banner Section -->
    <section class="relative overflow-hidden saas-cta-gradient py-16 md:py-20" aria-label="Llamada a la acción">
      <!-- Decorative shapes -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="saas-pulse-soft absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        <div class="saas-float absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-400/10 blur-xl" />
      </div>

      <UContainer class="relative text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          ¿Listo para mejorar la seguridad de su empresa?
        </h2>
        <p class="text-blue-100/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Contacte con nosotros y reciba una consultoría personalizada sin compromiso.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <UButton
            to="/contacto"
            size="xl"
            icon="i-lucide-mail"
            class="bg-white text-blue-700 font-semibold hover:bg-blue-50 shadow-lg shadow-blue-900/20"
            :ui="{ base: 'px-8 py-4' }"
          >
            Solicitar Presupuesto
          </UButton>
          <UButton
            to="/servicios"
            size="xl"
            variant="outline"
            icon="i-lucide-arrow-right"
            class="border-white/30 text-white hover:bg-white/10"
            :ui="{ base: 'px-8 py-4' }"
          >
            Ver Servicios
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Content from CMS (if any) -->
    <section v-if="page?.body" class="py-16 bg-white dark:bg-neutral-950" aria-label="Contenido adicional">
      <UContainer>
        <div class="prose dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </div>
      </UContainer>
    </section>
  </div>
</template>
