<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    class="flex flex-col justify-center w-full h-full p-16"
    style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #172554 100%);"
  >
    <!-- Logo area -->
    <div class="flex items-center gap-4 mb-8">
      <div
        class="flex items-center justify-center w-20 h-20 rounded-xl"
        style="background: rgba(255, 255, 255, 0.15);"
      >
        <span class="text-4xl font-bold text-white">C</span>
      </div>
      <div>
        <div class="text-2xl font-bold text-white">CIMA 20</div>
        <div class="text-base text-blue-200">Seguretat · Prevenció · Medi Ambient · Qualitat</div>
      </div>
    </div>

    <!-- Main title -->
    <div class="flex-1 flex flex-col justify-center">
      <h1 class="text-5xl font-bold text-white leading-tight mb-4" style="max-width: 900px;">
        {{ title }}
      </h1>
      <p v-if="description" class="text-2xl text-blue-100 leading-relaxed" style="max-width: 800px;">
        {{ description }}
      </p>
    </div>

    <!-- Bottom bar -->
    <div class="flex items-center gap-2 mt-8">
      <div class="h-1 w-24 rounded" style="background: rgba(255, 255, 255, 0.4);"></div>
      <span class="text-lg text-blue-200 ml-2">cima20.com</span>
    </div>
  </div>
</template>
