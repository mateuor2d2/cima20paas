
<script setup>
const { siteId } = useSite()

// Simplified - just test if basic rendering works
const title = 'PROJECTES TÈCNICS SL'
const description = 'Seguridad, Prevención, Medio Ambiente y Calidad'

useSeoMeta({
  title: title,
  description: description
})
</script>

<template>
  <div>
    <UContainer class="py-12">
      <h1 class="text-4xl font-bold mb-4">{{ title }}</h1>
      <p class="text-lg text-neutral-600 mb-8">{{ description }}</p>
      
      <div class="prose dark:prose-invert max-w-none">
        <h2>Bienvenidos a PROJECTES TÈCNICS SL</h2>
        <p>Somos una empresa especializada en <strong>Seguridad</strong>, <strong>Prevención de Riesgos Laborales</strong>, <strong>Medio Ambiente</strong> y <strong>Calidad</strong>.</p>
        
        <h3>Nuestros Servicios</h3>
        <ul>
          <li>Seguridad en el Trabajo</li>
          <li>Prevención de Riesgos Laborales</li>
          <li>Medio Ambiente</li>
          <li>Calidad</li>
        </ul>
        
        <p><a href="/contacto">Contáctanos</a> para más información.</p>
      </div>
    </UContainer>
  </div>
</template>
