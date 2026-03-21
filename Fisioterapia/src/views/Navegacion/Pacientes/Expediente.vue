<script setup>
import InterrogatorioExpediente from '@/components/PacientesComponents/InterrogatorioExpediente.vue'
import CardCitaExpediente from '@/components/PacientesComponents/CardCitaExpediente.vue'
import { computed, onMounted, ref } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { useRoute } from 'vue-router'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import { irDiagnostico } from '@/router/rutasUtiles.js'
import SignosEspecificos from '@/components/PacientesComponents/SignosVitales/SignosEspecificos.vue'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import VerFoto from '@/components/PacientesComponents/VerFoto.vue'

const route = useRoute()
let nombre = ref('')
let sexo = ref('')
let apellido = ref('')
let pacienteId = ref(route.params.id)
let expedienteId = ref(null)
let loader = ref(true)
let imagen = ref(null)
let fechaNacimiento = ref(null)
let edad = ref(null)
let spinner = ref(false)
let botonText = ref('Iniciar diagnóstico')
let expedienteNomenclatura = ref('')
let loaderBoton = ref('')
//FOTO
let showFoto = ref(false)
//Agendar cita desde expediente
let fecha = ref('')
let hora = ref('00:00')
let motivo = ref('')

let citasCard = ref(null)

onMounted( () => {
    getExpediente()
    datosPaciente()
})

/* Peticiones HTTP */
const verificarBoton = async () => {
    if (!expedienteId.value) {
        irDiagnostico(pacienteId.value)
        return
    }

    loaderBoton.value = true
    try {
        let response = await pacientesQueries.diagnosticoActivo(expedienteId.value);
        if (response?.enCurso === true) {
            irDiagnostico(pacienteId.value, response.diagnosticoId);
        } else {
            irDiagnostico(pacienteId.value);
        }
    } catch (error) {
        console.error('Error al verificar el diagnóstico:', error)
    } finally {
        loaderBoton.value = false
    }
}

const getExpediente = async ()=>{
  let response = await pacientesQueries.getExpediente(pacienteId.value)
    if (!response) {
            return
    }
  expedienteId.value = response.expedienteId
  let response2 = await pacientesQueries.diagnosticoActivo(expedienteId.value)
    console.log(expedienteId.value)
        if (response2?.enCurso === true){
        botonText.value = 'Continuar diagnóstico'
    }else{
        botonText.value = 'Iniciar diagnóstico'
    }
}

const datosPaciente = async () => {
    loader.value = true
    let response = await pacientesQueries.getDatosPaciente(pacienteId.value)
    if (!response) {
        loader.value = false
        return
    }
    nombre.value = response.nombre
    apellido.value = response.apellido
    imagen.value = response.fotoPerfil ? 'data:image/png;base64,' + response.fotoPerfil : null
    fechaNacimiento.value = response.fechaNacimiento
        ? response.fechaNacimiento.substring(0, 10).replace(/-/g, '/').split('/').reverse().join('/')
        : ''
    edad.value = response.edad
    sexo.value = response.sexo || ''
    loader.value = false
}

const verificarDatosAgenda = computed(() => {
    return fecha.value !== '' && hora.value !== '' && motivo.value.trim() !== '';
})

const agendarCita = async () =>{
    spinner.value = true
    await pacientesCommand.crearCita(pacienteId.value,fecha.value,hora.value,motivo.value)
    fecha.value = ''
    hora.value = '12:00'
    motivo.value = ''
    citasCard.value.citasPaciente()
    spinner.value = false
}

const recibirExpedienteID = (expedienteNom) => {
    expedienteNomenclatura.value = expedienteNom
    // Aquí puedes hacer lo que necesites con el valor recibido
}


</script>

<template>
    <div class="flex gap-3 tablet:flex-wrap tablet:gap-0 telefono:flex-wrap">
        <section class="desktop:w-3/12 laptop:w-3/12 tablet:w-6/12 tablet:order-1 telefono:w-full mb-4">
            <div
                class="flex gap-2 py-3 px-2 border shadow-sm rounded-sm mb-2 items-center telefono:flex-col animate-pulse"
                v-if="loader">
                <div class="h-12 w-12 rounded-full bg-blue-300"></div>
                <div class="flex-1">
                    <div class="h-4 w-[90%] rounded-lg bg-blue-300 text-sm mb-1"></div>
                    <div class="h-4 w-3/5 rounded-lg bg-blue-300 text-lg"></div>
                </div>
            </div>
            <header v-else class="flex gap-2 py-3 px-2 border shadow-sm rounded-sm mb-2 items-center telefono:flex-col">
                <div>
                    <img @click="showFoto = true"
                         :src="imagen"
                        class="rounded-full h-12 w-12 object-cover cursor-pointer">
                </div>
                 <TransitionRec class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40" @click.self="showFoto = false">
                      <VerFoto :imagen v-if="showFoto"/>
                 </TransitionRec>
                <div class="text-gray-600">
                    <h4 class="font-bold">{{ nombre + ' ' + apellido }} <span class="text-blue-500">({{ sexo }})</span>
                    </h4>
                    <div class="flex text-sm text-blue-800">
                        <p>{{ fechaNacimiento }} - <span>{{ edad }} años</span></p>
                    </div>
                </div>
            </header>
                <SignosEspecificos class="mb-2"/>
            <div
                class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                <p>No. Expediente: <span class="text-blue-600">{{ expedienteNomenclatura }}</span></p>
            </div>
        </section>
        <section
            class="desktop:w-6/12 laptop:w-6/12 tablet:w-full tablet:order-3 telefono:w-full desktop:h-[766px] laptop:h-[766px] overflow-x-auto style_scroll">
            <interrogatorio-expediente :pacienteId :sexo :expedienteId @enviarExpedienteID="recibirExpedienteID"  />
        </section>

        <section
            class="desktop:w-3/12 laptop:w-3/12 tablet:w-5/12 tablet:ml-5 tablet:order-2 telefono:w-full flex flex-col gap-3">
            <button class="button-primary w-full flex justify-center" :disabled="botonText === '' || loaderBoton === true" @click="verificarBoton">
                <svg v-show="loaderBoton" aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                <div v-if="botonText === ''" class="text-white animate-pulse">
                    Verificando...
                </div>
                <div class="animate-fade animate-once" v-else>
                    {{ botonText }}
                </div>
            </button>
            <div class="rounded-md border">
                <header class="text-gray-600 p-3 py-3 border-b bg-gray-100">
                    <h5 class="telefono:text-center">Agendar consulta</h5>
                </header>
                <div class="flex">
                    <div class="w-1/2">
                        <input type="date" v-model="fecha" class="w-full border-transparent text-gray-600 text-sm focus:ring-transparent focus:border-transparent block p-2 ml-1" placeholder="Select date">
                    </div>
                    <div class="w-1/2 mr-1">
                        <input type="time" v-model="hora" id="time" class="w-full border-transparent p-1.5 leading-none text-gray-600 text-sm focus:ring-transparent focus:border-transparent block" min="09:00" max="18:00"  />
                    </div>
                </div>
                <div class="border-t">
                    <input type="text" v-model="motivo" class="border-none focus:ring-transparent rounded-b-lg w-full" placeholder="Motivo de la consulta">
                </div>
            </div>
            <button
                class="font-semibold text-white hover:bg-opacity-95 rounded-[3px] w-1/2 telefono:w-full p-2 py-3 transition transition-duration-500" :disabled="!verificarDatosAgenda || spinner" :class="{'bg-gray-400': !verificarDatosAgenda, 'bg-blue-600' : verificarDatosAgenda}" @click="agendarCita">
                <div v-if="!spinner">
                    Agendar cita
                </div>
                <div v-else role="status" class="flex justify-center items-center">
                    <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor" />
                    </svg>
                    Agendando
                </div>
            </button>
            <h5 class="text-gray-500 font-bold telefono:text-center mt-3 mb-2">Consultas agendadas</h5>
            <div
                class="h-[450px] laptop:h-[450px] tablet:h-[220px] telefono:h-[200px] overflow-y-auto flex-col flex style_scroll">
                <card-cita-expediente ref="citasCard" />
            </div>
        </section>
    </div>
</template>

<style scoped>

</style>