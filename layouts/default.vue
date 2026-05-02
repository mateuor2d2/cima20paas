<script setup>
/**
 * Default layout — uses theme system to resolve header/footer/hero.
 * Falls back to base SiteHeader/SiteFooter/SiteHero when no theme override exists.
 */
const { component: headerComponent } = useThemeComponent('Header')
const { component: footerComponent } = useThemeComponent('Footer')
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
    <!-- Skip to content link for keyboard navigation -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      Saltar al contenido principal
    </a>

    <!-- Theme-resolved Header -->
    <component :is="headerComponent" v-if="headerComponent" />
    <SiteHeader v-else />

    <!-- Main content -->
    <main id="main-content" role="main" class="flex-1">
      <slot />
    </main>

    <!-- Theme-resolved Footer -->
    <component :is="footerComponent" v-if="footerComponent" />
    <SiteFooter v-else />
  </div>
</template>
