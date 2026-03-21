 <script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import {
  areasAnteriorMujer,
  areasLateralMujer,
  areasPosteriorMujer
} from '@/helpers/mapaCorporal.js'

const valores = ref([]) //Este es valores en el ep
const rangoDolor = ref([]) //Este seria rango en el ep
const areaSeleccionada = ref([])
const painLevels = reactive({})

let mapa =  reactive({
  valores:[],
  rangoDolor:[],
  notas:null
})

const emit = defineEmits(['mapaC'])

watch(mapa, () => {
  enviarMapa();
}, { deep: true })

const handleClick = (area) => {

  if (!areaSeleccionada.value.includes(area.name)) {
    areaSeleccionada.value.push(area.name)
    painLevels[area.name] = 0

    //Agregamos el id de la parte del cuerpo
    mapa.valores.push(BuscadorArea(area.name).id)
  } else {
    const index = areaSeleccionada.value.indexOf(area.name)
    areaSeleccionada.value.splice(index, 1)
    delete painLevels[area.name]

    //Eliminamos el id de la parte del cuerpo
    mapa.valores.value = mapa.valores.value.filter(x => x !== BuscadorArea(area.name).id)
  }
}

const BuscadorArea = (nombre) => {
  let map = null

  map = areasAnteriorMujer.find(x => x.name === nombre)

  if(map === undefined)
    map = areasPosteriorMujer.find(x => x.name === nombre)

  if(map === undefined)
    map = areasLateralMujer.find(x => x.name === nombre)

  return map
}

const isSelected = (areaName) => {
  return areaSeleccionada.value.includes(areaName)
}

//Este metodo se ejecuta al final, porque te convierte los rangos a una lista de enteros cuando ya estan listos
const enviar = () => {
  let rangos = []

  for (let key in painLevels) {
    rangos.push(painLevels[key])
  }

  mapa.rangoDolor.value = rangos
}
const enviarMapa = () => {
  enviar()
  emit('mapaC', mapa)
}
</script>

<template>
  <div class="flex justify-around telefono:flex-wrap border rounded-sm">
    <!-- Vista Anterior -->
    <section class="relative">
      <img src="/src/assets/CuerpoHumano/AnteriorMujer.png" alt="Cuerpo Humano" class="w-[225px] h-[400px]">
      <div v-for="area in areasAnteriorMujer" :key="'anterior-' + area.name"
           :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
           class="absolute border border-opacity-50 cursor-pointer rounded-full hover:bg-blue-500"
           @click="handleClick(area)"
           :title="area.name">
      </div>
    </section>
    <!-- Vista Posterior -->
    <section class="relative">
      <img src="/src/assets/CuerpoHumano/PosteriorMujer.png" alt="Otra Vista del Cuerpo"
           class="w-[225px] h-[400px]">
      <div v-for="area in areasPosteriorMujer" :key="'otra-' + area.name"
           :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
           class="absolute border border-opacity-50 cursor-pointer rounded-full hover:bg-blue-500"
           @click="handleClick(area)"
           :title="area.name">
      </div>
    </section>
    <!-- Vista Lateral-->
    <section class="relative">
      <img src="/src/assets/CuerpoHumano/LateralMujer.png" alt="Otra Vista del Cuerpo"
           class="w-[125px] h-[400px]">
      <div v-for="area in areasLateralMujer" :key="'otra-' + area.name"
           :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
           class="absolute border border-opacity-50 cursor-pointer rounded-full hover:bg-blue-500"
           @click="handleClick(area)"
           :title="area.name">
      </div>
    </section>
  </div>

  <!--Escala del dolor-->
  <section v-if="areaSeleccionada.length > 0"
           class="rounded-sm border shadow mt-6">
    <details open class="group">
      <summary
        class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
        Escala del dolor
        <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </summary>
      <div class="px-6 py-3 text-gray-500 flex flex-col gap-3 animate-fade-down">
        <div v-for="(selectedAreas, index) in [areaSeleccionada]" :key="index">
          <div v-if="selectedAreas.length > 0">
            <section v-for="area in selectedAreas" :key="(index === 0 ? 'anterior-' : 'otra-') + area"
                     class="">
              <header class="text-center">
                <h3>{{ area }}</h3>
              </header>
              <div class="relative">
                <input type="range" v-model="painLevels[area]" min="0" max="10"
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <span
                  class="absolute top-0 left-0 transform -translate-y-full bg-gray-100 px-2 py-1 text-xs rounded shadow-lg">{{ painLevels[area]
                  }}</span>
              </div>
              <div class="flex justify-between text-xs font-medium text-gray-500">
                <span>Sin dolor</span>
                <span>Dolor insoportable</span>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div class="px-6 py-3">
                <textarea v-model="mapa.notas"
                          class=" input-primary resize-none"
                          placeholder="Ingrese su nota"
                ></textarea>
      </div>
    </details>
  </section>
</template>


<style scoped>
input[type="range"]::-webkit-slider-thumb {
  background-color: #0d6efd; /* Tailwind 'green-500' color */
}

input[type="range"]::-moz-range-thumb {
  background-color: #0d6efd; /* Tailwind 'green-500' color */
}

input[type="range"]::-ms-thumb {
  background-color: #0d6efd; /* Tailwind 'green-500' color */
}
</style>