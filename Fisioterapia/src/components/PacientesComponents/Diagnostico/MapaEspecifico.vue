<script setup>
import { onMounted, ref } from 'vue'
import {
  areasAnterior, areasAnteriorMujer,
  areasLateral,
  areasLateralMujer,
  areasPosterior,
  areasPosteriorMujer
} from '@/helpers/mapaCorporal.js'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { useRoute } from 'vue-router'

const props = defineProps({
  sexo: String
})

const areasSeleccionadas = ref([])
let route = useRoute()
let diagnosticoId = ref(route.params.diagnosticoId)
const nota = ref("")
const valores = ref([])
const dolor = ref([])
const mapa = ref([])
let loader = ref(false)



//Esto solo lo meti en el onMounted para prueba pero en si es el metodo cuando consumas
onMounted(async () => {
    await mapaCorporal()
    //Recorro un arreglo del tamano de valores
    for (let i = 0; i < valores.value.length; i++) {
        let valor = valores.value[i] //Guardo el primer valor
        let map = null

        //Verifico en que rango esta
        if(valor >= 1 && valor <= 26)
            map = areasAnterior.find(area => area.id === valor) //Obtengo los datos que coincidan con el id
        else if(valor >= 27 && valor <= 48)
            map = areasPosterior.find(area => area.id === valor)
        else
            map = areasLateral.find(area => area.id === valor)

        let corporal = {name: map.name, rango: dolor.value[i]} //Solo guardo lo que necesito

        areasSeleccionadas.value.push(map.name) //Son los puntos que se colorearan de azul

        mapa.value.push(corporal) //El mapa corporal de rango de dolor
    }
})

const mapaCorporal = async () => {
    loader.value = true
    let response = await pacientesQueries.getDiagnosticoData(diagnosticoId.value)
    console.log(response)
    nota.value = response.map.nota
    valores.value = response.map.valores
    dolor.value = response.map.rangoDolor
    loader.value = false
}

const isSelected = (areaName) => {
    return areasSeleccionadas.value.includes(areaName)
}
</script>

<template>
    <div v-if="loader" class="h-[402px] flex justify-center items-center text-gray-600">
        <svg aria-hidden="true" role="status" class="inline w-10 h-10 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
            Cargando mapa corporal...
    </div>
    <div v-else class="animate-fade">
        <div v-if="sexo=== 'Hombre'">
            <div class="flex justify-around telefono:flex-wrap border rounded-sm">
                <!-- Vista Anterior -->
                <section class="relative ">
                    <img src="/src/assets/CuerpoHumano/VistaAnterior.jpeg" alt="Cuerpo Humano" class="w-[225px] h-[400px]">
                    <div v-for="area in areasAnterior" :key="'anterior-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
                <!-- Vista Posterior -->
                <section class="relative">
                    <img src="/src/assets/CuerpoHumano/VistaPosterior.jpeg" alt="Otra Vista del Cuerpo" class="w-[225px] h-[400px]">
                    <div v-for="area in areasPosterior" :key="'otra-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
                <!-- Vista Lateral-->
                <section class="relative">
                    <img src="/src/assets/CuerpoHumano/VistaLateral.jpeg" alt="Otra Vista del Cuerpo" class="w-[125px] h-[400px]">
                    <div v-for="area in areasLateral" :key="'otra-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
            </div>

            <!--Escala del dolor-->
            <section v-show="areasSeleccionadas.length > 0" class="rounded-sm border shadow mt-6">
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
                        <div v-for="(selectedAreas, index) in [areasSeleccionadas]" :key="index">
                            <div v-if="selectedAreas.length > 0">
                                <section v-for="area in mapa" :key="(index === 0 ? 'anterior-' : 'otra-') + area">
                                    <header class="text-center">
                                        <h3>{{ area.name }}</h3>
                                    </header>
                                    <div class="relative">
                                        <input type="range" min="0" max="10" :value="area.rango" disabled
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <span class="absolute top-0 left-0 transform -translate-y-full bg-gray-100 px-2 py-1 text-xs rounded shadow-lg">{{ area.rango }}</span>
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
                <textarea disabled v-model="nota"
                          class=" input-primary resize-none bg-gray-100"
                          placeholder="Ingrese su nota"
                ></textarea>
                    </div>
                </details>
            </section>
        </div>


        <div v-else>
            <div class="flex justify-around telefono:flex-wrap border rounded-sm">
                <!-- Vista Anterior -->
                <section class="relative">
                    <img src="/src/assets/CuerpoHumano/AnteriorMujer.png" alt="Cuerpo Humano" class="w-[225px] h-[400px]">
                    <div v-for="area in areasAnteriorMujer" :key="'anterior-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
                <!-- Vista Posterior -->
                <section class="relative">
                    <img src="/src/assets/CuerpoHumano/PosteriorMujer.png" alt="Otra Vista del Cuerpo" class="w-[225px] h-[400px]">
                    <div v-for="area in areasPosteriorMujer" :key="'otra-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
                <!-- Vista Lateral-->
                <section class="relative">
                    <img src="/src/assets/CuerpoHumano/LateralMujer.png" alt="Otra Vista del Cuerpo" class="w-[125px] h-[400px]">
                    <div v-for="area in areasLateralMujer" :key="'otra-' + area.name"
                         :style="{ left: area.x + 'px', top: area.y + 'px', width: area.width + 'px', height: area.height + 'px', backgroundColor: isSelected(area.name) ? '#0d6efd' : 'transparent' }"
                         class="absolute border border-opacity-50 rounded-full hover:bg-blue-500"
                         :title="area.name">
                    </div>
                </section>
            </div>

            <!--Escala del dolor-->
            <section v-show="areasSeleccionadas.length > 0" class="rounded-sm border shadow mt-6">
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
                        <div v-for="(selectedAreas, index) in [areasSeleccionadas]" :key="index">
                            <div v-if="selectedAreas.length > 0">
                                <section v-for="area in mapa" :key="(index === 0 ? 'anterior-' : 'otra-') + area">
                                    <header class="text-center">
                                        <h3>{{ area.name }}</h3>
                                    </header>
                                    <div class="relative">
                                        <input type="range" min="0" max="10" :value="area.rango" disabled
                                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                        <span class="absolute top-0 left-0 transform -translate-y-full bg-gray-100 px-2 py-1 text-xs rounded shadow-lg">{{ area.rango }}</span>
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
                <textarea disabled v-model="nota"
                          class=" input-primary resize-none bg-gray-100"
                          placeholder="Ingrese su nota"
                ></textarea>
                    </div>
                </details>
            </section>
        </div>
    </div>
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
