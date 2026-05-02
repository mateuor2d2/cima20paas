<script setup>
/**
 * CimaHeader — Theme-specific header for CIMA20 (PROJECTES TÈCNICS SL).
 * Enhanced with brand styling, mobile drawer, and dynamic navigation from config.
 */
const { siteId } = useSite()
const { locale: currentLocale, locales: availableLocales } = useI18n()
const localePath = useLocalePath()
const mobileMenuOpen = ref(false)

const { data: siteConfig } = await useAsyncData(`config-header-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const navItems = computed(() => siteConfig.value?.navigation || [])
const siteName = computed(() => siteConfig.value?.name || 'CIMA 20')
const mobileNavItems = computed(() => {
  // Flatten children for mobile menu
  const items: Array<{ label: string; to: string; isChild: boolean }> = []
  for (const item of navItems.value) {
    items.push({ label: item.label, to: item.to, isChild: false })
    if (item.children?.length) {
      for (const child of item.children) {
        items.push({ label: child.label, to: child.to, isChild: true })
      }
    }
  }
  return items
})

function toggleMobile() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <header role="banner" class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo / Brand -->
        <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="PROJECTES TÈCNICS SL - Inicio">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-primary-700 transition-colors">
            PT
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold text-neutral-900 dark:text-white leading-tight">{{ siteName }}</span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">Seguretat · Prevenció · Medi Ambient · Qualitat</span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav aria-label="Navegación principal" class="hidden lg:flex items-center gap-1">
          <template v-for="item in navItems" :key="item.to">
            <!-- Dropdown for items with children -->
            <div v-if="item.children?.length" class="relative group">
              <button
                type="button"
                :aria-expanded="false"
                aria-haspopup="true"
                class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer flex items-center gap-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {{ item.label }}
                <UIcon name="i-lucide-chevron-down" class="w-3 h-3 transition-transform group-hover:rotate-180" aria-hidden="true" />
              </button>
              <div class="absolute left-0 top-full pt-1 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-2">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Regular link -->
            <NuxtLink
              v-else
              :to="item.to"
              class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {{ item.label }}
            </NuxtLink>
          </template>

          <!-- Language Switcher -->
          <div class="ml-2 flex items-center gap-1 pl-3 border-l border-neutral-200 dark:border-neutral-700" role="group" aria-label="Selector de idioma">
            <NuxtLink
              v-for="loc in availableLocales"
              :key="loc.code"
              :to="localePath(loc.code)"
              :aria-label="`Cambiar idioma a ${loc.name}`"
              :aria-current="currentLocale === loc.code ? 'true' : undefined"
              :class="[
                'text-xs px-2 py-1 rounded-md font-medium transition-colors',
                currentLocale === loc.code
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              ]"
            >
              {{ loc.code.toUpperCase() }}
            </NuxtLink>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="lg:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800"
          :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'"
          :aria-expanded="mobileMenuOpen"
          @click="toggleMobile"
        >
          <UIcon v-if="!mobileMenuOpen" name="i-lucide-menu" class="w-6 h-6" />
          <UIcon v-else name="i-lucide-x" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <nav aria-label="Menú móvil" class="max-w-7xl mx-auto px-4 py-4 space-y-1">
          <NuxtLink
            v-for="item in mobileNavItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              item.isChild
                ? 'pl-8 text-neutral-500 dark:text-neutral-400 hover:text-primary-600'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            ]"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Mobile language switcher -->
          <div class="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-700 flex gap-2" role="group" aria-label="Selector de idioma">
            <NuxtLink
              v-for="loc in availableLocales"
              :key="loc.code"
              :to="localePath(loc.code)"
              :class="[
                'text-xs px-3 py-1.5 rounded-md font-medium transition-colors',
                currentLocale === loc.code
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              ]"
            >
              {{ loc.name }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
