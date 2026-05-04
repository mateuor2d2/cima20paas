<script setup>
/**
 * Default layout — resolves theme header/footer by site ID.
 * Direct imports ensure SSR compatibility with Nuxt auto-imports.
 */
import CimaHeader from '~/components/themes/cima/CimaHeader.vue'
import CimaFooter from '~/components/themes/cima/CimaFooter.vue'
import SiteHeader from '~/components/site/SiteHeader.vue'
import SiteFooter from '~/components/site/SiteFooter.vue'

const { siteId } = useSite()

const headerComponent = computed(() => siteId.value === 'cima' ? CimaHeader : SiteHeader)
const footerComponent = computed(() => siteId.value === 'cima' ? CimaFooter : SiteFooter)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
    <!-- Skip to content link for keyboard navigation -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      Saltar al contenido principal
    </a>

    <!-- Theme-resolved Header -->
    <component :is="headerComponent" />

    <!-- Main content -->
    <main id="main-content" role="main" class="flex-1">
      <slot />
    </main>

    <!-- Theme-resolved Footer -->
    <component :is="footerComponent" />
  </div>
</template>
