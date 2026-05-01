<script setup>
const props = defineProps({
  page: { type: Object, required: true }
})
</script>

<template>
  <section class="relative bg-primary-600 dark:bg-primary-800 text-white py-20">
    <UContainer>
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ page.title }}</h1>
        <p v-if="page.description" class="text-lg text-primary-100">{{ page.description }}</p>
      </div>
    </UContainer>
  </section>
</template>
