<script setup>
const props = defineProps({
     imagen: String
})
</script>

<template>
     <div>
          <!-- Imagen de fondo completa y oscurecida -->
          <img :src="props.imagen" class="brightness-50 w-[680px] h-[680px] telefono:w-80 telefono:h-80 object-cover rounded-sm shadow-2xl">

          <!-- Círculo colorido en el centro que muestra una parte ampliada de la imagen -->
          <div class="absolute">
               <img
                   :src="props.imagen"
                    class="rounded-full w-[680px] h-[680px] telefono:w-80 telefono:h-80 object-cover">
          </div>
     </div>
</template>
