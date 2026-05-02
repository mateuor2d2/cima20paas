<script setup lang="ts">
definePageMeta({
  layout: false,
})

const runtimeConfig = useRuntimeConfig()
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })

    if (response.success) {
      const authCookie = useCookie('admin-auth', {
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax',
      })
      authCookie.value = 'true'
      navigateTo('/admin')
    } else {
      error.value = 'Contraseña incorrecta'
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
    <div class="w-full max-w-sm">
      <div class="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
        <div class="text-center mb-8">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 class="text-2xl font-bold">CIMA Admin</h1>
          <p class="text-sm text-neutral-500 mt-1">Introduce la contraseña de acceso</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <UInput
              v-model="password"
              type="password"
              placeholder="Contraseña"
              size="lg"
              :disabled="loading"
              autofocus
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
          >
            Entrar
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-neutral-500 hover:text-primary transition-colors">
            ← Volver al sitio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
