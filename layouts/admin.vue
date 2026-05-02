<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const sidebarItems = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/admin' },
  { label: 'Páginas', icon: 'i-heroicons-document-text', to: '/admin/pages' },
  { label: 'Posts', icon: 'i-heroicons-newspaper', to: '/admin/posts' },
  { label: 'Configuración', icon: 'i-heroicons-cog-6-tooth', to: '/admin/config' },
]

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function isActive(path: string) {
  return route.path === path
}

function goBackToSite() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-200 lg:transform-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-primary" />
          <span class="text-lg font-bold">CIMA Admin</span>
        </NuxtLink>
        <button class="lg:hidden" @click="sidebarOpen = false">
          <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>
      </div>

      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in sidebarItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-primary/10 text-primary'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
          ]"
          @click="sidebarOpen = false"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800">
        <button
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full transition-colors"
          @click="goBackToSite"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          Volver al sitio
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header class="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-4 lg:px-8">
        <button class="lg:hidden mr-4" @click="toggleSidebar">
          <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
        </button>
        <div class="flex-1" />
        <div class="flex items-center gap-3">
          <span class="text-sm text-neutral-500 dark:text-neutral-400">Panel de Administración</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
