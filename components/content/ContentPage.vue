<script setup>
const props = defineProps({
  page: { type: Object, required: true }
})
</script>

<template>
  <div class="prose dark:prose-invert max-w-none">
    <h1>{{ page.title }}</h1>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
