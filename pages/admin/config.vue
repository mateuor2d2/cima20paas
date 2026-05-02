<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { siteId } = useSite()

// Load current config
const { data: siteConfig, refresh: refreshConfig } = await useAsyncData(`admin-config-${siteId.value}`, () => {
  return queryCollection('site_config').where('stem', '=', `sites/${siteId.value}/config`).first()
})

// Form state
const form = ref({
  name: siteConfig.value?.name || '',
  tagline: siteConfig.value?.tagline || '',
  theme: siteConfig.value?.theme || 'default',
  primaryColor: siteConfig.value?.primaryColor || 'blue',
  navigation: siteConfig.value?.navigation || [],
  footer: siteConfig.value?.footer || { text: '', links: [] },
})

const saving = ref(false)
const message = ref('')

watch(siteConfig, (val) => {
  if (val) {
    form.value = {
      name: val.name || '',
      tagline: val.tagline || '',
      theme: val.theme || 'default',
      primaryColor: val.primaryColor || 'blue',
      navigation: val.navigation || [],
      footer: val.footer || { text: '', links: [] },
    }
  }
})

async function saveConfig() {
  saving.value = true
  message.value = ''
  try {
    await $fetch('/api/admin/config', {
      method: 'PUT',
      body: {
        siteId: siteId.value,
        config: form.value,
      },
    })
    message.value = 'Configuración guardada correctamente'
    await refreshConfig()
  } catch (e: any) {
    message.value = 'Error: ' + (e.data?.message || e.message)
  } finally {
    saving.value = false
  }
}

function addNavItem() {
  form.value.navigation.push({ label: '', to: '' })
}

function removeNavItem(index: number) {
  form.value.navigation.splice(index, 1)
}

function addFooterLink() {
  if (!form.value.footer.links) form.value.footer.links = []
  form.value.footer.links.push({ label: '', to: '' })
}

function removeFooterLink(index: number) {
  form.value.footer.links?.splice(index, 1)
}

useSeoMeta({
  title: 'Admin - Configuración',
  description: 'Configuración del sitio',
})
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Configuración</h1>
    </div>

    <form @submit.prevent="saveConfig" class="space-y-6 max-w-2xl">
      <!-- General -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 class="text-lg font-semibold mb-4">General</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del sitio</label>
            <UInput v-model="form.name" placeholder="Nombre del sitio" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tagline</label>
            <UInput v-model="form.tagline" placeholder="Descripción corta" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tema</label>
              <UInput v-model="form.theme" placeholder="default" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Color primario</label>
              <UInput v-model="form.primaryColor" placeholder="blue" />
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Navegación</h2>
          <UButton size="xs" variant="outline" @click="addNavItem">+ Añadir item</UButton>
        </div>
        <div class="space-y-3">
          <div v-for="(item, i) in form.navigation" :key="i" class="flex items-center gap-2">
            <UInput v-model="item.label" placeholder="Label" class="flex-1" />
            <UInput v-model="item.to" placeholder="/ruta" class="flex-1" />
            <button type="button" class="text-red-500 hover:text-red-700 p-1" @click="removeNavItem(i)">
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </button>
          </div>
          <p v-if="!form.navigation.length" class="text-sm text-neutral-400">No hay items de navegación</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 class="text-lg font-semibold mb-4">Footer</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Texto</label>
            <UInput v-model="form.footer.text" placeholder="© 2024 Empresa" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium">Links</label>
              <UButton size="xs" variant="outline" @click="addFooterLink">+ Añadir link</UButton>
            </div>
            <div class="space-y-2">
              <div v-for="(link, i) in form.footer.links" :key="i" class="flex items-center gap-2">
                <UInput v-model="link.label" placeholder="Label" class="flex-1" />
                <UInput v-model="link.to" placeholder="/ruta" class="flex-1" />
                <button type="button" class="text-red-500 hover:text-red-700 p-1" @click="removeFooterLink(i)">
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save -->
      <div class="flex items-center gap-4">
        <UButton type="submit" :loading="saving" size="lg">Guardar configuración</UButton>
        <p v-if="message" :class="message.startsWith('Error') ? 'text-red-500' : 'text-green-600'" class="text-sm">
          {{ message }}
        </p>
      </div>
    </form>
  </div>
</template>
