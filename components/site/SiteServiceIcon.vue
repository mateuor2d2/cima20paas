<script setup lang="ts">
/**
 * SiteServiceIcon — Reusable service card with icon, title, description, and refined hover effects.
 */
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="saas-card group rounded-2xl border border-neutral-200/80 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-7 md:p-8 cursor-default">
    <!-- Icon -->
    <div class="saas-service-icon w-13 h-13 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
      <UIcon :name="icon" class="w-6 h-6" />
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
