<script setup>
const { siteId } = useSite()

const { data: posts } = await useAsyncData(`posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .all()
})

useSeoMeta({
  title: 'Blog',
  description: 'Últimas noticias y artículos'
})
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>
    <div v-if="!posts?.length" class="text-neutral-500">
      No hay artículos publicados todavía.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContentPost v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </UContainer>
</template>
