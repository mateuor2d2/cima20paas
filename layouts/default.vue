
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
    <header class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-primary">CIMA</span>
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Inicio</NuxtLink>
          <NuxtLink to="/servicios" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Servicios</NuxtLink>
          <NuxtLink to="/sobre-nosotros" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Sobre Nosotros</NuxtLink>
          <NuxtLink to="/contacto" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Contacto</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-neutral-500">© PROJECTES TÈCNICS SL - Todos los derechos reservados</p>
          <nav class="flex items-center gap-4">
            <NuxtLink to="/aviso-legal" class="text-sm text-neutral-500 hover:text-primary transition-colors">Aviso Legal</NuxtLink>
            <NuxtLink to="/privacidad" class="text-sm text-neutral-500 hover:text-primary transition-colors">Privacidad</NuxtLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
