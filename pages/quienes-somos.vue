<script setup lang="ts">
import type { /* Astro/Slug route params */ } from 'vue-router'

const { siteId } = useSite()

const { data: page } = await useAsyncData('quienes-somos', () => {
  return queryCollection('pages').path(`/sites/${siteId.value}/pages/quienes-somos`).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página no encontrada' })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description
})

const team = [
  {
    section: 'Dirección',
    members: [
      { name: 'Mateu Oliver Montserrat', role: 'CEO', img: '/images/team/empleado_cima20-12.jpg' },
    ]
  },
  {
    section: 'Equipo Médico',
    members: [
      { name: 'Dra. Marta Pérez', role: 'Médico especialista en Medicina del Trabajo y Directora Sanitaria', img: '/images/team/empleado_cima20-9.jpg' },
      { name: 'María Bañegil', role: 'Enfermera especialista en Enfermería del Trabajo', img: '/images/team/empleado_cima20-8.jpg' },
      { name: 'Yohn Vélez', role: 'Médico reconocedor', img: '/images/team/silueta_hombre_cima20.png' },
      { name: 'Eduardo Oliveri', role: 'Conductor Unidad móvil del Área Médica', img: '/images/team/silueta_hombre_cima20.png' },
    ]
  },
  {
    section: 'Equipo Médico Administrativo',
    members: [
      { name: 'Mina Díaz', role: 'Coordinadora del área médica', img: '/images/team/empleado_cima20-4.jpg' },
      { name: 'Maribel Tomás', role: 'Auxiliar administrativa', img: '/images/team/empleado_cima20-5.jpg' },
    ]
  },
  {
    section: 'Equipo Técnico',
    members: [
      { name: 'Josep Bergas', role: 'Coordinador del Área Técnica y Técnico Superior en PRL', img: '/images/team/empleado_cima20-1.jpg' },
      { name: 'Paula Jiménez', role: 'Técnico superior en PRL', img: '/images/team/paula_jimenez.png' },
      { name: 'Antoni Rayo', role: 'Técnico superior en PRL', img: '/images/team/antoni_rayo.png' },
      { name: 'Juan Ripoll', role: 'Técnico superior en PRL', img: '/images/team/empleado_cima20-13.jpg' },
      { name: 'Sharon Shauer', role: 'Técnico superior en PRL', img: '/images/team/empleado_cima20-3.jpg' },
    ]
  },
  {
    section: 'Equipo de Laboratorio',
    members: [
      { name: 'Gisela Gumil', role: 'Técnica de laboratorio', img: '/images/team/empleado_cima20-6.jpg' },
      { name: 'María Elena', role: 'Técnica de laboratorio', img: '/images/team/silueta_mujer_cima20.jpg' },
      { name: 'José Lustre', role: 'Biólogo', img: '/images/team/silueta_hombre_cima20.png' },
    ]
  },
  {
    section: 'Administración y Contabilidad',
    members: [
      { name: 'Virginia Diaz', role: 'Administrativa y contable', img: '/images/team/empleado_cima20-2.jpg' },
    ]
  },
]
</script>

<template>
  <UContainer class="py-12">
    <article>
      <h1 class="text-4xl font-bold mb-4">{{ page?.title }}</h1>
      <p v-if="page?.description" class="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
        {{ page.description }}
      </p>

      <!-- Render markdown content (historia, valores, calidad) -->
      <div v-if="page?.body" class="prose dark:prose-invert max-w-none mb-12">
        <ContentRenderer :value="page" />
      </div>

      <!-- Team grid with photos -->
      <section class="mt-16">
        <h2 class="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">El equipo</h2>

        <div v-for="group in team" :key="group.section" class="mb-12">
          <h3 class="text-xl font-semibold mb-6 pb-2 border-b-2 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
            {{ group.section }}
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div
              v-for="member in group.members"
              :key="member.name"
              class="flex flex-col items-center text-center p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow duration-300"
            >
              <NuxtImg
                :src="member.img"
                :alt="`Foto de ${member.name}`"
                width="160"
                height="160"
                class="w-32 h-32 rounded-full object-cover mb-3 border-2 border-neutral-200 dark:border-neutral-600"
                loading="lazy"
                format="webp"
                quality="80"
              />
              <h4 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{{ member.name }}</h4>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  </UContainer>
</template>
