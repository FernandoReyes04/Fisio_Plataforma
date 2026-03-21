<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { base64IMG } from '@/services/verifyToken.js'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import SignosEspecificos from '@/components/PacientesComponents/SignosVitales/SignosEspecificos.vue'
import MapaEspecifico from '@/components/PacientesComponents/Diagnostico/MapaEspecifico.vue'
import DatosEspecificos from '@/components/PacientesComponents/Diagnostico/DatosEspecificos.vue'
import Revisiones from '@/components/PacientesComponents/Diagnostico/Revisiones.vue'
import DescargarPDF from '@/components/PacientesComponents/Diagnostico/DescargarPDF.vue'


const route = useRoute()
let nombre = ref('')
let sexo = ref('')
let apellido = ref('')
let pacienteId = ref(route.params.id)
let diagnosticoId = ref(route.params.diagnosticoId)
let loader = ref(false)
let imagen = ref(null)
let fechaNacimiento = ref(null)
let edad = ref(null)
let motivo = ref('')
let inicial = ref('')
let final = ref('')
let frecuencia = ref('')
let motivoAlta = ref('')
let fisioterapeuta = ref('')
let tipoPago = ref('')
let showPDF = ref(false)

onMounted(() => {
    datosPaciente()
})

const datosPaciente = async () => {
    loader.value = true
    let response = await pacientesQueries.getDatosPaciente(pacienteId.value)
    nombre.value = response.nombre
    apellido.value = response.apellido
    imagen.value = base64IMG + response.fotoPerfil
    fechaNacimiento.value = response.fechaNacimiento.substring(0, 10).replace(/-/g, '/').split('/').reverse().join('/')
    edad.value = response.edad
    sexo.value = response.sexo
    fisioterapeuta.value = response.fisioterapeuta
    tipoPago.value = response.tipoPaciente
    loader.value = false
}

const recibirDiagnostico = (diagnostico) => {
    motivo.value = diagnostico.diagnostico
    inicial.value = diagnostico.inicial
    final.value = diagnostico.final
    motivoAlta.value = diagnostico.motivoAlta
    frecuencia.value = diagnostico.frecuencia
}


</script>

<template>
    <TransitionRec class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40" @click.self="showPDF = false">
        <div v-if="showPDF">
                <DescargarPDF :diagnosticoId="diagnosticoId" :nombre="nombre"/>
        </div>
    </TransitionRec>
    <div class="flex gap-3 tablet:flex-wrap tablet:gap-0 telefono:flex-wrap animate-fade-down">
        <section class="desktop:w-3/12 laptop:w-3/12 tablet:w-full telefono:w-full">
            <div class="sticky top-0 flex flex-col gap-2">
                <div
                    class="flex gap-2 py-3 px-2 border shadow-sm rounded-sm items-center telefono:flex-col animate-pulse"
                    v-if="loader">
                    <div class="h-12 w-12 rounded-full bg-blue-300"></div>
                    <div class="flex-1">
                        <div class="h-4 w-[90%] rounded-lg bg-blue-300 text-sm mb-1"></div>
                        <div class="h-4 w-3/5 rounded-lg bg-blue-300 text-lg"></div>
                    </div>
                </div>
                <header v-else
                        class="flex gap-2 py-3 px-2 border shadow-sm rounded-sm items-center telefono:flex-col">
                    <div>
                        <img
                            :src="imagen"
                            class="rounded-full object-cover h-12 w-12 cursor-pointer">
                    </div>
                    <div class="text-gray-600">
                        <h4 class="font-bold">{{ nombre + ' ' + apellido }} <span class="text-blue-500">({{ sexo
                            }})</span></h4>
                        <div class="flex text-sm text-blue-800">
                            <p>{{ fechaNacimiento }} - <span>{{ edad }} años</span></p>
                        </div>
                    </div>
                </header>
                <div>
                    <SignosEspecificos />
                </div>
                <div
                    class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                    <p>Diagnóstico: <span class="text-blue-600">{{ motivo }}</span></p>
                </div>
                <div
                    class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                    <p>A cargo: <span class="text-blue-600">{{ fisioterapeuta }}</span></p>
                </div>
                <div
                    class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                    <p>Tipo de pago: <span class="text-blue-600">{{ tipoPago }}</span></p>
                </div>
                <button
                    class="bg-gray-800 text-white p-3 rounded-[3px] hover:bg-opacity-95 flex justify-center items-center gap-3"
                    @click="showPDF = true">
                    <p>Ver archivo PDF</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </button>
            </div>
        </section>
        <section
            class="overflow-y-auto flex-col flex gap-5 style_scroll desktop:w-6/12 laptop:w-8/12 tablet:w-full telefono:w-full">
            <MapaEspecifico :sexo="sexo" />
            <div class="text-gray-600 text-lg">Datos de finalización</div>
            <div class="flex flex-col gap-2 text-sm">
                <!--Diagnostico Inicial-->
                <section class="rounded-sm border shadow">
                    <details open class="group">
                        <summary
                            class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                            Diagnóstico inicial
                            <svg
                                class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                        </summary>
                        <div class="px-6 py-3">
                            <input type="text" v-model="inicial" disabled
                                   class="bg-gray-100 input-primary resize-none"
                                   placeholder="Ingrese el diagnóstico inicial" />
                        </div>
                    </details>
                </section>
                <!--Diagnostico final-->
                <section class="rounded-sm border shadow">
                    <details open class="group">
                        <summary
                            class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                            Diagnóstico final
                            <svg
                                class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                        </summary>
                        <div class="px-6 py-3">
                            <input type="text" v-model="final" disabled
                                   class="bg-gray-100 input-primary resize-none"
                                   placeholder="Ingrese el diagnóstico final" />
                        </div>
                    </details>
                </section>
                <!--Frecuencia de tratamiento-->
                <section class="rounded-sm border shadow">
                    <details open class="group">
                        <summary
                            class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                            Frecuencia de tratamiento
                            <svg
                                class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                        </summary>
                        <div class="px-6 py-3">
                            <input type="text" disabled class="input-primary bg-gray-100" v-model="frecuencia">
                        </div>
                    </details>
                </section>
                <!--Motivo de alta de servicio-->
                <section class="rounded-sm border shadow">
                    <details open class="group">
                        <summary
                            class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                            Motivo de alta de servicio
                            <svg
                                class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                            </svg>
                        </summary>
                        <div class="px-6 py-3">
                            <input type="text" disabled class="input-primary bg-gray-100" v-model="motivoAlta">
                        </div>
                    </details>
                </section>
            </div>
            <div class="text-gray-600 text-lg">Datos de la cita inicial</div>
            <DatosEspecificos @diagnostico-enviado="recibirDiagnostico" />
        </section>
        <section class="laptop:w-3/12 tablet:w-full telefono:w-full desktop:w-3/12">
            <h3 class="text-gray-600 text-lg font-semibold mb-3 telefono:mt-3 tablet:mt-3">Todas las
                revisiones</h3>
            <Revisiones />
        </section>
    </div>
</template>

<style scoped>
</style>
