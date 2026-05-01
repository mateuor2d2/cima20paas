
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
    <header class="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-xl font-bold text-primary">CIMA 20</span>
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/quienes-somos" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Quienes somos</NuxtLink>
            <div class="relative group">
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors cursor-pointer">Servicios</span>
              <div class="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div class="py-2">
                  <NuxtLink to="/asesoria" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Empresa Saludable</NuxtLink>
                  <NuxtLink to="/prevencion" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Prevención</NuxtLink>
                  <NuxtLink to="/reconocimientos-medicos" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Reconocimientos Médicos</NuxtLink>
                  <NuxtLink to="/consulta-enfermeria" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Enfermería Personalizada</NuxtLink>
                  <NuxtLink to="/vacunacion" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Vacunación</NuxtLink>
                  <NuxtLink to="/laboratorio" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Laboratorio</NuxtLink>
                  <NuxtLink to="/plan-sanitario-legionella" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Plan Sanitario Legionella</NuxtLink>
                  <NuxtLink to="/bioimpedancia" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Bioimpedancia</NuxtLink>
                  <NuxtLink to="/gestion-normativas-iso" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Gestión Normativas ISO</NuxtLink>
                  <NuxtLink to="/prevencion-desperdicio-alimentario" class="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-primary">Prevención Desperdicio Alim.</NuxtLink>
                </div>
              </div>
            </div>
            <NuxtLink to="/cursos" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Cursos</NuxtLink>
            <NuxtLink to="/unidades-moviles" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Unidades Móviles</NuxtLink>
            <NuxtLink to="/blog" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Actualidad</NuxtLink>
            <NuxtLink to="/galeria" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Galería</NuxtLink>
            <NuxtLink to="/contacto" class="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">Contacto</NuxtLink>
          </nav>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-neutral-500">© PROJECTES TÈCNICS SL - Todos los derechos reservados</p>
          <nav class="flex items-center gap-4 flex-wrap">
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
