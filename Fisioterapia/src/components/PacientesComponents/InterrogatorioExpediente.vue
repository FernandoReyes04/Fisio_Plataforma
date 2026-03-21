<script setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { irDiagnostico, irDiagnosticos } from '@/router/rutasUtiles.js'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import { useRoute } from 'vue-router'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'

const emit = defineEmits(['enviarExpedienteID'])

let props = defineProps({
    sexo: String,
    pacienteId: [String, Number],
    expedienteId: [String, Number, null]
})

onMounted(() => {
    datosExpediente()
    getCatalogos()
})


// WATCH
watch(() => [props.pacienteId, props.sexo], ([nuevoPacienteId, nuevoSexo]) => {
    pacienteId.value = nuevoPacienteId
    sexo.value = nuevoSexo
})

let route = useRoute()
let expedienteNom = ref('')
let pacienteId = ref(props.pacienteId)
let sexo = ref(props.sexo)
let spinner = ref(false)
let tipoInterrogatorio = ref(true)
let responsable = ref('')
let padresCausaMuerte = ref(null)
let hermanosCausaMuerte = ref(null)
let hijosCausaMuerte = ref(null)
let dm = ref(null)
let hta = ref(null)
let cancer = ref(null)
let alcoholismo = ref(null)
let tabaquismo = ref(null)
let drogas = ref(null)
let fum = ref(null)
let fpp = ref(null)
let edadGestional = ref(null)
let semanas = ref(null)
let menarca = ref(null)
let ritmo = ref(null)
let gestas = ref(null)
let partos = ref(null)
let cesareas = ref(null)
let abortos = ref(null)
let cirugias = ref(null)
let flujoVaginalId = ref('')
let flujos = ref([])
let tipoAnticonceptivoId = ref(null)
let anticonceptivos = ref([])
let editar = ref(true)
let diagnosticos = ref([])
let loaderUpdate = ref(false)


const getCatalogos = async () => {
    flujos.value = await catalogosQueries.getFlujo(true)
    anticonceptivos.value = await catalogosQueries.getAnticonceptivos(true)
}

//Modelos reactivos
const model = reactive({
    padres: null,
    padresVivos: null,
    hermanos: null,
    hermanosVivos: null,
    hijos: null,
    hijosVivos: null,
    antecedentesPatologicos: null,
    medioLaboral: null,
    medioSociocultural: null,
    medioFisicoambiental: null
})

const rules = {
    padres: { required },
    padresVivos: { required },
    hermanos: { required },
    hermanosVivos: { required },
    hijos: { required },
    hijosVivos: { required },
    antecedentesPatologicos: { required },
    medioLaboral: { required },
    medioSociocultural: { required },
    medioFisicoambiental: { required }
}

//Aqui se junta el modelo con las reglas
const $v = useVuelidate(rules, model)

//Peticiones HTTP

/*const actualizarInterrogatorio= async () => {
}*/

const datosExpediente = async () => {
    spinner.value = true
    let respuesta = await pacientesQueries.getExpediente(pacienteId.value)
    if (!respuesta) {
        spinner.value = false
        return
    }
    expedienteNom.value = respuesta.nomenclatura
    emit('enviarExpedienteID', expedienteNom.value)
    tipoInterrogatorio.value = respuesta.tipoInterrogatorio
    responsable.value = respuesta.responsable
    diagnosticos.value = respuesta.diagnosticos || []
    //HeredoFamiliar
    model.padres = respuesta.heredoFamiliar?.padres
    model.padresVivos = respuesta.heredoFamiliar?.padresVivos
    padresCausaMuerte.value = respuesta.heredoFamiliar?.padresCausaMuerte
    model.hermanos = respuesta.heredoFamiliar?.hermanos
    model.hermanosVivos = respuesta.heredoFamiliar?.hermanosVivos
    hermanosCausaMuerte.value = respuesta.heredoFamiliar?.hermanosCausaMuerte
    model.hijos = respuesta.heredoFamiliar?.hijos
    model.hijosVivos = respuesta.heredoFamiliar?.hijosVivos
    hijosCausaMuerte.value = respuesta.heredoFamiliar?.hijosCausaMuerte
    dm.value = respuesta.heredoFamiliar?.dm
    hta.value = respuesta.heredoFamiliar?.hta
    cancer.value = respuesta.heredoFamiliar?.cancer
    alcoholismo.value = respuesta.heredoFamiliar?.alcoholismo
    tabaquismo.value = respuesta.heredoFamiliar?.tabaquismo
    drogas.value = respuesta.heredoFamiliar?.drogas
    //Antecedentes
    model.antecedentesPatologicos = respuesta.antecedente?.antecedentesPatologicos
    //No Patologicos
    model.medioLaboral = respuesta.antecedente?.medioLaboral
    model.medioSociocultural = respuesta.antecedente?.medioSociocultural
    model.medioFisicoambiental = respuesta.antecedente?.medioFisicoambiental

    if (respuesta.ginecobstetricos === null || respuesta.ginecobstetricos === undefined) {
        spinner.value = false
        return
    }

    fum.value = respuesta.ginecobstetricos.fum
    fpp.value = respuesta.ginecobstetricos.fpp
    edadGestional.value = respuesta.ginecobstetricos.edadGestional
    semanas.value = respuesta.ginecobstetricos.semanas
    menarca.value = respuesta.ginecobstetricos.menarca
    ritmo.value = respuesta.ginecobstetricos.ritmo
    gestas.value = respuesta.ginecobstetricos.gestas
    partos.value = respuesta.ginecobstetricos.partos
    cesareas.value = respuesta.ginecobstetricos.cesareas
    abortos.value = respuesta.ginecobstetricos.abortos
    cirugias.value = respuesta.ginecobstetricos.cirugias
    flujoVaginalId.value = respuesta.ginecobstetricos.flujoVaginalId
    tipoAnticonceptivoId.value = respuesta.ginecobstetricos.tipoAnticonceptivoId
    spinner.value = false
}
// ActualizarDatos

const actualizarInterrogatorio = async () => {
    $v.value.$touch()
    if ($v.value.$invalid) {
        return; // Salir de la función si hay errores
    }
    irEditar()
    loaderUpdate.value = true
    await pacientesCommand.actualizarInterrogatorio(sexo.value, props.expedienteId, tipoInterrogatorio.value, responsable.value, model.padres, model.padresVivos, padresCausaMuerte.value, model.hermanos,
        model.hermanosVivos, hermanosCausaMuerte.value,
        model.hijos, model.hijosVivos, hijosCausaMuerte.value,
        dm.value, hta.value, cancer.value, alcoholismo.value,
        tabaquismo.value, drogas.value, model.antecedentesPatologicos,
        model.medioLaboral, model.medioSociocultural, model.medioFisicoambiental,
        fum.value, fpp.value, menarca.value, ritmo.value, cirugias.value,
        edadGestional.value, semanas.value, gestas.value, partos.value,
        cesareas.value, abortos.value, flujoVaginalId.value, tipoAnticonceptivoId.value)
    editar.value = true
    loaderUpdate.value = false
}
//irDiagnostico

const irAlDiagnostico = (status, id) => {
    if (status === true) {
        irDiagnostico(pacienteId.value, id)
    } else {
        irDiagnosticos(pacienteId.value, id)
    }
}
// Validaciones

const validacionPadres = () => {
    if (model.padresVivos < 0 || model.padresVivos == '') {
        model.padresVivos = 0
    }

    if (model.padresVivos > model.padres) {
        model.padresVivos = model.padres
    }
}

const validacionHermanos = () => {
    if (model.hermanosVivos < 0 || model.hermanosVivos == '') {
        model.hermanosVivos = 0
    }

    if (model.hermanosVivos > model.hermanos) {
        model.hermanosVivos = model.hermanos
    }
}

const validacionHijos = () => {
    if (model.hijosVivos < 0 || model.hijosVivos == '') {
        model.hijosVivos = 0
    }

    if (model.hijosVivos > model.hijos) {
        model.hijosVivos = model.hijos
    }
}

const editarDatos = () => {
    editar.value = !editar.value
    irEditar()
}

const cancelarEdicion = () => {
    editar.value = !editar.value
    datosExpediente()
}

let edicion = ref(false)

const irEditar = () => {
    nextTick().then(() => {
        if (edicion.value) {
            edicion.value.scrollIntoView({ behavior: 'smooth' })
        }
    })
}

</script>

<template>
    <div class="w-full h-full flex justify-center flex-col items-center gap-4 border shadow" v-if="spinner">
        <svg aria-hidden="true" role="status" class="inline w-10 h-10 me-3 text-white animate-spin"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB" />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor" />
        </svg>
        <span class="text-gray-500">Cargando datos del expediente...</span>
    </div>
    <div v-else class="flex gap-3 flex-col text-sm">
        <h3 class="text-gray-600 text-lg font-semibold">Diagnósticos</h3>
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Ver diagnósticos
                    <svg
                        class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path
                            d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div v-if="diagnosticos.length === 0" class="px-6 py-3 text-sm text-gray-500 flex items-center gap-2">
                    Aun no hay diagnosticos con este paciente
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                </div>
                <div v-else v-for="diagnostico in diagnosticos"
                     class="px-6 py-3 flex justify-between w-full items-center text-gray-600 hover:text-blue-500 cursor-pointer"
                     @click="irAlDiagnostico(diagnostico.status, diagnostico.diagnosticoId)">
                    <div class="text-sm flex gap-1">
                        {{ diagnostico.diagnostico }}
                        <p>
                            ({{ diagnostico.fechaInicio ? diagnostico.fechaInicio.substring(0, 10).replace(/-/g, '/').split('/').reverse().join('/') : 'Sin fecha de inicio'
                            }} -
                            <span v-if="diagnostico.fechaAlta">
                                {{ diagnostico.fechaAlta.substring(0, 10).replace(/-/g, '/').split('/').reverse().join('/')
                                }}
                            </span>
                            <span v-else class="text-green-500 font-bold">En curso</span>)
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        Ir
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </details>
        </section>
        <h3 class="text-gray-600 text-lg font-semibold" ref="edicion">
            Antecedentes
        </h3>
        <section class="overflow-x-auto rounded-sm border shadow-sm">
            <div class="w-full text-sm text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Tipo de interrogatorio</h2>
                </header>
                <div>
                    <section
                        class="tablet:flex-col flex px-6 py-3 items-center telefono:flex-col gap-4 telefono:text-center tablet:text-center">
                        <div class="text-gray-600 w-[200px] laptop:w-4/12 telefono:w-1/2">
                            <label>Tipo de interrogatorio</label>
                        </div>
                        <div
                            class="flex w-full desktop:justify-center tablet:justify-center laptop:w-6/12 telefono:w-full justify-center">
                            <input type="radio" id="opcion1" name="opcion" class="custom-radio hidden"
                                   :disabled="editar" @click="tipoInterrogatorio = true"
                                   :checked="tipoInterrogatorio === true">
                            <label for="opcion1" :class="{'pointer-events-none' : editar}"
                                   class="opcion border-principal rounded-sm hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500 p-2 pr-6 pl-6 cursor-pointer hover:text-blue-600">Directo</label>
                            <input type="radio" id="opcion2" name="opcion" class="custom-radio hidden"
                                   :disabled="editar" @click="tipoInterrogatorio = false"
                                   :checked="tipoInterrogatorio === false">
                            <label for="opcion2" :class="{'pointer-events-none' : editar}"
                                   class="opcion border-principal rounded-sm hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500 p-2 pr-6 pl-6 cursor-pointer hover:text-blue-600">Indirecto</label>
                        </div>
                    </section>
                    <section v-show="tipoInterrogatorio === false"
                             class="mb-3 px-6 py-1 flex flex-col gap-3 animate-fade-down animate-once">
                        <div class="flex flex-col">
                            <label class="text-gray-600 mb-2 telefono:text-center telefono:mb-2">Responsable del
                                paciente</label>
                            <input v-model="responsable" class="h-[40px] inactive-input" type="text" :disabled="editar"
                                   placeholder="Responsable">
                        </div>
                    </section>
                </div>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow pb-2">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Heredo-Familiares</h2>
                </header>
                <div class="px-6 py-3">
                    <section class="flex flex-col gap-3">
                        <div class="flex w-full gap-4 telefono:flex-col">
                            <div class="w-4/12 telefono:w-full">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Padres <span
                                        class="text-blue-600">*</span></label>
                                    <input v-model="model.padres" type="number" :disabled="editar"
                                           class="h-[40px] mb-2 inactive-input" :class="{'bg-gray-100' : editar}"
                                           placeholder="Numero de padres">
                                    <span v-if="$v.padres.$error" class="text-red-500 text-xs">El numeros de padres es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Padres vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionPadres()" v-model="model.padresVivos" :disabled="editar"
                                           class="h-[40px] mb-2 inactive-input" :class="{'bg-gray-100' : editar}"
                                           min="0" :max="model.padres" type="number"
                                           placeholder="Numero de padres vivos">
                                    <span v-if="$v.padresVivos.$error" class="text-red-500 text-xs">El numero de padres vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col"
                                         v-show="model.padresVivos < model.padres && model.padresVivos != null || hermanosCausaMuerte || hijosCausaMuerte">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="padresCausaMuerte" class="h-[40px] inactive-input"
                                               :class="{'bg-gray-100' : editar}"
                                               :disabled="editar"
                                               type="text" placeholder="Causa de fallecimiento">
                                    </div>
                                </transition>
                            </div>
                            <div class="w-4/12 telefono:w-full">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hermanos <span
                                        class="text-blue-600">*</span></label>
                                    <input v-model="model.hermanos" type="number" :disabled="editar"
                                           :class="{'bg-gray-100' : editar}"
                                           class="h-[40px] mb-2 inactive-input"
                                           placeholder="Numero de padres">
                                    <span v-if="$v.hermanos.$error" class="text-red-500 text-xs">El numeros de hermanos es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hermanos vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionHermanos()" v-model="model.hermanosVivos" :disabled="editar"
                                           class="h-[40px] mb-2 inactive-input" :class="{'bg-gray-100' : editar}"
                                           type="number" placeholder="Numero de hermanos vivos">
                                    <span v-if="$v.hermanos.$error" class="text-red-500 text-xs">El numeros de hermanos vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col"
                                         v-show="model.hermanosVivos < model.hermanos && model.hermanosVivos != null || padresCausaMuerte || hijosCausaMuerte">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="hermanosCausaMuerte" class="h-[40px] inactive-input"
                                               :class="{'bg-gray-100' : editar}"
                                               :disabled="editar"
                                               type="text" placeholder="Causa de fallecimiento">
                                    </div>
                                </transition>
                            </div>
                            <div class="w-4/12 telefono:w-full">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hijos <span
                                        class="text-blue-600">*</span></label>
                                    <input v-model="model.hijos" type="number" :disabled="editar"
                                           :class="{'bg-gray-100' : editar}"
                                           class="h-[40px] mb-2 inactive-input"
                                           placeholder="Numero de padres">
                                    <span v-if="$v.hijos.$error" class="text-red-500 text-xs">El numeros de hijos es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hijos vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionHijos()" v-model="model.hijosVivos" :disabled="editar"
                                           :class="{'bg-gray-100' : editar}"
                                           class="h-[40px] mb-2 inactive-input"
                                           type="number" placeholder="Numero de hijos vivos">
                                    <span v-if="$v.hijos.$error" class="text-red-500 text-xs">El numeros de hijos vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col"
                                         v-show="model.hijosVivos < model.hijos && model.hijosVivos != null || hermanosCausaMuerte || padresCausaMuerte">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="hijosCausaMuerte" class="h-[40px] inactive-input"
                                               :class="{'bg-gray-100' : editar}"
                                               :disabled="editar"
                                               type="text" placeholder="Causa de fallecimiento">
                                    </div>
                                </transition>
                            </div>
                        </div>
                        <div class="flex w-full gap-4 telefono:flex-col">
                            <div class="w-[100%] overflow-x-auto rounded-sm border">
                                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                                    <h2>Enfermedades</h2>
                                </header>
                                <div class="w-[100%] telefono:w-full p-4">
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2">DM</label>
                                        <input v-model="dm" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               placeholder="DM">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">HTA</label>
                                        <input v-model="hta" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               placeholder="HTA">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Cancer</label>
                                        <input v-model="cancer" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               placeholder="Cancer">
                                    </div>
                                </div>
                            </div>
                            <div class="w-[100%] overflow-x-auto rounded-sm border">
                                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                                    <h2>Toxicomanias</h2>
                                </header>
                                <div class="w-[100%] telefono:w-full p-4">
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2">Alcoholismo</label>
                                        <input v-model="alcoholismo" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               placeholder="Alcoholismo">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Tabaquismo</label>
                                        <input v-model="tabaquismo" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               placeholder="Tabaquismo">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Drogas</label>
                                        <input v-model="drogas" type="text" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input mb-2"
                                               placeholder="Drogas">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Antecedentes patológicos <span
                        class="text-blue-600">*</span></h2>
                </header>
            </div>
            <div class="px-6 py-3">
                <section class="flex flex-col gap-3">
                    <div class="flex flex-col">
                        <textarea :disabled="editar" v-model="model.antecedentesPatologicos" class="inactive-input"
                                  :class="{'bg-gray-100' : editar}"
                                  placeholder="Antecedentes patológicos"></textarea>
                        <span v-if="$v.antecedentesPatologicos.$error" class="text-red-500 text-xs">El antecedente patológico es obligatorio</span>
                    </div>
                </section>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Antecedentes no patológicos<span
                        class="text-blue-600">*</span></h2>
                </header>
            </div>
            <div class="px-6 py-3">
                <section class="flex flex-col gap-3">
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio laboral <span
                            class="text-blue-600">*</span></label>
                        <textarea :disabled="editar" v-model="model.medioLaboral" class="inactive-input"
                                  :class="{'bg-gray-100' : editar}"
                                  placeholder="Medio laboral"></textarea>
                        <span v-if="$v.medioLaboral.$error"
                              class="text-red-500 text-xs">El medio Laboral es obligatorio</span>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio Sociocultural <span
                            class="text-blue-600">*</span></label>
                        <textarea :disabled="editar" v-model="model.medioSociocultural" class="inactive-input"
                                  :class="{'bg-gray-100' : editar}"
                                  placeholder="Medio Sociocultural"></textarea>
                        <span v-if="$v.medioSociocultural.$error" class="text-red-500 text-xs">El medio Sociocultural es obligatorio</span>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio Fisicoambiental <span
                            class="text-blue-600">*</span></label>
                        <textarea :disabled="editar" v-model="model.medioFisicoambiental" class="inactive-input"
                                  :class="{'bg-gray-100' : editar}"
                                  placeholder="Medio Fisicoambiental"></textarea>
                        <span v-if="$v.medioFisicoambiental.$error" class="text-red-500 text-xs">El medio Fisicoambiental es obligatorio</span>
                    </div>
                </section>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow" v-if="sexo === 'Mujer'">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Gineco-Obstetricos<span
                        class="text-blue-600">*</span></h2>
                </header>
            </div>
            <div class="px-6 py-3">
                <section class="flex flex-col gap-3">
                    <div class="flex flex-col">
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">FUM</label>
                                <input v-model="fum" type="text" :disabled="editar" :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       placeholder="FUM">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">FPP</label>
                                <input v-model="fpp" type="text" :disabled="editar" :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       placeholder="FPP">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Edad gestional</label>
                                <input v-model="edadGestional" type="number" :disabled="editar"
                                       :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       :placeholder="edadGestional">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Semanas</label>
                                <input v-model="semanas" type="number" :disabled="editar"
                                       :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       :placeholder="semanas">
                            </div>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Edad de la menarca</label>
                                <input v-model="menarca" type="text" :disabled="editar"
                                       :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       :placeholder="menarca">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Ritmo Menstrual</label>
                                <input v-model="ritmo" type="text" :disabled="editar" :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       :placeholder="ritmo">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Flujo vaginal<span
                                    class="text-blue-600">*</span></label>
                                <select class="h-[40px] inactive-input" v-model="flujoVaginalId" :disabled="editar"
                                        :class="{'bg-gray-100' : editar}">
                                    <option v-for="flujo in flujos" :value="flujo.flujoVaginalId">{{ flujo.descripcion
                                        }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Gestas</label>
                                <input v-model="gestas" type="number" :disabled="editar"
                                       :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       :placeholder="gestas">
                            </div>
                            <transition
                                enter-active-class="transition-opacity duration-500"
                                enter-from-class="opacity-0"
                                enter-to-class="opacity-100"
                                leave-active-class="transition-opacity duration-500"
                                leave-from-class="opacity-100"
                                leave-to-class="opacity-0">
                                <div class="flex gap-4 w-full telefono:flex-col" v-show="gestas > 0">
                                    <div class="flex flex-col w-full">
                                        <label class="text-gray-600 mb-2">Partos</label>
                                        <input v-model="partos" type="number" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               :placeholder="partos">
                                    </div>
                                    <div class="flex flex-col w-full">
                                        <label class="text-gray-600 mb-2">Cesareas</label>
                                        <input v-model="cesareas" type="number" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               :placeholder="cesareas">
                                    </div>
                                    <div class="flex flex-col w-full">
                                        <label class="text-gray-600 mb-2">Abortos</label>
                                        <input v-model="abortos" type="number" :disabled="editar"
                                               :class="{'bg-gray-100' : editar}"
                                               class="h-[40px] inactive-input"
                                               :placeholder="abortos">
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Anticonceptivos<span
                                    class="text-blue-600">*</span></label>
                                <select class="h-[40px] inactive-input" v-model="tipoAnticonceptivoId"
                                        :class="{'bg-gray-100' : editar}"
                                        :disabled="editar">
                                    <option v-for="anticonceptivo in anticonceptivos"
                                            :value="anticonceptivo.anticonceptivoId">
                                        {{ anticonceptivo.descripcion }}
                                    </option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Cirugías</label>
                                <input v-model="cirugias" type="text" :disabled="editar"
                                       :class="{'bg-gray-100' : editar}"
                                       class="h-[40px] inactive-input"
                                       placeholder="Cirugas del paciente">
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </div>
    <div class="w-full flex justify-end gap-3 px-3 telefono:flex-col-reverse telefono:p-0 mt-2" v-show="!spinner">
        <button >
            <p @click="editarDatos" v-if="editar === true"
               class="text-blue-700 font-medium underline hover:text-blue-800 telefono:basis-full p-3 pr-6 pl-6">
                Editar</p>
            <p v-else class="text-blue-700 font-medium underline hover:text-red-400 telefono:basis-full" @click="cancelarEdicion">Cancelar</p>
        </button>
        <transition
            enter-active-class="transition-opacity duration-500"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <button class="button-primary" v-show="!editar" @click="actualizarInterrogatorio" :disabled="loaderUpdate">
                <svg v-show="loaderUpdate" aria-hidden="true" role="status"
                     class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor" />
                </svg>
                Actualizar
            </button>
        </transition>
    </div>
</template>

<style scoped>
.custom-radio:checked + .opcion {
    @apply bg-principal text-white
}
</style>