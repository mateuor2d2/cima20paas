<script setup>
/**
 * SiteHeader — Base header component (fallback when no theme override exists).
 * Queries site config from Nuxt Content for navigation data.
 */
const { siteId } = useSite()

const { data: siteConfig } = await useAsyncData(`config-header-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const navItems = computed(() => siteConfig.value?.navigation || [])
const siteName = computed(() => siteConfig.value?.name || 'CIMA')
</script>

<template>
  <header role="banner" class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
    <UContainer class="flex items-center justify-between h-16">
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="CIMA 20 - Inicio">
        <span class="text-xl font-bold text-primary">{{ siteName }}</span>
      </NuxtLink>
      <nav aria-label="Navegación principal" class="hidden md:flex items-center gap-6">
        <template v-for="item in navItems" :key="item.to">
          <UDropdownMenu v-if="item.children?.length" :items="item.children.map(c => ({ label: c.label, to: c.to }))">
            <UButton variant="ghost" color="neutral" :trailing-icon="'i-lucide-chevron-down'" :aria-label="`${item.label} - submenú`">
              {{ item.label }}
            </UButton>
          </UDropdownMenu>
          <NuxtLink v-else :to="item.to" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
      <button type="button" class="md:hidden p-2" aria-label="Abrir menú de navegación">
        <UIcon name="i-lucide-menu" />
      </button>
    </UContainer>
  </header>
</template>
