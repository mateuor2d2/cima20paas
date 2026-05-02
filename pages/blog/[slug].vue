
<script setup>
const { siteId } = useSite()
const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`post-${siteId.value}-${slug}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .where('path', 'LIKE', `%${slug}%`)
    .first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post Not Found' })
}

useSeoMeta({
  title: post.value?.title || 'Blog | PROJECTES TÈCNICS SL',
  description: post.value?.description || 'Noticias y artículos sobre prevención de riesgos laborales y salud ocupacional'
})
</script>

<template>
  <UContainer class="py-12 max-w-3xl">
    <article class="prose dark:prose-invert max-w-none">
      <h1>{{ post?.title }}</h1>
      <div class="flex items-center gap-2 text-sm text-neutral-500 mb-8">
        <span v-if="post?.date">{{ new Date(post.date).toLocaleDateString() }}</span>
        <span v-if="post?.author">· {{ post.author }}</span>
      </div>
      <ContentRenderer v-if="post" :value="post" />
    </article>
  </UContainer>
</template>
