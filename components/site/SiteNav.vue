<script setup>
const { config } = useSite()
const navItems = computed(() => config.value?.navigation || [])
</script>

<template>
  <UNavigationMenu orientation="vertical" class="w-64 shrink-0" :items="navItems.map(item => ({
    label: item.label,
    to: item.to,
    icon: item.icon,
    children: item.children?.map(c => ({ label: c.label, to: c.to }))
  }))" />
</template>
