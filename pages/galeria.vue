<script setup lang="ts">
const { siteId } = useSite()
const { t } = useI18n()

const { data: page } = await useAsyncData('galeria', () => {
  return queryCollection('pages').path(`/sites/${siteId.value}/pages/galeria`).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada' })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description
})

const photos = [
  { src: '/images/gallery/cima20-entrada-51.jpg', alt: 'Entrada de CIMA 20' },
  { src: '/images/gallery/cima20-cartel-oficina52.jpg', alt: 'Cartel de la oficina' },
  { src: '/images/gallery/cima20-laboratorio46.jpg', alt: 'Laboratorio CIMA 20' },
  { src: '/images/gallery/cima20-laboratorio-49.jpg', alt: 'Interior del laboratorio' },
  { src: '/images/gallery/cima20-detalle-laboratorio-44.jpg', alt: 'Detalle del laboratorio' },
  { src: '/images/gallery/cima20-detalle-trabajo-28.jpg', alt: 'Detalle de trabajo' },
  { src: '/images/gallery/cima20-detalle_uniforme_45.jpg', alt: 'Detalle uniforme de trabajo' },
  { src: '/images/gallery/cima20_empleados-20.jpg', alt: 'Equipo CIMA 20' },
  { src: '/images/gallery/cima20_empleados-21.jpg', alt: 'Equipo CIMA 20 trabajando' },
  { src: '/images/gallery/cima20_empleados-23.jpg', alt: 'Equipo CIMA 20' },
]

// Lightbox state
const selected = ref<number | null>(null)

function openPhoto(index: number) {
  selected.value = index
}

function closePhoto() {
  selected.value = null
}

function prevPhoto() {
  if (selected.value !== null) {
    selected.value = (selected.value - 1 + photos.length) % photos.length
  }
}

function nextPhoto() {
  if (selected.value !== null) {
    selected.value = (selected.value + 1) % photos.length
  }
}

function onKeydown(e: KeyboardEvent) {
  if (selected.value === null) return
  if (e.key === 'Escape') closePhoto()
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <UContainer class="py-12">
    <article>
      <h1 class="text-4xl font-bold mb-4">{{ page?.title }}</h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-300 mb-10">
        {{ page?.description }}
      </p>

      <!-- Photo grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          v-for="(photo, i) in photos"
          :key="i"
          class="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 aspect-[4/3] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          @click="openPhoto(i)"
          :aria-label="photo.alt"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            format="webp"
            quality="80"
            width="600"
            height="450"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span class="text-white text-sm font-medium">{{ photo.alt }}</span>
          </div>
        </button>
      </div>
    </article>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="selected !== null"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="closePhoto"
        role="dialog"
        aria-modal="true"
        :aria-label="photos[selected].alt"
      >
        <!-- Close button -->
        <button
          @click="closePhoto"
          class="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          aria-label="Cerrar"
        >
          <UIcon name="i-lucide-x" class="w-8 h-8" />
        </button>

        <!-- Prev -->
        <button
          @click="prevPhoto"
          class="absolute left-4 text-white/80 hover:text-white p-2 z-10"
          aria-label="Anterior"
        >
          <UIcon name="i-lucide-chevron-left" class="w-8 h-8" />
        </button>

        <!-- Image -->
        <NuxtImg
          :src="photos[selected].src"
          :alt="photos[selected].alt"
          class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          format="webp"
          quality="90"
          width="1200"
          height="900"
        />

        <!-- Next -->
        <button
          @click="nextPhoto"
          class="absolute right-4 text-white/80 hover:text-white p-2 z-10"
          aria-label="Siguiente"
        >
          <UIcon name="i-lucide-chevron-right" class="w-8 h-8" />
        </button>
      </div>
    </Teleport>
  </UContainer>
</template>
