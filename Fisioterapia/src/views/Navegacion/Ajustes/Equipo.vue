<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import { usuarioCommand } from '@/api/usuarios/usuariosCommand.js'

let fisios = ref([])
let filter = ref(false)
let totalPaginasAPI = ref(1) // Nueva variable reactiva para el total de páginas desde la API
let loader = ref(false)
let fisioSearch = ref('')

onMounted(() => {
    getFisios(1, filter.value)
})

watch([() => fisioSearch.value, () => filter.value], ([newSearch, newFilter]) => {
    getFisios(1, newFilter, newSearch) // Llamamos a la función para actualizar la tabla, ahora con el nuevo valor de búsqueda
})


const getFisios = async (pag, estado) => {
    if (fisioSearch.value.length > 0) {
        let searching = await usuariosQueries.getSearcherFisio(pag, fisioSearch.value, estado)
        fisios.value = searching.fisioterapeutas
        totalPaginasAPI.value = searching.numPaginas
    } else {
        loader.value = true
        let response = await usuariosQueries.getFisios(pag, estado)
        fisios.value = response.fisioterapeutas
        totalPaginasAPI.value = response.numPaginas // Asignar el total de páginas desde la API
    }
    fisios.value.forEach(e => {
        e.editar = false
    })
    loader.value = false
}

const guardar = (fisio) => {
    fisio.editar = !fisio.editar
    console.log(fisio.editar)
}

const cambiarEstado = async (fisioId) => {
    await usuarioCommand.editarEstadoFisio(fisioId)
    getFisios(1, filter.value) // Recargar la primera página después de cambiar el estado
}

const paginaActual = ref(1)

// Ya no es necesario calcular totalPaginas, usamos el valor desde la API
const totalPaginas = computed(() => totalPaginasAPI.value)

// Calcular los datos paginados (esto depende de cómo funcione tu API)
const fisiosPaginacion = computed(() => {
    return fisios.value // Asume que la API ya maneja la paginación
})

const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina
        getFisios(pagina, filter.value) // Cargar la nueva página al cambiar
    }
}

// Cálculo de las páginas a mostrar
const paginasVisibles = computed(() => {
    const maxPaginas = 8
    const inicio = Math.max(1, paginaActual.value - Math.floor(maxPaginas / 2))
    const fin = Math.min(totalPaginas.value, inicio + maxPaginas - 1)
    const inicioAjustado = Math.max(1, fin - maxPaginas + 1)

    return Array.from({ length: fin - inicioAjustado + 1 }, (_, i) => inicioAjustado + i)
})
</script>


<template>
    <main>
        <header>
            <h1 class="text-principal text-center font-Prompt font-medium text-2xl mb-2">Equipo de trabajo</h1>
        </header>
        <div class="group max-w-md w-full mb-2 flex gap-2">
            <div class="telefono:w-full">
                <div class="relative flex top-[26px] items-center pl-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 group-focus-within:text-blue-500" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input v-model="fisioSearch" type="search" id="default-search"
                       class="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-600"
                       placeholder="Buscar" />
            </div>
            <select v-model="filter"
                    class="mt-[16px] telefono:w-full text-sm bg-gray-50 rounded-sm text-gray-500 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-600">
                <option :value="true">Solo activos</option>
                <option :value="false">Todos</option>
            </select>
            <div class="flex items-center mt-[16px]">
                <svg v-if="loader" aria-hidden="true"
                     class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                </svg>
            </div>
        </div>
        <div class="overflow-x-auto style_scroll">
            <div class="max-h-[700px] overflow-y-auto style_scroll">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Correo
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Teléfono
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Cédula
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Especialidad
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Acciones
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer group"
                        v-for="fisio in fisiosPaginacion">
                        <th scope="row" class="px-6 py-4 text-gray-900 font-medium">
                            <div class="flex items-center gap-3">
                                <img :src="'data:image/png;base64,' + fisio.foto" class="w-7 h-7 rounded-full">
                                <input type="text" v-model="fisio.nombre" :disabled="!fisio.editar"
                                       :class="{'bg-white border rounded-[3px] border-gray-300 p-0': fisio.editar, 'border-none group-hover:bg-gray-50 p-0': !fisio.editar}">
                                <span v-if="fisio.status" title="Activo"
                                      class="inline-block rounded-full h-2 w-2 bg-green-500"></span>
                                <span v-else title="Inactivo"
                                      class="inline-block rounded-full h-2 w-2 bg-yellow-500"></span>
                            </div>
                        </th>
                        <td class="px-6 py-4">
                            {{ fisio.correo }}
                        </td>
                        <td class="px-6 py-4">
                            {{ fisio.telefono }}
                        </td>
                        <td class="px-6 py-4">
                            {{ fisio.cedulaProfesional }}
                        </td>
                        <td class="px-6 py-4">
                            {{ fisio.especialidad }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="w-[16px] h-[18px]">
                                <div class="grid-center" title="Cambiar estado del fisioterapeuta"
                                     @click="cambiarEstado(fisio.fisioterapeutaId)">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" class="size-4 hover:text-yellow-500">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- Paginación -->
            <div class="flex flex-col md:flex-row justify-between mt-4 space-y-2 md:space-y-0">
                <button @click="cambiarPagina(paginaActual - 1)"
                        class="bg-gray-200 px-4 py-2 rounded-sm w-full md:w-auto hover:bg-opacity-90">Anterior
                </button>
                <div class="flex gap-5">
                    <button
                        v-for="pagina in paginasVisibles"
                        :key="pagina"
                        @click="cambiarPagina(pagina)"
                        :class="{'bg-blue-600 text-white': pagina === paginaActual, 'bg-gray-200': pagina !== paginaActual}"
                        class="px-4 py-2 rounded-sm hover:bg-opacity-90"
                    >
                        {{ pagina }}
                    </button>
                </div>
                <button @click="cambiarPagina(paginaActual + 1)"
                        class="bg-blue-600 text-white px-4 py-2 rounded-sm w-full md:w-auto hover:bg-opacity-90">
                    Siguiente
                </button>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>