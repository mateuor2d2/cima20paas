<script setup>
const { config } = useSite()
const footerLinks = computed(() => config.value?.footer?.links || [])
const footerText = computed(() => config.value?.footer?.text || '')
</script>

<template>
  <footer role="contentinfo" class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
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
