<script setup>
/**
 * CimaFooter — Refined dark footer with gradient top border.
 * 4-column grid: Brand, Navigation, Services, Contact.
 */
const { siteId } = useSite()
const { t } = useI18n()
const year = new Date().getFullYear()

const { data: siteConfig } = await useAsyncData(`config-footer-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const footerLinks = computed(() => siteConfig.value?.footer?.links || [])
const footerText = computed(() => siteConfig.value?.footer?.text || '')
const siteName = computed(() => siteConfig.value?.name || 'CIMA 20')

const services = computed(() => [
  { label: t('footer_services.work_safety'), to: '/servicios' },
  { label: t('footer_services.risk_prevention'), to: '/servicios' },
  { label: t('footer_services.environment'), to: '/servicios' },
  { label: t('footer_services.quality_standards'), to: '/servicios' },
  { label: t('footer_services.audits'), to: '/servicios' },
  { label: t('footer_services.training'), to: '/servicios' },
])

const navLinks = computed(() => [
  { label: t('footer_nav.home'), to: '/' },
  { label: t('footer_nav.services'), to: '/servicios' },
  { label: t('footer_nav.about'), to: '/sobre-nosotros' },
  { label: t('footer_nav.blog'), to: '/blog' },
  { label: t('footer_nav.contact'), to: '/contacto' },
])
</script>

<template>
  <footer role="contentinfo" class="bg-neutral-900 dark:bg-black text-neutral-200">
    <!-- Gradient top border -->
    <div class="saas-footer-border h-1" aria-hidden="true" />

    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <!-- Brand Column -->
        <div class="sm:col-span-2 lg:col-span-1 space-y-6">
          <div class="flex items-center gap-3">
            <NuxtImg
              src="/logo.png"
              alt="CIMA 20"
              class="h-8 w-auto brightness-0 invert"
              format="webp"
              quality="90"
            />
          </div>
          <p class="text-sm text-neutral-300 leading-relaxed max-w-xs">
            {{ t('footer.brand_description') }}
          </p>
          <!-- Social media icons -->
          <div class="flex items-center gap-2.5 pt-1">
            <a href="https://www.linkedin.com/company/23678070/" aria-label="LinkedIn" class="w-9 h-9 rounded-lg bg-neutral-800/80 hover:bg-blue-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-200">
              <UIcon name="i-lucide-linkedin" class="w-4 h-4" />
            </a>
            <a href="https://twitter.com/cima20_" aria-label="Twitter" class="w-9 h-9 rounded-lg bg-neutral-800/80 hover:bg-blue-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-200">
              <UIcon name="i-lucide-twitter" class="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/cima20empresaludable" aria-label="Facebook" class="w-9 h-9 rounded-lg bg-neutral-800/80 hover:bg-blue-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-200">
              <UIcon name="i-lucide-facebook" class="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/cima20_/" aria-label="Instagram" class="w-9 h-9 rounded-lg bg-neutral-800/80 hover:bg-blue-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-200">
              <UIcon name="i-lucide-instagram" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Navigation Column -->
        <div>
          <h3 class="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-6 flex items-center gap-2.5">
            <span class="w-5 h-0.5 bg-blue-500 rounded-full" />
            {{ t('footer.navigation') }}
          </h3>
          <nav aria-label="Navegación del pie de página" class="space-y-3">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="block text-sm text-neutral-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Services Column -->
        <div>
          <h3 class="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-6 flex items-center gap-2.5">
            <span class="w-5 h-0.5 bg-blue-500 rounded-full" />
            {{ t('footer.services') }}
          </h3>
          <div class="space-y-3">
            <NuxtLink
              v-for="svc in services"
              :key="svc.label"
              :to="svc.to"
              class="block text-sm text-neutral-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform"
            >
              {{ svc.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Contact Column -->
        <div>
          <h3 class="text-xs font-semibold text-white uppercase tracking-[0.12em] mb-6 flex items-center gap-2.5">
            <span class="w-5 h-0.5 bg-blue-500 rounded-full" />
            {{ t('footer.contact') }}
          </h3>
          <div class="space-y-5">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-neutral-800/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p class="text-sm text-neutral-200 leading-relaxed">C/Pau Piferrer, 8<br>07011 Palma de Mallorca, Illes Balears</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-neutral-800/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-lucide-mail" class="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <a href="mailto:cima20@cima20.com" class="text-sm text-neutral-200 hover:text-blue-400 transition-colors duration-200">cima20@cima20.com</a>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-neutral-800/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <a href="tel:+34971714584" class="text-sm text-neutral-200 hover:text-blue-400 transition-colors duration-200">971 714 584</a>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-neutral-800/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UIcon name="i-lucide-clock" class="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p class="text-sm text-neutral-200">{{ t('contact.schedule_detail') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-neutral-800/60">
      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-xs text-neutral-400">
            {{ footerText || t('footer.copyright') }}
          </p>
          <nav v-if="footerLinks.length" class="flex items-center gap-5">
            <NuxtLink
              v-for="link in footerLinks"
              :key="link.to"
              :to="link.to"
              class="text-xs text-neutral-400 hover:text-blue-400 transition-colors duration-200"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>
