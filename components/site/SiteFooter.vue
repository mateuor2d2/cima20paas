<script setup>
/**
 * SiteFooter — Base footer component (fallback when no theme override exists).
 * Queries site config from Nuxt Content for footer data.
 */
const { siteId } = useSite()

const { data: siteConfig } = await useAsyncData(`config-footer-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const footerLinks = computed(() => siteConfig.value?.footer?.links || [])
const footerText = computed(() => siteConfig.value?.footer?.text || '')
</script>

<template>
  <footer role="contentinfo" class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:bg-neutral-800 mt-auto">
    <UContainer class="py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-neutral-500">{{ footerText }}</p>
        <nav v-if="footerLinks.length" aria-label="Enlaces del pie de página" class="flex items-center gap-4">
          <NuxtLink v-for="link in footerLinks" :key="link.to" :to="link.to" class="text-sm text-neutral-500 hover:text-primary transition-colors">
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </footer>
</template>
