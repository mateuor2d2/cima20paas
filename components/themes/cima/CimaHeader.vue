<script setup>
/**
 * CimaHeader — Professional sticky header with backdrop blur.
 * Features: PT badge, brand name + tagline, desktop nav with hover dropdowns, mobile slide-over drawer, dark/light toggle.
 */
const { siteId } = useSite()
const { locale: currentLocale, locales: availableLocales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const { data: siteConfig } = await useAsyncData(`config-header-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

const navItems = computed(() => siteConfig.value?.navigation || [])
const siteName = computed(() => siteConfig.value?.name || 'CIMA 20')
const mobileNavItems = computed(() => {
  const items = /** @type {Array<{label:string,to:string,isChild:boolean}>} */ ([])
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

// Track scroll for header background enhancement
if (import.meta.client) {
  const handleScroll = () => { scrolled.value = window.scrollY > 10 }
  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
}

const route = useRoute()
watch(() => route.path, () => { mobileMenuOpen.value = false })
</script>

<template>
  <header
    role="banner"
    :class="[
      'sticky top-0 z-50 transition-all duration-500 ease-out',
      scrolled
        ? 'saas-header-blur bg-white/92 dark:bg-neutral-900/92 shadow-lg shadow-neutral-900/5 border-b border-neutral-200/50 dark:border-neutral-700/50'
        : 'bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-700'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-[72px]">
        <!-- Logo / Brand -->
        <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="CIMA 20 - Inicio">
          <NuxtImg
            src="/logo.png"
            alt="CIMA 20"
            class="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            format="webp"
            quality="90"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav aria-label="Navegación principal" class="hidden lg:flex items-center gap-1">
          <template v-for="item in navItems" :key="item.to">
            <!-- Dropdown for items with children -->
            <div v-if="item.children?.length" class="relative group/dropdown">
              <button
                type="button"
                :aria-expanded="false"
                aria-haspopup="true"
                class="px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer flex items-center gap-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {{ item.label }}
                <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 group-hover/dropdown:rotate-180" aria-hidden="true" />
              </button>
              <!-- Dropdown panel -->
              <div class="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 ease-out z-50">
                <div class="bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-600 rounded-xl shadow-xl shadow-neutral-900/8 py-2 ring-1 ring-black/5">
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-150"
                  >
                    <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400" />
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Regular link -->
            <NuxtLink
              v-else
              :to="item.to"
              class="px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {{ item.label }}
            </NuxtLink>
          </template>

          <!-- Right side controls -->
          <div class="ml-3 flex items-center gap-1 pl-4 border-l border-neutral-200 dark:border-neutral-700">
            <!-- Language Switcher -->
            <div class="flex items-center gap-1" role="group" aria-label="Selector de idioma">
              <NuxtLink
                v-for="loc in availableLocales"
                :key="loc.code"
                :to="switchLocalePath(loc.code)"
                :aria-label="`Cambiar idioma a ${loc.name}`"
                :aria-current="currentLocale === loc.code ? 'true' : undefined"
                :class="[
                  'text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-200',
                  currentLocale === loc.code
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800'
                    : 'text-neutral-500 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                ]"
              >
                {{ loc.code.toUpperCase() }}
              </NuxtLink>
            </div>

            <!-- Color Mode Toggle -->
            <UColorModeButton />

            <!-- Contact CTA -->
            <UButton
              to="/contacto"
              size="sm"
              icon="i-lucide-phone"
              class="ml-1"
            >
              Contactar
            </UButton>
          </div>
        </nav>

        <!-- Mobile: right side controls -->
        <div class="lg:hidden flex items-center gap-2">
          <!-- Mobile Color Mode Toggle -->
          <UColorModeButton />

          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="p-2 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
            :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'"
            :aria-expanded="mobileMenuOpen"
            @click="toggleMobile"
          >
            <div class="relative w-6 h-6">
              <UIcon
                name="i-lucide-menu"
                :class="[
                  'absolute inset-0 w-6 h-6 transition-all duration-300',
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                ]"
              />
              <UIcon
                name="i-lucide-x"
                :class="[
                  'absolute inset-0 w-6 h-6 transition-all duration-300',
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                ]"
              />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition
      enter-active-class="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-250 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-neutral-200/60 dark:border-neutral-700 bg-white/98 dark:bg-neutral-900/98 saas-header-blur">
        <nav aria-label="Menú móvil" class="max-w-7xl mx-auto px-4 py-5 space-y-1">
          <NuxtLink
            v-for="item in mobileNavItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              item.isChild
                ? 'pl-10 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                : 'text-neutral-800 dark:text-neutral-100 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            ]"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Mobile CTA -->
          <div class="pt-4 mt-3">
            <UButton to="/contacto" block size="lg" icon="i-lucide-phone">
              Contactar
            </UButton>
          </div>

          <!-- Mobile language + theme switcher -->
          <div class="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between" role="group" aria-label="Selector de idioma">
            <div class="flex gap-2">
              <NuxtLink
                v-for="loc in availableLocales"
                :key="loc.code"
                :to="switchLocalePath(loc.code)"
                :class="[
                  'text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200',
                  currentLocale === loc.code
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800'
                    : 'text-neutral-500 dark:text-neutral-300 hover:text-blue-600 dark:hover:bg-neutral-50 dark:hover:bg-neutral-800'
                ]"
              >
                {{ loc.name }}
              </NuxtLink>
            </div>
            <UColorModeButton />
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
