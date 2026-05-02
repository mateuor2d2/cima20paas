<script setup>
const { locales: availableLocales, locale: currentLocale } = useI18n()
const localePath = useLocalePath()
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

    <header role="banner" class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2" aria-label="PROJECTES TÈCNICS SL - Inicio">
            <span class="text-xl font-bold text-primary">CIMA 20</span>
          </NuxtLink>
          <nav aria-label="Navegación principal" class="hidden md:flex items-center gap-6">
            <NuxtLink to="/quienes-somos" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Quienes somos</NuxtLink>
            <div class="relative group">
              <button
                type="button"
                aria-expanded="false"
                aria-haspopup="true"
                class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
              >
                Servicios
                <span aria-hidden="true" class="text-xs">▾</span>
              </button>
              <div class="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50" role="menu">
                <div class="py-2">
                  <NuxtLink to="/asesoria" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Empresa Saludable</NuxtLink>
                  <NuxtLink to="/prevencion" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Prevención</NuxtLink>
                  <NuxtLink to="/reconocimientos-medicos" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Reconocimientos Médicos</NuxtLink>
                  <NuxtLink to="/consulta-enfermeria" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Enfermería Personalizada</NuxtLink>
                  <NuxtLink to="/vacunacion" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Vacunación</NuxtLink>
                  <NuxtLink to="/laboratorio" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Laboratorio</NuxtLink>
                  <NuxtLink to="/plan-sanitario-legionella" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Plan Sanitario Legionella</NuxtLink>
                  <NuxtLink to="/bioimpedancia" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Bioimpedancia</NuxtLink>
                  <NuxtLink to="/gestion-normativas-iso" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Gestión Normativas ISO</NuxtLink>
                  <NuxtLink to="/prevencion-desperdicio-alimentario" role="menuitem" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Prevención Desperdicio Alim.</NuxtLink>
                </div>
              </div>
            </div>
            <NuxtLink to="/cursos" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Cursos</NuxtLink>
            <NuxtLink to="/unidades-moviles" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Unidades Móviles</NuxtLink>
            <NuxtLink to="/blog" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Actualidad</NuxtLink>
            <NuxtLink to="/galeria" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Galería</NuxtLink>
            <NuxtLink to="/contacto" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Contacto</NuxtLink>
            
            <!-- Language switcher -->
            <div class="flex items-center gap-2" role="group" aria-label="Selector de idioma">
              <NuxtLink
                v-for="loc in availableLocales"
                :key="loc.code"
                :to="localePath(loc.code)"
                :aria-label="`Cambiar idioma a ${loc.name}`"
                :aria-current="currentLocale === loc.code ? 'true' : undefined"
                :class="[
                  'text-xs px-2 py-1 rounded transition-colors',
                  currentLocale === loc.code
                    ? 'bg-primary text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-primary'
                ]"
              >
                {{ loc.code.toUpperCase() }}
              </NuxtLink>
            </div>
          </nav>
          <!-- Mobile menu button -->
          <button
            type="button"
            class="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
            aria-label="Abrir menú de navegación"
          >
            <span class="text-xl" aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </header>
    <main id="main-content" role="main" class="flex-1">
      <slot />
    </main>
    <footer role="contentinfo" class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-neutral-500">© PROJECTES TÈCNICS SL - Todos los derechos reservados</p>
          <nav aria-label="Enlaces del pie de página" class="flex items-center gap-4 flex-wrap">
            <NuxtLink to="/aviso-legal" class="text-sm text-neutral-500 hover:text-primary transition-colors">Aviso Legal</NuxtLink>
            <NuxtLink to="/privacidad" class="text-sm text-neutral-500 hover:text-primary transition-colors">Privacidad</NuxtLink>
            <NuxtLink to="/politica-cookies" class="text-sm text-neutral-500 hover:text-primary transition-colors">Cookies</NuxtLink>
            <NuxtLink to="/condiciones-legales" class="text-sm text-neutral-500 hover:text-primary transition-colors">Condiciones Legales</NuxtLink>
            <NuxtLink to="/compromiso-proteccion-datos" class="text-sm text-neutral-500 hover:text-primary transition-colors">Protección de Datos</NuxtLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
