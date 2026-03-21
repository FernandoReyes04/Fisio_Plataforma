<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CerrarSesion } from '@/router/rutasUtiles.js'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import { usuarioCommand } from '@/api/usuarios/usuariosCommand.js'

const mostrarModalLogo = ref(false)
const logoActual = ref(null)
const imagenPrevisualizacion = ref(null)
const archivoSeleccionado = ref(null)
const errorValidacion = ref('')
const guardandoLogo = ref(false)
const inputArchivo = ref(null)

const cargarLogo = async () => {
    const logo = await usuariosQueries.getInstitutionLogo()

    if (logoActual.value && logoActual.value.startsWith('blob:')) {
        URL.revokeObjectURL(logoActual.value)
    }

    logoActual.value = logo
}

const abrirSelector = () => {
    inputArchivo.value?.click()
}

const procesarArchivo = (event) => {
    const archivo = event.target.files[0]
    errorValidacion.value = ''

    if (!archivo) return

    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg']
    if (!tiposPermitidos.includes(archivo.type)) {
        archivoSeleccionado.value = null
        imagenPrevisualizacion.value = null
        errorValidacion.value = 'Solo se permiten archivos PNG o JPG.'
        return
    }

    archivoSeleccionado.value = archivo

    if (imagenPrevisualizacion.value && imagenPrevisualizacion.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagenPrevisualizacion.value)
    }

    imagenPrevisualizacion.value = URL.createObjectURL(archivo)
}

const guardarLogo = async () => {
    if (!archivoSeleccionado.value || guardandoLogo.value) return

    guardandoLogo.value = true
    const result = await usuarioCommand.updateInstitutionLogo(archivoSeleccionado.value)
    guardandoLogo.value = false

    if (!result.success) {
        errorValidacion.value = result.message
        return
    }

    await cargarLogo()
    cerrarModal()
}

const cerrarModal = () => {
    mostrarModalLogo.value = false
    archivoSeleccionado.value = null
    errorValidacion.value = ''

    if (imagenPrevisualizacion.value && imagenPrevisualizacion.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagenPrevisualizacion.value)
    }

    imagenPrevisualizacion.value = null

    if (inputArchivo.value) {
        inputArchivo.value.value = ''
    }
}

onMounted(async () => {
    await cargarLogo()
})

onBeforeUnmount(() => {
    if (logoActual.value && logoActual.value.startsWith('blob:')) {
        URL.revokeObjectURL(logoActual.value)
    }

    if (imagenPrevisualizacion.value && imagenPrevisualizacion.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagenPrevisualizacion.value)
    }
})
</script>

<template>
    <nav class="flex flex-col items-center w-16 h-screen space-y-8 bg-white border-r border-gray-300 telefono:hidden relative">
        <div class="flex flex-col items-center w-16 py-3 space-y-5">
            <div @click="mostrarModalLogo = true"
                 class="cursor-pointer hover:opacity-80 transition-opacity p-1 rounded border border-transparent hover:border-gray-200 relative group"
                 title="Cambiar logo">
                <img v-if="logoActual" class="w-auto h-10 object-contain" :src="logoActual" alt="Logo Institucional">
                <div v-else class="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5V8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25v8.25M3 16.5l3.879-3.879a1.5 1.5 0 0 1 2.121 0L12 15.621m-9 0v.879A2.25 2.25 0 0 0 5.25 18.75h13.5A2.25 2.25 0 0 0 21 16.5v-.879m-9-3.75 1.629-1.629a1.5 1.5 0 0 1 2.121 0L21 15.621" />
                    </svg>
                </div>

                <div class="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                </div>
            </div>
            <router-link :to="{name:'Inicio'}" active-class="active_item border-l-4 border-blue-600"
                         data-tooltip-target="Inicio" data-tooltip-placement="right"
                         class="w-full p-1.5 text-gray-500 duration-100 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </router-link>
            <div id="Inicio" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Inicio
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <router-link :to="{name:'Pacientes'}"
                         active-class="active_item border-l-4 border-blue-600 text-blue-600"
                         data-tooltip-target="Pacientes" data-tooltip-placement="right"
                         class="w-full p-1.5 duration-100 text-gray-500 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </router-link>
            <div id="Pacientes" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Pacientes
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <router-link :to="{name:'Calendario'}" active-class="active_item border-l-4 border-blue-600"
                         data-tooltip-target="Calendario"
                         data-tooltip-placement="right"
                         class="w-full p-1.5 text-gray-500 duration-100 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            </router-link>
            <div id="Calendario" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Calendario
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <router-link :to="{name:'Metricas'}" active-class="active_item border-l-4 border-blue-600"
                         data-tooltip-target="Metricas"
                         data-tooltip-placement="right"
                         class="w-full p-1.5 text-gray-500 duration-100 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
            </router-link>
            <div id="Metricas" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Métricas
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <router-link :to="{name:'Ajustes'}" active-class="active_item border-l-4 border-blue-600"
                         data-tooltip-target="Ajustes"
                         data-tooltip-placement="right"
                         class="w-full p-1.5 text-gray-500 duration-100 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </router-link>
            <div id="Ajustes" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Ajustes
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>

        <div class="flex items-end w-16 h-screen py-4 cursor-pointer">
            <div @click="CerrarSesion()" data-tooltip-target="Sesion" data-tooltip-placement="right"
                 class="w-full p-1.5 text-gray-500 duration-200 hover:text-blue-600 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
            </div>
            <div id="Sesion" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
                Cerrar Sesión
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    </nav>

    <div v-if="mostrarModalLogo" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button @click="cerrarModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Actualizar Logo</h3>

            <div class="flex flex-col items-center space-y-4">
                <input type="file" ref="inputArchivo" accept=".jpg, .jpeg, .png" class="hidden" @change="procesarArchivo">

                <div @click="abrirSelector"
                     class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative">
                    <img v-if="imagenPrevisualizacion" :src="imagenPrevisualizacion" class="h-full w-auto object-contain p-2" alt="Vista previa">
                    <img v-else-if="logoActual" :src="logoActual" class="h-16 w-auto object-contain opacity-50 grayscale" alt="Logo actual">
                    <span v-else class="text-xs text-gray-500">Click para subir (PNG/JPG)</span>
                </div>

                <p v-if="errorValidacion" class="text-red-500 text-xs text-center">{{ errorValidacion }}</p>

                <div class="flex space-x-3 w-full pt-2">
                    <button @click="cerrarModal"
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium">
                        Cancelar
                    </button>
                    <button @click="guardarLogo"
                            :disabled="!archivoSeleccionado || guardandoLogo"
                            :class="archivoSeleccionado && !guardandoLogo ? 'bg-blue-600 hover:bg-blue-700 shadow' : 'bg-blue-300 cursor-not-allowed'"
                            class="flex-1 px-4 py-2 text-white rounded transition-colors text-sm font-medium">
                        {{ guardandoLogo ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.active_item {
    color: #0062FF !important;
}

.disabled {
    pointer-events: none;
}
</style>