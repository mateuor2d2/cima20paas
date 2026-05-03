<script setup lang="ts">
/**
 * SiteServiceIcon — Reusable service card with icon, title, description, and hover effects.
 */
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="saas-card group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 md:p-8 cursor-default">
    <!-- Icon -->
    <div class="saas-service-icon w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-5 text-primary-600 dark:text-primary-400">
      <UIcon :name="icon" class="w-6 h-6" />
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
