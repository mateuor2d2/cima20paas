<script setup>
/**
 * CimaFooter — Theme-specific footer for CIMA20.
 * Multi-column layout with branding, navigation links, and contact info.
 */
const { siteId } = useSite()
const year = new Date().getFullYear()

const { data: siteConfig } = await useAsyncData(`config-footer-${siteId.value}`, () => {
  return queryCollection('site_config').path(`/sites/${siteId.value}/config`).first()
})

const footerLinks = computed(() => siteConfig.value?.footer?.links || [])
const footerText = computed(() => siteConfig.value?.footer?.text || '')
const siteName = computed(() => siteConfig.value?.name || 'PROJECTES TÈCNICS SL')
</script>

<template>
  <footer role="contentinfo" class="bg-neutral-900 dark:bg-neutral-950 text-neutral-300">
    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              PT
            </div>
            <span class="text-lg font-bold text-white">{{ siteName }}</span>
          </div>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Seguridad, Prevención, Medio Ambiente y Calidad. Más de 20 años cuidando la salud laboral de las empresas.
          </p>
        </div>

        <!-- Navigation Column -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h3>
          <nav aria-label="Enlaces del pie de página" class="space-y-2">
            <NuxtLink to="/" class="block text-sm text-neutral-400 hover:text-primary-400 transition-colors">Inicio</NuxtLink>
            <NuxtLink to="/servicios" class="block text-sm text-neutral-400 hover:text-primary-400 transition-colors">Servicios</NuxtLink>
            <NuxtLink to="/blog" class="block text-sm text-neutral-400 hover:text-primary-400 transition-colors">Actualidad</NuxtLink>
            <NuxtLink to="/contacto" class="block text-sm text-neutral-400 hover:text-primary-400 transition-colors">Contacto</NuxtLink>
          </nav>
        </div>

        <!-- Contact Column -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h3>
          <div class="space-y-2 text-sm text-neutral-400">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>Barcelona, España</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-primary-500 flex-shrink-0" />
              <a href="mailto:info@cima20.com" class="hover:text-primary-400 transition-colors">info@cima20.com</a>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-4 h-4 text-primary-500 flex-shrink-0" />
              <a href="tel:+34934223642" class="hover:text-primary-400 transition-colors">934 223 642</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="text-xs text-neutral-500">{{ footerText || `© ${year} ${siteName} - Todos los derechos reservados` }}</p>
          <nav v-if="footerLinks.length" class="flex items-center gap-4">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="link.to"
              class="text-xs text-neutral-500 hover:text-primary-400 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>
