<script setup>
const { siteId } = useSite()
const route = useRoute()
const slug = route.params.slug

const { data: page } = await useAsyncData(`page-${siteId.value}-${slug}`, () => {
  return queryCollection('pages')
    .where('site', '=', siteId.value)
    .where('path', 'LIKE', `%${slug}%`)
    .first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <UContainer class="py-12">
    <ContentPage v-if="page" :page="page" />
  </UContainer>
</template>
