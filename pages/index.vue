<script setup>
const { siteId, config } = useSite()

const { data: homepage } = await useAsyncData(`homepage-${siteId.value}`, () => {
  return queryCollection('pages')
    .where('site', '=', siteId.value)
    .where('path', 'LIKE', '%/index%')
    .first()
})

const { data: latestPosts } = await useAsyncData(`latest-posts-${siteId.value}`, () => {
  return queryCollection('posts')
    .where('site', '=', siteId.value)
    .order('date', 'DESC')
    .limit(3)
    .all()
})

useSeoMeta({
  title: config.value?.name || 'CIMA',
  description: config.value?.tagline || ''
})
</script>

<template>
  <div>
    <SiteHero v-if="homepage?.hero" :page="homepage" />
    
    <UContainer class="py-12">
      <ContentPage v-if="homepage && !homepage.hero" :page="homepage" />
      <ContentRenderer v-else-if="homepage" :value="homepage" />
      
      <section v-if="latestPosts?.length" class="py-12">
        <h2 class="text-2xl font-bold mb-6">Últimas noticias</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContentPost v-for="post in latestPosts" :key="post.path" :post="post" />
        </div>
      </section>
    </UContainer>
  </div>
</template>
