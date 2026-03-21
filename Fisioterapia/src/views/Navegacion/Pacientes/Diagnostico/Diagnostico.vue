<script setup>
import SignosVitales from '@/components/PacientesComponents/SignosVitales/SignosPost.vue'
import DatosDiagnostico from '@/components/PacientesComponents/Diagnostico/DatosDiagnostico.vue'
import MapaCorporal from '@/components/PacientesComponents/Diagnostico/MapaCorporal.vue'
import { useRoute } from 'vue-router'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import router from '@/router/index.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import AltaUsuario from '@/components/PacientesComponents/Diagnostico/AltaUsuario.vue'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import RevisionForm from '@/components/PacientesComponents/Diagnostico/RevisionForm.vue'
import SignosEspecificos from '@/components/PacientesComponents/SignosVitales/SignosEspecificos.vue'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import DatosEspecificos from '@/components/PacientesComponents/Diagnostico/DatosEspecificos.vue'
import Revisiones from '@/components/PacientesComponents/Diagnostico/Revisiones.vue'
import { base64IMG } from '@/services/verifyToken.js'
import { irExpediente } from '@/router/rutasUtiles.js'
import { clearLocalFormCacheByRoute } from '@/helpers/localFormCache.js'

const route = useRoute()
let nombre = ref('')
let sexo = ref('')
let apellido = ref('')
let pacienteId = ref(route.params.id)
let diagnosticoId = ref(route.params.diagnosticoId)
let expedienteId = ref('')
let loader = ref(false)
let imagen = ref(null)
let fechaNacimiento = ref(null)
let edad = ref(null)
let servicios = ref([])
let citaInicial = ref(false)
let notaFinal = ref(false)
let fisioterapeuta = ref('')
let tipoPago = ref('')

//SIGNOS VITALES
let temperatura = ref(null)
let fr = ref(null)
let fc = ref(null)
let presionArterial = ref(null)
let peso = ref(null)
let estatura = ref(null)
let imc = ref(null)
let indiceCinturaCadera = ref(null)
let saturacionoxigeno = ref(null)
//MAPA CORPORAL
let valores = ref([])
let rangoDolor = ref([])
let nota = ref(null)
let puntosMapa = ref([])

//DATOS DIAGNOSTIC
let diagnostico = ref(null)
let refiere = ref(null)
let categoria = ref(null)
let diagnosticoPrevio = ref(null)
let terapeuticaEmpleada = ref(null)
let diagnosticoFuncional = ref(null)
let padecimientoActual = ref(null)
let inspeccion = ref(null)
let palpitacion = ref(null)
let estudiosComplementarios = ref(null)
let diagnosticoNosologico = ref(null)

//DATOS PROGRAM
let cortoPlazo = ref(null)
let medianoPlazo = ref(null)
let largoPlazo = ref(null)
let tratamientoFisioterapeutico = ref(null)
let sugerencias = ref(null)
let pronostico = ref(null)
let seccionesDinamicas = ref([])

const initialSignosData = ref(null)
const initialMapaData = ref(null)
const initialDiagnosticoData = ref(null)

const draftKey = computed(() => `fisiolabs:diagnostico:draft:${pacienteId.value}:${diagnosticoId.value || 'nuevo'}`)

const buildDraftPayload = () => ({
    signos: {
        temperatura: temperatura.value,
        fr: fr.value,
        fc: fc.value,
        presionArterial: presionArterial.value,
        peso: peso.value,
        estatura: estatura.value,
        imc: imc.value,
        indiceCinturaCadera: indiceCinturaCadera.value,
        saturacionOxigeno: saturacionoxigeno.value
    },
    mapa: {
        valores: valores.value,
        rangoDolor: rangoDolor.value,
        notas: nota.value,
        puntos: puntosMapa.value
    },
    diagnostico: {
        diagnostico: diagnostico.value,
        refiere: refiere.value,
        categoria: categoria.value,
        diagnosticoPrevio: diagnosticoPrevio.value,
        terapeuticaEmpleada: terapeuticaEmpleada.value,
        diagnosticoFuncional: diagnosticoFuncional.value,
        padecimientoActual: padecimientoActual.value,
        inspeccion: inspeccion.value,
        palpitacion: palpitacion.value,
        estudiosComplementarios: estudiosComplementarios.value,
        diagnosticoNosologico: diagnosticoNosologico.value,
        cortoPlazo: cortoPlazo.value,
        medianoPlazo: medianoPlazo.value,
        largoPlazo: largoPlazo.value,
        tratamientoFisioterapeutico: tratamientoFisioterapeutico.value,
        sugerencias: sugerencias.value,
        pronostico: pronostico.value,
        seccionesDinamicas: seccionesDinamicas.value
    },
    cierre: {
        notasReview: notasReview.value,
        folioPago: folioPago.value,
        servicioId: servicioId.value
    },
    actualizadoEn: new Date().toISOString()
})

const persistDraft = () => {
    try {
        localStorage.setItem(draftKey.value, JSON.stringify(buildDraftPayload()))
    } catch (error) {
        console.error('No se pudo guardar el borrador local del diagnóstico', error)
    }
}

const restoreDraft = () => {
    try {
        const raw = localStorage.getItem(draftKey.value)
        if (!raw) return

        const parsed = JSON.parse(raw)

        if (parsed.signos) {
            initialSignosData.value = parsed.signos
            temperatura.value = parsed.signos.temperatura ?? temperatura.value
            fr.value = parsed.signos.fr ?? fr.value
            fc.value = parsed.signos.fc ?? fc.value
            presionArterial.value = parsed.signos.presionArterial ?? presionArterial.value
            peso.value = parsed.signos.peso ?? peso.value
            estatura.value = parsed.signos.estatura ?? estatura.value
            imc.value = parsed.signos.imc ?? imc.value
            indiceCinturaCadera.value = parsed.signos.indiceCinturaCadera ?? indiceCinturaCadera.value
            saturacionoxigeno.value = parsed.signos.saturacionOxigeno ?? saturacionoxigeno.value
        }

        if (parsed.mapa) {
            initialMapaData.value = parsed.mapa
            valores.value = parsed.mapa.valores ?? valores.value
            rangoDolor.value = parsed.mapa.rangoDolor ?? rangoDolor.value
            nota.value = parsed.mapa.notas ?? nota.value
            puntosMapa.value = parsed.mapa.puntos ?? puntosMapa.value
        }

        if (parsed.diagnostico) {
            initialDiagnosticoData.value = parsed.diagnostico
            diagnostico.value = parsed.diagnostico.diagnostico ?? diagnostico.value
            refiere.value = parsed.diagnostico.refiere ?? refiere.value
            categoria.value = parsed.diagnostico.categoria ?? categoria.value
            diagnosticoPrevio.value = parsed.diagnostico.diagnosticoPrevio ?? diagnosticoPrevio.value
            terapeuticaEmpleada.value = parsed.diagnostico.terapeuticaEmpleada ?? terapeuticaEmpleada.value
            diagnosticoFuncional.value = parsed.diagnostico.diagnosticoFuncional ?? diagnosticoFuncional.value
            padecimientoActual.value = parsed.diagnostico.padecimientoActual ?? padecimientoActual.value
            inspeccion.value = parsed.diagnostico.inspeccion ?? inspeccion.value
            palpitacion.value = parsed.diagnostico.palpitacion ?? parsed.diagnostico.exploracionFisicaDescripcion ?? palpitacion.value
            estudiosComplementarios.value = parsed.diagnostico.estudiosComplementarios ?? estudiosComplementarios.value
            diagnosticoNosologico.value = parsed.diagnostico.diagnosticoNosologico ?? diagnosticoNosologico.value
            cortoPlazo.value = parsed.diagnostico.cortoPlazo ?? cortoPlazo.value
            medianoPlazo.value = parsed.diagnostico.medianoPlazo ?? medianoPlazo.value
            largoPlazo.value = parsed.diagnostico.largoPlazo ?? largoPlazo.value
            tratamientoFisioterapeutico.value = parsed.diagnostico.tratamientoFisioterapeutico ?? tratamientoFisioterapeutico.value
            sugerencias.value = parsed.diagnostico.sugerencias ?? sugerencias.value
            pronostico.value = parsed.diagnostico.pronostico ?? pronostico.value
            seccionesDinamicas.value = parsed.diagnostico.seccionesDinamicas ?? seccionesDinamicas.value
        }

        if (parsed.cierre) {
            notasReview.value = parsed.cierre.notasReview ?? notasReview.value
            folioPago.value = parsed.cierre.folioPago ?? folioPago.value
            servicioId.value = parsed.cierre.servicioId ?? servicioId.value
        }
    } catch (error) {
        console.error('No se pudo restaurar el borrador local del diagnóstico', error)
    }
}

const clearDraft = () => {
    try {
        localStorage.removeItem(draftKey.value)
    } catch (error) {
        console.error('No se pudo limpiar el borrador local del diagnóstico', error)
    }
}

const persistBeforeUnload = () => {
    persistDraft()
}

const clearRouteFormCache = () => {
    clearLocalFormCacheByRoute(route.fullPath)
}

//REVIEW
let notasReview = ref('')
let folioPago = ref('')
let servicioId = ref('')


onMounted( () => {
    restoreDraft()
    window.addEventListener('beforeunload', persistBeforeUnload)
    if (diagnosticoId.value){
        citaInicial.value = true
    }
    datosPaciente()
    getExpediente()
    getCatalogos()
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', persistBeforeUnload)
    persistDraft()
})


const getCatalogos = async () =>{
    servicios.value = await catalogosQueries.getServicios(true)
}

const getExpediente = async ()=>{
    let responseExp = await pacientesQueries.getExpediente(pacienteId.value)
    expedienteId.value = responseExp?.expedienteId ?? ''
}
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

let modal = ref(false)
const revisionNueva = async () => {
    modal.value = true
}

/* Scroll para terminar el diagnostico */

const container = ref(null)
const final = ref(null)

const irFinal = () => {
    notaFinal.value = true

    nextTick().then(() => {
        if (final.value) {
            final.value.scrollIntoView({ behavior: 'smooth' })
        }
    })
}
/* Confirmación de finalizacion */

const finalizarDiagnostico = () => {
    irFinal()
}

const diagnosticoListo = async () => {
    const pregunta = await NotificacionesModal.PantallaWarning('¿Estas seguro que deseas concluir el caso?')

    if (pregunta.isConfirmed)
        ejecutarFinCaso()
}

const ejecucionFinal = () => {
    if (notaFinal.value)
        diagnosticoListo()
    else
        finalizarDiagnostico()
}

const obtenerSignos = (datos) => {
    temperatura.value = datos.temperatura
    fr.value = datos.fr
    fc.value = datos.fc
    presionArterial.value = datos.presionArterial
    peso.value = datos.peso
    estatura.value = datos.estatura
    imc.value = datos.imc
    indiceCinturaCadera.value = datos.indiceCinturaCadera
    saturacionoxigeno.value = datos.saturacionOxigeno
    persistDraft()
}

const obtenerMapa = (datos) => {
    valores.value = datos.valores
    rangoDolor.value = datos.rangoDolor
    nota.value = datos.notas
    puntosMapa.value = datos.puntos || []
    initialMapaData.value = datos
    persistDraft()
}

const obtenerDiagnostic = (datos) => {
    diagnostico.value = datos.diagnostico
    refiere.value = datos.refiere
    categoria.value = datos.categoria
    diagnosticoPrevio.value = datos.diagnosticoPrevio
    terapeuticaEmpleada.value = datos.terapeuticaEmpleada
    diagnosticoFuncional.value = datos.diagnosticoFuncional
    padecimientoActual.value = datos.padecimientoActual
    inspeccion.value = datos.inspeccion
    palpitacion.value = datos.exploracionFisicaDescripcion ?? datos.palpitacion
    estudiosComplementarios.value = datos.estudiosComplementarios
    diagnosticoNosologico.value = datos.diagnosticoNosologico

    cortoPlazo.value = datos.cortoPlazo
    medianoPlazo.value = datos.medianoPlazo
    largoPlazo.value = datos.largoPlazo
    tratamientoFisioterapeutico.value = datos.tratamientoFisioterapeutico
    sugerencias.value = datos.sugerencias
    pronostico.value = datos.pronostico
    seccionesDinamicas.value = datos.seccionesDinamicas || []
    initialDiagnosticoData.value = datos
    persistDraft()
}

let loaderBoton = ref(false)
let mapaCorp = ref(null)
const enviarDiagnostico = async () => {
    loaderBoton.value = true
    await mapaCorp.value.enviarMapa()
    const diagnosticoGuardado = await pacientesCommand.postDiagnostico(
        pacienteId.value,
        expedienteId.value,
        fr.value,
        fc.value,
        temperatura.value,
        peso.value,
        estatura.value,
        imc.value,
        indiceCinturaCadera.value,
        saturacionoxigeno.value,
        presionArterial.value,
        valores.value,
        rangoDolor.value,
        nota.value,
        puntosMapa.value,
        diagnostico.value,
        refiere.value,
        categoria.value,
        diagnosticoPrevio.value,
        terapeuticaEmpleada.value,
        diagnosticoFuncional.value,
        padecimientoActual.value,
        inspeccion.value,
        palpitacion.value,
        estudiosComplementarios.value,
        diagnosticoNosologico.value,
        cortoPlazo.value,
        medianoPlazo.value,
        largoPlazo.value,
        tratamientoFisioterapeutico.value,
        sugerencias.value,
        pronostico.value,
        notasReview.value,
        folioPago.value,
        servicioId.value,
        seccionesDinamicas.value
    )
    if (diagnosticoGuardado === true) {
        clearDraft()
        clearRouteFormCache()
    }
    loaderBoton.value = false
}

watch([notasReview, folioPago, servicioId], () => {
    persistDraft()
})

// Define la referencia para el componente hijo
const altaUsuarioRef = ref(null)

// Función para ejecutar el método del componente hijo
const ejecutarFinCaso = async () => {
    // Asegúrate de que la referencia esté disponible y el método exista
    if (altaUsuarioRef.value && typeof altaUsuarioRef.value.finCaso === 'function') {
        const finalizado = await altaUsuarioRef.value.finCaso()
        if (finalizado === true) {
            clearDraft()
            clearRouteFormCache()
        }
    } else {
        console.error('No se pudo encontrar el método finCaso en el componente hijo.')
    }
}

const revisiones = ref(null)

const revisionExitosa = () =>{
    modal.value = false
    revisiones.value.getRevisiones()
}
</script>

<template>
    <div class="flex gap-3 tablet:flex-wrap tablet:gap-0 telefono:flex-wrap">
        <section class="desktop:w-3/12 laptop:w-3/12 tablet:w-full telefono:w-full">
            <div class="sticky top-0 flex flex-col gap-2">
                <div
                    class="flex gap-2 py-3 px-2 border shadow-sm rounded-sm items-center telefono:flex-col animate-pulse"
                    v-if="loader">
                    <div class="h-12 w-12 rounded-full object-cover bg-blue-300"></div>
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
                            class="rounded-full object-cover h-12 w-12">
                    </div>
                    <div class="text-gray-600">
                        <h4 @click="irExpediente(pacienteId)" class="font-bold hover:text-gray-800 cursor-pointer">{{ nombre + ' ' + apellido }} <span class="text-blue-500">({{ sexo
                            }})</span></h4>
                        <div class="flex text-sm text-blue-800">
                            <p>{{ fechaNacimiento }} - <span>{{ edad }} años</span></p>
                        </div>
                    </div>
                </header>
                <div>
                    <signos-vitales v-if="!citaInicial" :initial-data="initialSignosData" @signos="obtenerSignos" />
                    <SignosEspecificos v-else/>
                </div>
                <div
                    class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                        <p>A cargo: <span class="text-blue-600">{{ fisioterapeuta }}</span></p>
                    </div>
                <div
                    class="flex items-center w-full text-left rtl:text-right text-black bg-gray-100 border px-6 py-3 telefono:text-center text-sm">
                    <p>Tipo de pago: <span class="text-blue-600">{{ tipoPago }}</span></p>
                </div>
                <div v-show="citaInicial" class="flex flex-col gap-2">
                    <button class="input-primary" @click="ejecucionFinal()"><span class="text-gray-600">
                        Finalizar
                    </span>
                    </button>
                </div>
            </div>
        </section>
        <section ref="container"
                 class="overflow-y-auto flex-col flex gap-5 style_scroll desktop:w-6/12 laptop:w-8/12 tablet:w-full telefono:w-full">
            <mapa-corporal ref="mapaCorp" v-if="!citaInicial" :initial-data="initialMapaData" @mapaC="obtenerMapa" :sexo="sexo" :loader="loader"></mapa-corporal>
            <mapa-corporal v-else :sexo="sexo" :loader="loader"></mapa-corporal>
            <datos-diagnostico v-if="!citaInicial" :initial-data="initialDiagnosticoData" @datosDiagnostico="obtenerDiagnostic" />
            <DatosEspecificos v-else/>
            <div ref="final" v-show="notaFinal">
                <AltaUsuario ref="altaUsuarioRef"></AltaUsuario>
            </div>
        </section>
        <section class="laptop:w-3/12 tablet:w-full telefono:w-full desktop:w-3/12">
            <!--Firma y refiere-->
            <div v-show="!citaInicial" class="sticky top-0 flex flex-col gap-2 telefono:mb-2">
                <h3 class="text-gray-600 text-lg font-semibold mb-2 tablet:mt-3">Datos para finalizar</h3>
                <div class="basis-2/4">
                    <label class="block mb-2 text-sm font-medium">Comprobante de pago
                        <span class="text-blue-600">*</span></label>
                    <input type="text"
                           v-model="folioPago"
                           placeholder="Ingrese folio del pago"
                           class="border border-gray-300 hover:border-blue-300 rounded-[3px] text-sm text-gray-500 w-full"
                           />
                </div>
                <div class="basis-2/4">
                    <label class="block mb-2 text-sm font-medium">Notas sobre la cita
                        <span class="text-blue-600">*</span></label>
                    <input type="text"
                           v-model="notasReview"
                           placeholder="Notas del diagnostico inicial"
                           class="border border-gray-300 hover:border-blue-300 rounded-[3px] text-sm text-gray-500 w-full"
                    />
                </div>
                <div class="basis-2/4">
                    <label class="block mb-2 text-sm font-medium">Servicio
                        <span class="text-blue-600">*</span></label>
                    <select v-model="servicioId" class="input-primary">
                        <option value="">Seleccione una opción</option>
                        <option v-for="servicio in servicios" :value="servicio.servicioId"> {{ servicio.descripcion }}</option>
                    </select>
                </div>
                <section class="telefono:w-full flex flex-col items-center pt-2">
                    <button class="button-primary w-full flex justify-center" :disabled="loaderBoton" @click="enviarDiagnostico">
                        <svg v-show="loaderBoton" aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                        <div v-if="loaderBoton">
                            Finalizando...
                        </div>
                        <div v-else>
                            Finalizar
                        </div>
                    </button>
                    <a class="text-blue-700 p-2 underline hover:text-gray-500 telefono:basis-full cursor-pointer"
                       @click="router.back()">Volver</a>
                </section>
            </div>
            <TransitionRec class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40"
                           @click.self="modal = false">
                <div v-if="modal">
                    <RevisionForm class="w-[450px] bg-white" @salir="revisionExitosa()"/>
                </div>
            </TransitionRec>
            <div v-show="citaInicial">
                <div>
                    <button @click="revisionNueva" class="button-primary w-full mb-4">Nueva revisión</button>
                    <h3 class="text-gray-600 text-lg font-semibold mb-3">Revisiones</h3>
                </div>
                <Revisiones ref="revisiones"/>
            </div>
        </section>
    </div>
</template>

<style scoped>
</style>
