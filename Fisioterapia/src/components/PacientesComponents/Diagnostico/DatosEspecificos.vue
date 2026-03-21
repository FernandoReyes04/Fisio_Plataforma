<script setup>
import { onMounted, ref, defineEmits } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { useRoute } from 'vue-router'

// Define el evento personalizado
const emit = defineEmits(['diagnostico-enviado']);

let route = useRoute()
let diagnosticoId = ref(route.params.diagnosticoId)
let diagnostico = ref({})

const getDynamicResponseText = (respuesta) => {
    if (respuesta === null || respuesta === undefined) return 'Sin respuesta'
    if (Array.isArray(respuesta)) return respuesta.join(', ')
    if (typeof respuesta === 'object') {
        if (respuesta.contenidoBase64) {
            return respuesta.nombre || 'Imagen adjunta'
        }
        return JSON.stringify(respuesta)
    }
    return String(respuesta)
}

const getDynamicImageSrc = (respuesta) => {
    if (!respuesta || typeof respuesta !== 'object' || !respuesta.contenidoBase64) return null
    const mime = respuesta.tipoContenido || 'image/png'
    return `data:${mime};base64,${respuesta.contenidoBase64}`
}

onMounted(() => {
    datosDiagnostico()
})

const datosDiagnostico = async () => {
    let response = await pacientesQueries.getDiagnosticoData(diagnosticoId.value);
    diagnostico.value = {
        diagnostico: response.diagnostico,
        fechaExploracion: response.ultimaRevision.substring(0, 10).replace(/-/g, '/').split('/').reverse().join('/'),
        refiere: response.diagnostic.refiere,
        categoria: response.diagnostic.categoria,
        diagnosticoPrevio: response.diagnostic.diagnosticoPrevio,
        terapeuticaEmpleada: response.diagnostic.terapeuticaEmpleada,
        diagnosticoFuncional: response.diagnostic.diagnosticoFuncional,
        padecimientoActual: response.diagnostic.padecimientoActual,
        inspeccion: response.diagnostic.inspeccion,
        palpitacion: response.diagnostic.exploracionFisicaDescripcion,
        estudiosComplementarios: response.diagnostic.estudiosComplementarios,
        diagnosticoNosologico: response.diagnostic.diagnosticoNosologico,
        fechaInicio: response.diagnostic.fechaInicio,
        estatus: response.diagnostic.estatus,
        cortoPlazo: response.program.cortoPlazo,
        medianoPlazo: response.program.medianoPlazo,
        largoPlazo: response.program.largoPlazo,
        tratamientoFisioterapeutico: response.program.tratamientoFisioterapeutico,
        sugerencias: response.program.sugerencias,
        pronostico: response.program.pronostico,
        inicial: response.diagnostic.diagnosticoInicial,
        final: response.diagnostic.diagnosticoFinal,
        frecuencia: response.diagnostic.frecuenciaTratamiento,
        motivoAlta: response.diagnostic.motivoAltaId,
        seccionesDinamicas: response.dynamicSections || response.DynamicSections || []
    }
    // Emitir el evento con el dato 'diagnostico'
    emit('diagnostico-enviado', diagnostico.value);
}
</script>

<template>
    <div class="flex flex-col gap-2 text-sm">
        <!--Diagnostico-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnóstico
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <input type="text" disabled v-model="diagnostico.diagnostico"
                           class="bg-gray-100 input-primary resize-none"
                           placeholder="Ingrese el diagnóstico" />
                </div>
            </details>
        </section>
        <!--Refiere-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Refiere
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <input type="text" disabled v-model="diagnostico.refiere"
                           class="bg-gray-100 input-primary resize-none"
                           placeholder="Ingrese nombre del personal médico que lo refirió aquí" />
                </div>
            </details>
        </section>
        <!--Categoría-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Categoría
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <input type="text" v-model="diagnostico.categoria"
                           disabled
                           class="bg-gray-100 input-primary resize-none"
                           placeholder="Ingrese la categoría" />
                </div>
            </details>
        </section>
        <!--Diagnóstico previo y terapeutica empleada-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnóstico previo del médico, terapéutica empleada y tratamientos afínes
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3 text-gray-500 flex flex-col gap-3">
                    <div>
                        <label for="" class="block mb-2">Diagnóstico previo del médico</label>
                        <textarea v-model="diagnostico.diagnosticoPrevio"
                            class="bg-gray-100 input-primary resize-none"
                            disabled
                            placeholder="Ingrese el diagnóstico previo del médico"
                        ></textarea>
                    </div>
                    <div>
                        <label for="" class="block mb-2">Terapéutica empleada y tratamientos afines</label>
                        <textarea v-model="diagnostico.terapeuticaEmpleada"
                            class="bg-gray-100 input-primary resize-none"
                            disabled
                            placeholder="Ingrese la terapéutica empleada y tratamientos afines"
                        ></textarea>
                    </div>
                </div>
            </details>
        </section>
        <!--Diagnóstico funcional-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnóstico funcional
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea v-model="diagnostico.diagnosticoFuncional"
              class="bg-gray-100 input-primary resize-none"
              disabled
              placeholder="Ingrese el diagnóstico funcional"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Padecimiento actual-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Padecimiento actual
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea v-model="diagnostico.padecimientoActual"
              class="bg-gray-100 input-primary resize-none"
              disabled
              placeholder="Ingrese el padecimiento actual"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Inspección general y específica-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Inspección general y específica
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none" v-model="diagnostico.inspeccion"
              disabled
              placeholder="Ingrese la inspección general y específica"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Palpación, sensibilidad...-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Palpación, sensibilidad y medidas antropométricas
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none" v-model="diagnostico.palpitacion"
              disabled
              placeholder="Ingrese la palpación, sensibilidad y medidas antropométricas"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Pruebas especiales y...-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Pruebas especiales y estudios complementarios
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none" v-model="diagnostico.estudiosComplementarios"
              disabled
              placeholder="Ingrese las pruebas especiales y estudios complementarios"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Diagnóstico nosológico...-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnóstico nosológico
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none" v-model="diagnostico.diagnosticoNosologico"
              disabled
              placeholder="Ingrese el diagnóstico nosológico"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Objetivos-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Programa fisioterapeutico: Objetivos
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3 text-gray-500 flex flex-col gap-3">
                    <div>
                        <label class="block mb-2">Corto plazo</label>
                        <textarea v-model="diagnostico.cortoPlazo"
                            class="bg-gray-100 input-primary resize-none"
                            disabled
                            placeholder="Ingrese los objetivos a corto plazo"
                        ></textarea>
                    </div>
                    <div>
                        <label class="block mb-2">Mediano plazo</label>
                        <textarea v-model="diagnostico.medianoPlazo"
                            class="bg-gray-100 input-primary resize-none"
                            disabled
                            placeholder="Ingrese los objetivos a mediano plazo"
                        ></textarea>
                    </div>
                    <div>
                        <label class="block mb-2">Largo plazo</label>
                        <textarea v-model="diagnostico.largoPlazo"
                            class="bg-gray-100 input-primary resize-none"
                            disabled
                            placeholder="Ingrese los objetivos a largo plazo"
                        ></textarea>
                    </div>
                </div>
            </details>
        </section>
        <!--Tratamiento fisioterapéutico...-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Tratamiento fisioterapéutico
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none"
              disabled v-model="diagnostico.tratamientoFisioterapeutico"
              placeholder="Ingrese el tratamiento fisioterapéutico"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Sugerencias y recomendaciones-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Sugerencias y recomendaciones
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea
              class="bg-gray-100 input-primary resize-none"
              disabled v-model="diagnostico.sugerencias"
              placeholder="Ingrese las sugerencias y recomendaciones"
          ></textarea>
                </div>
            </details>
        </section>
        <!--Pronósticos y recomendaciones-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Pronósticos y recomendaciones
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
          <textarea v-model="diagnostico.pronostico"
              class="bg-gray-100 input-primary resize-none"
              disabled
              placeholder="Ingrese los pronósticos y recomendaciones"
          ></textarea>
                </div>
            </details>
        </section>

        <section v-if="diagnostico.seccionesDinamicas && diagnostico.seccionesDinamicas.length" class="rounded-sm border shadow">
            <details open class="group">
                <summary class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Secciones dinámicas del diagnóstico
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3 flex flex-col gap-3">
                    <div v-for="seccion in diagnostico.seccionesDinamicas" :key="seccion.clave" class="border rounded p-3 bg-white">
                        <p class="text-gray-700 font-medium mb-2">{{ seccion.titulo }}</p>

                        <template v-if="seccion.tipoRespuesta === 'image' && getDynamicImageSrc(seccion.respuesta)">
                            <img :src="getDynamicImageSrc(seccion.respuesta)" alt="Imagen de sección dinámica" class="max-h-64 rounded border" />
                        </template>

                        <template v-else>
                            <textarea
                                class="bg-gray-100 input-primary resize-none"
                                disabled
                                rows="3"
                                :value="getDynamicResponseText(seccion.respuesta)">
                            </textarea>
                        </template>
                    </div>
                </div>
            </details>
        </section>
    </div>
</template>
