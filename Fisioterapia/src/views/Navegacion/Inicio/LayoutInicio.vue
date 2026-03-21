<script setup>
import { onMounted, ref, watch } from 'vue'
import CardCita from '@/components/InicioComponents/CardCita.vue'
import NuevosUsuarios from '@/components/InicioComponents/Charts/NuevosUsuarios.vue'
import UltimosUsuarios from '@/components/InicioComponents/UltimosUsuarios.vue'
import CitasChart from '@/components/InicioComponents/Charts/CitasChart.vue'
import Fisiotepeutas from '@/components/InicioComponents/Fisiotepeutas.vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { notifiacionApi } from '@/helpers/notifications/ConsumoAlertas.js'
import { clavesStore } from '@/stores/clavesStore.js'

let saludo = ref('')
let nombre = ref(localStorage.getItem('Usuario'))
let citas = ref([])
let loader = ref(false)

let date = ref(null)

onMounted(() => {
    Saludar()
    citasDia()
})

watch(() => clavesStore().modificacionCita, async () => {
    ModificacionCita()
    clavesStore().modificacionCita = false
})

const scheduleTime = () => {
    //clavesStore().setVigencia(date.value) // Actualiza la fecha
    //clavesStore().programarEjecucion() // Ejecuta el temporizador
    clavesStore().setVigencia(date.value) // Agrega la nueva fecha
    clavesStore().programarEjecucion(date.value) // Ejecuta el temporizador
}

const Saludar = () => {
    const horaActual = new Date().getHours()
    saludo.value = horaActual < 12 ? 'Buenos días 🌤️' : (horaActual < 19 ? 'Buenas tardes 🌇' : 'Buenas noches 🌙')
}

const citasDia = async () => {
    loader.value = true
    citas.value = await pacientesQueries.getCitasDia()
    date.value = citas.value.length == 0 ? null : new Date(citas.value[0].fecha).toISOString().substring(0, 10) + 'T' + citas.value[0].hora
    scheduleTime()
    loader.value = false
}

const ModificacionCita = async () => {
    citas.value = await pacientesQueries.getCitasDia()
    date.value = citas.value.length == 0 ? null : new Date(citas.value[0].fecha).toISOString().substring(0, 10) + 'T' + citas.value[0].hora
    scheduleTime()
}
</script>

<template>
    <header class="flex flex-col md:flex-row items-center justify-between mb-5">
        <section class="flex telefono:flex-col items-center  gap-3">
            <h1 class="text-xl font-bold m-0">{{ saludo }}, {{ nombre }} <span>👋</span></h1>
            <p class="text-gray-700 font-semibold">Los datos mostrados se actualizan en tiempo real</p>
        </section>
    </header>
    <main class="flex flex-col gap-3">
        <section>
            <p class="text-lg font-bold text-gray-500 mb-2"> Citas del día </p>
            <div class="style_scroll flex gap-4 w-12/12 overflow-x-auto py-2">
                <div v-if="loader" v-for="load in 6"
                     class="flex-none bg-gray-300 animate-pulse h-[130px] w-[280px] telefono:w-[180px] telefono:h-[150px] max-w-sm rounded-lg">
                </div>
                <div class="h-[130px] w-full flex justify-center flex-col items-center gap-4 text-gray-500"
                     v-else-if="citas.length === 0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="size-10">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                    <span class="text-gray-500">No hay citas pendientes para este día</span>
                </div>
                <CardCita v-else v-for="cita in citas" :foto="cita.foto" :nombre="cita.nombre"
                          :hora="cita.hora.substring(0,5)" :numero="cita.telefono"
                          @click="notifiacionApi.accionCita(cita.nombre,cita.pacienteId,cita.fecha,cita.hora, cita.motivo, cita.citasId)" />
            </div>
        </section>
        <section
            class="flex telefono:flex-col py-2 style_scroll overflow-x-auto gap-4">
            <NuevosUsuarios />
            <CitasChart />
            <Fisiotepeutas />
            <div class="w-full">
             <p class="text-gray-600 mb-1 font-semibold">Últimos pacientes agregados</p>
             <UltimosUsuarios />
            </div>
        </section>
    </main>
</template>

<style scoped>
</style>