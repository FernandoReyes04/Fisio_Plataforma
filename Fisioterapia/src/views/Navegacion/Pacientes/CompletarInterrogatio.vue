<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import { irPacientes } from '@/router/rutasUtiles.js'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'

const route = useRoute()

let pacienteId = ref(route.params.id)
let nombre = ref('')
let sexo = ref('')
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
let fum = ref(42)
let fpp = ref(null)
let edadGestional = ref(null)
let semanas = ref(null)
let menarca = ref(12)
let ritmo = ref(null)
let gestas = ref(null)
let partos = ref(null)
let cesareas = ref(null)
let abortos = ref(null)
let cirugias = ref(null)
let flujoVaginalId = ref("")
let flujosVag = ref([])
let anticonceptipos = ref([])
let tipoAnticonceptivoId = ref("")

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

onMounted(() => {
    datosPaciente()
    getCatalogos()
})

const getCatalogos = async () =>{
    flujosVag.value = await catalogosQueries.getFlujo(true)
    anticonceptipos.value = await catalogosQueries.getAnticonceptivos(true)
}
/* Peticiones HTTP */
const datosPaciente = async () => {
    let response = await pacientesQueries.getDatosPaciente(pacienteId.value)
    nombre.value = response.nombre
    sexo.value = response.sexo
}

const interrogatorioPaciente = async () => {
    $v.value.$touch()
    spinner.value = true
    await pacientesCommand.postInterrogatorio(sexo.value, pacienteId.value, tipoInterrogatorio.value, responsable.value, model.padres, model.padresVivos, padresCausaMuerte.value, model.hermanos, model.hermanosVivos, hermanosCausaMuerte.value, model.hijos, model.hijosVivos, hijosCausaMuerte.value, dm.value, hta.value, cancer.value, alcoholismo.value, tabaquismo.value, drogas.value, model.antecedentesPatologicos, model.medioLaboral, model.medioSociocultural, model.medioFisicoambiental, fum.value.toString(), fpp.value, edadGestional.value, semanas.value, menarca.value.toString(), ritmo.value, gestas.value, partos.value, cesareas.value, abortos.value, cirugias.value, flujoVaginalId.value, tipoAnticonceptivoId.value)
    spinner.value = false
}

function handleChange(tipo) {
    tipoInterrogatorio.value = tipo
}

//Modales
const adventencia = async () => {
    const pregunta = await NotificacionesModal.PantallaWarning('Se perderán todos los datos no guardados', 'Continuar', 'Cancelar')
    if (pregunta.isConfirmed) {
        irPacientes()
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
</script>

<template>
    <div class="flex gap-3 flex-col text-sm">
        <h1 class="text-blue-600 text-xl font-semibold">Interrogatorio del paciente ({{ nombre }} - {{ sexo }})</h1>
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
                                   @change="handleChange(true)" checked>
                            <label for="opcion1"
                                   class="opcion border-principal rounded-sm hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500 p-2 pr-6 pl-6 cursor-pointer hover:bg-principal hover:text-white">Directo</label>
                            <input type="radio" id="opcion2" name="opcion" class="custom-radio hidden"
                                   @change="handleChange(false)">
                            <label for="opcion2"
                                   class="opcion border-principal rounded-sm hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500 p-2 pr-6 pl-6 cursor-pointer hover:bg-principal hover:text-white">Indirecto</label>
                        </div>
                    </section>
                    <transition
                        enter-active-class="transition-opacity duration-500"
                        enter-from-class="opacity-0"
                        enter-to-class="opacity-100"
                        leave-active-class="transition-opacity duration-500"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0">
                        <section v-show="tipoInterrogatorio === false" class="mb-3 px-6 py-1 flex flex-col gap-3">
                            <div class="flex flex-col">
                                <label class="text-gray-600 mb-2 telefono:text-center telefono:mb-2">Responsable del
                                    paciente</label>
                                <input v-model="responsable" class="h-[40px] input-primary" type="text"
                                       placeholder="Responsable">
                            </div>
                        </section>
                    </transition>
                </div>
            </div>
        </section>
        <h3 class="text-gray-600 text-lg font-semibold">
            Antecedentes
        </h3>
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
                                    <input v-model="model.padres" type="number"
                                           class="h-[40px] mb-2 input-primary"
                                           placeholder="Número de padres">
                                    <span v-if="$v.padres.$error" class="text-red-500 text-xs">El número de padres es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Padres vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionPadres()" v-model="model.padresVivos"
                                           class="h-[40px] mb-2 input-primary"
                                           min="0" :max="model.padres" type="number" placeholder="Número de padres vivos">
                                    <span v-if="$v.padresVivos.$error" class="text-red-500 text-xs">El número de padres vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col" v-show="model.padresVivos < model.padres && model.padresVivos != null">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="padresCausaMuerte" class="h-[40px] input-primary"
                                               type="text" placeholder="Causa de fallecimiento">
                                    </div>
                                </transition>
                            </div>
                            <div class="w-4/12 telefono:w-full">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hermanos <span
                                        class="text-blue-600">*</span></label>
                                    <input v-model="model.hermanos" type="number"
                                           class="h-[40px] mb-2 input-primary"
                                           placeholder="Número de padres">
                                    <span v-if="$v.hermanos.$error" class="text-red-500 text-xs">El número de hermanos es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hermanos vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionHermanos()" v-model="model.hermanosVivos"
                                           class="h-[40px] mb-2 input-primary"
                                           type="number" placeholder="Número de hermanos vivos">
                                    <span v-if="$v.hermanos.$error" class="text-red-500 text-xs">El número de hermanos vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col"
                                         v-show="model.hermanosVivos < model.hermanos && model.hermanosVivos != null">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="hermanosCausaMuerte" class="h-[40px] input-primary"
                                               type="text" placeholder="Causa de fallecimiento">
                                    </div>
                                </transition>
                            </div>
                            <div class="w-4/12 telefono:w-full">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hijos <span
                                        class="text-blue-600">*</span></label>
                                    <input v-model="model.hijos" type="number"
                                           class="h-[40px] mb-2 input-primary"
                                           placeholder="Número de padres">
                                    <span v-if="$v.hijos.$error" class="text-red-500 text-xs">El número de hijos es obligatorio</span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 mb-2">Hijos vivos <span
                                        class="text-blue-600">*</span></label>
                                    <input @blur="validacionHijos()" v-model="model.hijosVivos"
                                           class="h-[40px] mb-2 input-primary"
                                           type="number" placeholder="Número de hijos vivos">
                                    <span v-if="$v.hijos.$error" class="text-red-500 text-xs">El número de hijos vivos es obligatorio</span>
                                </div>
                                <transition
                                    enter-active-class="transition-opacity duration-500"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition-opacity duration-500"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div class="flex flex-col" v-show="model.hijosVivos < model.hijos && model.hijosVivos != null">
                                        <label class="text-gray-600 mb-2">Causas de fallecimiento</label>
                                        <input v-model="hijosCausaMuerte" class="h-[40px] input-primary"
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
                                        <input v-model="dm" type="text"
                                               class="h-[40px] input-primary"
                                               placeholder="DM">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">HTA</label>
                                        <input v-model="hta" type="text"
                                               class="h-[40px] input-primary"
                                               placeholder="HTA">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Cancer</label>
                                        <input v-model="cancer" type="text"
                                               class="h-[40px] input-primary"
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
                                        <input v-model="alcoholismo" type="text"
                                               class="h-[40px] input-primary"
                                               placeholder="Alcoholismo">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Tabaquismo</label>
                                        <input v-model="tabaquismo" type="text"
                                               class="h-[40px] input-primary"
                                               placeholder="Tabaquismo">
                                    </div>
                                    <div class="flex flex-col">
                                        <label class="text-gray-600 mb-2 mt-2">Drogas</label>
                                        <input v-model="drogas" type="text"
                                               class="h-[40px] input-primary mb-2"
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
                        <input v-model="model.antecedentesPatologicos" type="text"
                               class="h-[40px] input-primary"
                               placeholder="Antecedentes patológicos">
                        <span v-if="$v.antecedentesPatologicos.$error" class="text-red-500 text-xs">El antecedente patologico es obligatorio</span>
                    </div>
                </section>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Antecedentes no patológicos</h2>
                </header>
            </div>
            <div class="px-6 py-3">
                <section class="flex flex-col gap-3">
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio laboral <span
                            class="text-blue-600">*</span></label>
                        <input v-model="model.medioLaboral" type="text"
                               class="h-[40px] input-primary"
                               placeholder="Medio laboral">
                        <span v-if="$v.medioLaboral.$error" class="text-red-500 text-xs">El medio Laboral es obligatorio</span>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio Sociocultural <span
                            class="text-blue-600">*</span></label>
                        <input v-model="model.medioSociocultural" class="h-[40px] input-primary"
                               type="text" placeholder="Medio Sociocultural">
                        <span v-if="$v.medioSociocultural.$error" class="text-red-500 text-xs">El medio Sociocultural es obligatorio</span>
                    </div>
                    <div class="flex flex-col">
                        <label class="text-gray-600 mb-2">Medio Fisicoambiental <span
                            class="text-blue-600">*</span></label>
                        <input v-model="model.medioFisicoambiental" class="h-[40px] input-primary"
                               type="text" placeholder="Medio Fisicoambiental">
                        <span v-if="$v.medioFisicoambiental.$error" class="text-red-500 text-xs">El medio Fisicoambiental es obligatorio</span>
                    </div>
                </section>
            </div>
        </section>
        <section class="overflow-x-auto rounded-sm border shadow" v-show="sexo == 'Mujer'">
            <div class="w-full text-sm text-left rtl:text-right text-gray-500">
                <header class="text-black bg-gray-100 px-6 py-3 telefono:text-center">
                    <h2>Gineco-Obstetricos</h2>
                </header>
            </div>
            <div class="px-6 py-3">
                <section class="flex flex-col gap-3">
                    <div class="flex flex-col">
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">FUM</label>
                                <input v-model="fum" type="text"
                                       class="h-[40px] input-primary"
                                       placeholder="FUM">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">FPP</label>
                                <input v-model="fpp" type="text"
                                       class="h-[40px] input-primary"
                                       placeholder="FPP">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Edad gestional</label>
                                <input v-model="edadGestional" type="number"
                                       class="h-[40px] input-primary"
                                       placeholder="Edad gestional">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Semanas</label>
                                <input v-model="semanas" type="number"
                                       class="h-[40px] input-primary"
                                       placeholder="Semanas">
                            </div>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Edad de la menarca</label>
                                <input v-model="menarca" type="text"
                                       class="h-[40px] input-primary"
                                       placeholder="Edad de la menarca">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Ritmo Menstrual</label>
                                <input v-model="ritmo" type="text"
                                       class="h-[40px] input-primary"
                                       placeholder="Ritmo Menstrual">
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Flujo vaginal</label>
                                <select class="h-[40px] input-primary" v-model="flujoVaginalId">
                                    <option value="">Seleccione</option>
                                    <option v-for="flujo in flujosVag" :value="flujo.flujoVaginalId">{{ flujo.descripcion }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Gestas</label>
                                <input v-model="gestas" type="number"
                                       class="h-[40px] input-primary"
                                       placeholder="Número de gestas">
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
                                        <input v-model="partos" type="number"
                                               class="h-[40px] input-primary"
                                               placeholder="Número de partos">
                                    </div>
                                    <div class="flex flex-col w-full">
                                        <label class="text-gray-600 mb-2">Cesareas</label>
                                        <input v-model="cesareas" type="number"
                                               class="h-[40px] input-primary"
                                               placeholder="Número de cesareas">
                                    </div>
                                    <div class="flex flex-col w-full">
                                        <label class="text-gray-600 mb-2">Abortos</label>
                                        <input v-model="abortos" type="number"
                                               class="h-[40px] input-primary"
                                               placeholder="Número de abortos">
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div class="flex gap-4 mb-2 telefono:flex-col">
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Anticonceptivos</label>
                                <select class="h-[40px] input-primary" v-model="tipoAnticonceptivoId">
                                    <option value="">Seleccione</option>
                                    <option v-for="anticoneptivo in anticonceptipos" :value="anticoneptivo.anticonceptivoId">
                                        {{ anticoneptivo.descripcion }}</option>
                                </select>
                            </div>
                            <div class="flex flex-col w-full">
                                <label class="text-gray-600 mb-2">Cirugias</label>
                                <input v-model="cirugias" type="text"
                                       class="h-[40px] input-primary"
                                       placeholder="Cirugas del paciente">
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </div>
    <div class="w-full flex gap-6 justify-end py-4 telefono:flex-col-reverse">
        <button class="text-blue-700 underline hover:text-red-400 telefono:basis-full" @click="adventencia()">
            Continuar sin interrogatorio
        </button>
        <button @click="interrogatorioPaciente()" :disabled=spinner :class="{ 'bg-[#238dff]': spinner}" class="button-primary">
            <div v-if="spinner === false">
                Guardar
            </div>
            <div v-if="spinner === true" role="status" class="flex justify-center items-center">
                <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Guardar
            </div>
        </button>
    </div>
</template>

<style scoped>
.custom-radio:checked + .opcion {
    @apply bg-principal text-white
}
</style>