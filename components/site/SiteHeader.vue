<script setup>
const { config, siteId } = useSite()
const navItems = computed(() => config.value?.navigation || [])
</script>

<template>
  <header class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
    <UContainer class="flex items-center justify-between h-16">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-xl font-bold text-primary">{{ config?.name || 'CIMA' }}</span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-6">
        <template v-for="item in navItems" :key="item.to">
          <UDropdownMenu v-if="item.children?.length" :items="item.children.map(c => ({ label: c.label, to: c.to }))">
            <UButton variant="ghost" color="neutral" :trailing-icon="'i-lucide-chevron-down'">
              {{ item.label }}
            </UButton>
          </UDropdownMenu>
          <NuxtLink v-else :to="item.to" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
      <UButton icon="i-lucide-menu" variant="ghost" color="neutral" class="md:hidden" />
    </UContainer>
  </header>
</template>
