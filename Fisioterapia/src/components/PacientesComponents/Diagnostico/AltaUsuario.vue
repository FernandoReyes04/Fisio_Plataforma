<script setup>
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import { computed, onMounted, ref, watch } from 'vue'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import { useRoute } from 'vue-router'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'

const route = useRoute()
let diagnosticoId = ref(route.params.diagnosticoId)
let pacienteId = ref(route.params.id)
let motivosAlta =ref([])
let motivoAlta = ref('')
let diagnosticoInicial = ref('')
let diagnosticoFinal = ref('')
let frecTrat = ref('')
let fisioterapeutas = ref([])
let fisioterapeutaSeguimientoId = ref('')

const cierreDraftKey = computed(() => `fisiolabs:diagnostico:cierre:${pacienteId.value}:${diagnosticoId.value || 'nuevo'}`)

const persistCierreDraft = () => {
    try {
        localStorage.setItem(cierreDraftKey.value, JSON.stringify({
            diagnosticoInicial: diagnosticoInicial.value,
            diagnosticoFinal: diagnosticoFinal.value,
            frecTrat: frecTrat.value,
            motivoAlta: motivoAlta.value,
            fisioterapeutaSeguimientoId: fisioterapeutaSeguimientoId.value,
            updatedAt: new Date().toISOString()
        }))
    } catch (error) {
        console.error('No se pudo guardar el borrador local de cierre de caso', error)
    }
}

const restoreCierreDraft = () => {
    try {
        const raw = localStorage.getItem(cierreDraftKey.value)
        if (!raw) return

        const parsed = JSON.parse(raw)
        diagnosticoInicial.value = parsed.diagnosticoInicial ?? diagnosticoInicial.value
        diagnosticoFinal.value = parsed.diagnosticoFinal ?? diagnosticoFinal.value
        frecTrat.value = parsed.frecTrat ?? frecTrat.value
        motivoAlta.value = parsed.motivoAlta ?? motivoAlta.value
        fisioterapeutaSeguimientoId.value = parsed.fisioterapeutaSeguimientoId ?? fisioterapeutaSeguimientoId.value
    } catch (error) {
        console.error('No se pudo restaurar el borrador local de cierre de caso', error)
    }
}

const clearCierreDraft = () => {
    try {
        localStorage.removeItem(cierreDraftKey.value)
    } catch (error) {
        console.error('No se pudo limpiar el borrador local de cierre de caso', error)
    }
}

onMounted(()=>{
    restoreCierreDraft()
    getCatalogos()
    getFisios()
})

watch([diagnosticoInicial, diagnosticoFinal, frecTrat, motivoAlta, fisioterapeutaSeguimientoId], () => {
    persistCierreDraft()
})
const getCatalogos = async () =>{
    motivosAlta.value =  await catalogosQueries.getMotivAlta(true)
}

const getFisios = async () => {
    fisioterapeutas.value = await usuariosQueries.getFisiosCat()
}

const finCaso = async () =>{
    const resultado = await pacientesCommand.finalizarDiagnostico(
        pacienteId.value,
        diagnosticoId.value,
        diagnosticoInicial.value,
        diagnosticoFinal.value,
        frecTrat.value,
        motivoAlta.value,
        fisioterapeutaSeguimientoId.value || null
    )

    if (resultado === true) {
        clearCierreDraft()
        return true
    }

    return false
}

defineExpose({
    finCaso
})
</script>

<template>
    <div class="flex flex-col gap-2 text-sm">
        <div class="text-red-400 text-center">Antes de finalizar, deberas rellar los ultimos campos</div>
        <!--Diagnostico Inicial-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnostico inicial
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <input type="text" v-model="diagnosticoInicial"
                           class=" input-primary resize-none"
                           placeholder="Ingrese el diagnostico inicial"/>
                </div>
            </details>
        </section>
        <!--Diagnostico final-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Diagnostico final
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <input type="text" v-model="diagnosticoFinal"
                           class=" input-primary resize-none"
                           placeholder="Ingrese el diagnostico final" />
                </div>
            </details>
        </section>
        <!--Frecuencia de tratamiento-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Frecuencia de tratamiento
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <select class="input-primary" v-model="frecTrat">
                        <option value="">Seleccione frecuencia</option>
                        <option value="1 vez a la semana">1 vez a la semana</option>
                        <option value="2 veces a la semana">2 veces a la semana</option>
                        <option value="3 veces a la semana">3 veces a la semana</option>
                        <option value="4 veces a la semana">4 veces a la semana</option>
                        <option value="5 veces a la semana">5 veces a la semana</option>
                    </select>
                </div>
            </details>
        </section>
        <!--Motivo de alta de servicio-->
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Fisioterapeuta para seguimiento (opcional)
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <select class="input-primary" v-model="fisioterapeutaSeguimientoId">
                        <option value="">Mantener fisioterapeuta actual</option>
                        <option v-for="fisio in fisioterapeutas" :value="fisio.fisioId">{{ fisio.nombre }}</option>
                    </select>
                </div>
            </details>
        </section>
        <section class="rounded-sm border shadow">
            <details open class="group">
                <summary
                    class="flex items-center w-full text-sm text-left rtl:text-right text-black bg-gray-100 px-6 py-3 telefono:text-center cursor-pointer">
                    Motivo de alta de servicio
                    <svg class="ml-auto fill-current opacity-75 w-4 h-4 transition-transform transform group-open:rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                </summary>
                <div class="px-6 py-3">
                    <select class="input-primary" v-model="motivoAlta">
                        <option value="">Seleccione un motivo de alta</option>
                        <option v-for="motivo in motivosAlta" :value="motivo.motivoAltaId"> {{ motivo.descripcion}}</option>
                    </select>
                </div>
            </details>
        </section>
    </div>
</template>

<style scoped>

</style>