<script setup>
const { siteId } = useSite()

// Test 1: Query all pages
const { data: allPages } = await useAsyncData('test-all-pages', () => {
  return queryCollection('pages').all()
})

// Test 2: Query by path
const { data: homePage } = await useAsyncData('test-home', () => {
  return queryCollection('pages').path('/').first()
})

// Test 3: Query site config
const { data: siteConfig } = await useAsyncData('test-config', () => {
  return queryCollection('site_config').all()
})
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Test Nuxt Content</h1>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Site ID: {{ siteId }}</h2>
    </div>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">All Pages ({{ allPages?.length || 0 }})</h2>
      <pre v-if="allPages" class="bg-gray-100 p-4 rounded overflow-auto text-sm">{{ JSON.stringify(allPages, null, 2) }}</pre>
      <p v-else class="text-red-500">No pages found</p>
    </div>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Home Page</h2>
      <pre v-if="homePage" class="bg-gray-100 p-4 rounded overflow-auto text-sm">{{ JSON.stringify(homePage, null, 2) }}</pre>
      <p v-else class="text-red-500">Home page not found</p>
    </div>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Site Config</h2>
      <pre v-if="siteConfig" class="bg-gray-100 p-4 rounded overflow-auto text-sm">{{ JSON.stringify(siteConfig, null, 2) }}</pre>
      <p v-else class="text-red-500">Config not found</p>
    </div>
  </UContainer>
</template>
