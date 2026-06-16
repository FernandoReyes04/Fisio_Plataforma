<script setup>
import { onMounted, ref } from 'vue'
import CardCita from '@/components/InicioComponents/CardCita.vue'
import TablaUsuarios from '@/components/CalendarioComponents/TablaUsuarios.vue'
import { calendarioCommand } from '@/api/calendario/calendario.js'

let citasAgendadas = ref([])
let pacientes = ref([])
let calendar = ref(null)
let date = new Date()
let loader = ref(false)
let year = date.getFullYear()
let month = date.getMonth()

let attributes = ref([
    {
        key: 'today',
        highlight: {
            color: 'blue',
            fillMode: 'solid',
            contentClass: 'italic',
        },
        dates: new Date(),
    },
    {
        highlight: {
            color: 'blue',
            fillMode: 'light',
        },
    },
])

let fechaSeleccionada = ref(null)

onMounted(() => {
    diaSeleccionado({ date: date.toDateString() })
})

const hoy = () => {
    calendar.value.move(new Date())
    diaSeleccionado({ date: date.toDateString() })
}

const diaSeleccionado = async (day) => {
    loader.value = true
    fechaSeleccionada.value = day.date
    const isoDate = new Date(day.date).toISOString()
    let response = await calendarioCommand.getDataFecha(isoDate)
    citasAgendadas.value = response.citas
    pacientes.value = response.pacientes
    loader.value = false
}

// Cambia el estado de una cita y recarga el día seleccionado
const cambiarEstado = async (citaId, estado) => {
    const ok = await calendarioCommand.cambiarEstadoCita(citaId, estado)
    if (ok && fechaSeleccionada.value) {
        await diaSeleccionado({ date: fechaSeleccionada.value })
    }
}
</script>

<template>
    <div class="flex gap-3 telefono:flex-col">
        <div class="w-1/2 telefono:w-full">
            <v-calendar ref="calendar" :attributes="attributes" expanded rows="2" @dayclick="diaSeleccionado">
                <template #footer>
                    <div class="w-full px-4 pb-3">
                        <button
                            class="bg-blue-600 hover:bg-opacity-95 text-white w-full px-3 py-1 rounded-sm"
                            @click="hoy">
                            Hoy
                        </button>
                    </div>
                </template>
            </v-calendar>
        </div>
        <div class="w-1/2 telefono:w-full">
            <h1 class="text-gray-500 font-semibold">Citas de la fecha seleccionada</h1>
            <div v-if="loader" class="flex gap-4 w-12/12">
                <div v-for="load in 3"
                     class="flex-none bg-gray-300 animate-pulse h-[130px] w-[280px] telefono:w-[180px] telefono:h-[150px] max-w-sm rounded-lg">
                </div>
            </div>
            <div class="h-[130px] w-full flex justify-center flex-col items-center gap-4 text-gray-500"
                 v-else-if="citasAgendadas.length === 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <span class="text-gray-500">No hay citas registradas en el día seleccionado</span>
            </div>
            <div v-else class="style_scroll flex gap-4 w-12/12 overflow-x-auto py-2">
                <div class="flex flex-col items-center gap-1" v-for="cita in citasAgendadas">
                    <div class="relative">
                        <CardCita :nombre="cita.paciente" :foto="cita.foto" :hora="cita.hora.substring(0,5)" :numero="cita.telefono"/>
                        <span class="absolute bottom-0 right-0 mb-2 mr-2 border p-1 rounded text-white text-sm"
                            :class="{
                                'bg-gray-500':  cita.status === 1,
                                'bg-yellow-500': cita.status === 2,
                                'bg-red-500':   cita.status === 3,
                                'bg-blue-500':  cita.status === 4
                            }">
                            {{ cita.status === 1 ? 'Pendiente' : cita.status === 2 ? 'Inasistencia' : cita.status === 3 ? 'Cancelada' : 'Concluida' }}
                        </span>
                    </div>
                    <!-- Botones de cambio de estado — solo visibles si la cita está Pendiente -->
                    <div v-if="cita.status === 1" class="flex gap-1 w-full">
                        <button
                            @click="cambiarEstado(cita.citasId, 2)"
                            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-1 rounded transition">
                            Inasistencia
                        </button>
                        <button
                            @click="cambiarEstado(cita.citasId, 4)"
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 rounded transition">
                            Concluida
                        </button>
                    </div>
                </div>
            </div>
            <h1 class="text-gray-500 font-semibold">Pacientes nuevos de la fecha seleccionada</h1>
            <div class="animate-pulse" v-if="loader">
                <div class="px-6 py-4 bg-blue-300 mt-3 mb-3 rounded"></div>
                <div class="px-6 py-4 bg-gray-300 mb-4 rounded" v-for="load in 7"></div>
            </div>
            <div class="h-[130px] w-full flex justify-center flex-col items-center gap-4 text-gray-500"
                 v-else-if="pacientes.length === 0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span class="text-gray-500">No hay pacientes registrados en el día seleccionado</span>
            </div>
            <TablaUsuarios v-else :pacientes="pacientes"/>
        </div>
    </div>
</template>