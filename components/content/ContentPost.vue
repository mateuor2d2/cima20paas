<script setup>
const props = defineProps({
  post: { type: Object, required: true }
})
</script>

<template>
  <UCard class="h-full">
    <NuxtLink :to="post.path" class="block">
      <NuxtImg v-if="post.image" :src="post.image" :alt="post.title" width="400" height="192" format="webp" quality="75" loading="lazy" class="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 class="text-lg font-semibold mb-2 hover:text-primary transition-colors">{{ post.title }}</h3>
      <p v-if="post.description" class="text-sm text-neutral-500 line-clamp-3">{{ post.description }}</p>
      <div class="flex items-center gap-2 mt-4 text-xs text-neutral-400">
        <span v-if="post.date">{{ new Date(post.date).toLocaleDateString() }}</span>
        <span v-if="post.author">· {{ post.author }}</span>
      </div>
    </NuxtLink>
  </UCard>
</template>
