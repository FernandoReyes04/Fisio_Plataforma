<script setup>
import { onMounted, ref, watch } from 'vue'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import { catalogosCommand } from '@/api/catalogos/catalogosCommand.js'
import TransitionRec from '@/components/recursos/TransitionRec.vue'

let anticonceptivos = ref([])
let nuevo = ref(false)
let nuevoCatalogo = ref('')
let spinner = ref(false)
let filtro = ref(false)

onMounted(() => {
    getAnticonceptivo(filtro.value)
})

watch(() => filtro.value, (newFiltro) => {
    filtro.value = newFiltro
    getAnticonceptivo(newFiltro)
})

const modificar = (anticonceptivo) => {
    anticonceptivo.editar = !anticonceptivo.editar
}

const guardar = async (anticonceptivo, id, descripcion, status) => {
    anticonceptivo.guardando = true
    // Aquí puedes agregar cualquier lógica adicional para guardar los cambios
    let response = await catalogosCommand.editarAnticonceptivo(id, descripcion, status)
    if (response === true){
        anticonceptivo.editar = false
        getAnticonceptivo(filtro.value)
    }
    else
        anticonceptivo.guardando = true
    getAnticonceptivo(filtro.value)
}

const agregar = () => {
    nuevo.value = !nuevo.value
}

const getAnticonceptivo = async (boolean) => {
    anticonceptivos.value = await catalogosQueries.getAnticonceptivos(boolean)
    anticonceptivos.value.reverse()
    // Añadir la propiedad `editar` a cada anticonceptivo
    anticonceptivos.value.forEach(e => {
        e.editar = false
        e.guardando = false
    })
}

const filtros = () => {
    getAnticonceptivo(filtro.value = !filtro.value)
}
const nuevoCat = async () => {
    spinner.value = true
    await catalogosCommand.agregarAnticonceptivo(nuevoCatalogo.value)
    nuevoCatalogo.value = ''
    nuevo.value = false
    getAnticonceptivo(filtro.value)
    spinner.value = false
}
</script>

<template>
    <div class="overflow-x-auto style_scroll">
        <div class="text-gray-600 mb-1 flex justify-between bg-white items-center">
            <div class="flex items-center gap-2">
                Anticonceptivos
                <svg @click="agregar" v-if="!nuevo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-5 hover:text-blue-600 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <svg @click="agregar" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-5 hover:text-red-600 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <div @click="filtros" class="cursor-pointer hover:text-blue-600">
                <p v-if="!filtro">Ver solo activos</p>
                <p v-else>Ver todos</p>
            </div>
        </div>
        <TransitionRec>
            <div class="flex p-1 gap-2" v-if="nuevo">
                <input type="text" v-model="nuevoCatalogo" class="input-primary"
                       placeholder="Escribe el valor para agregar al catalogo">
                <button class="button-primary flex" @click="nuevoCat">
                    <div v-if="!spinner">
                        Aceptar
                    </div>
                    <div class="flex" v-else>
                        <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor" />
                        </svg>
                        Guardando
                    </div>
                </button>
            </div>
        </TransitionRec>
        <div class="max-h-96 overflow-y-auto style_scroll">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                    class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Anticonceptivo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        ACCIONES
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer group"
                    v-for="anticonceptivo in anticonceptivos" :key="anticonceptivo.id">
                    <th :class="{'animate-pulse': anticonceptivo.guardando}" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <input type="text" v-model="anticonceptivo.descripcion" :disabled="!anticonceptivo.editar"
                               :class="{'bg-white border rounded-[3px] border-gray-300 p-0': anticonceptivo.editar, 'border-none group-hover:bg-gray-50 p-0': !anticonceptivo.editar}">
                        <span v-if="anticonceptivo.status" title="Activo" class="text-green-500 ml-2">Activo</span>
                        <span v-else title="Inactivo" class="text-yellow-500 ml-2">Inactivo</span>
                    </th>
                    <td class="px-6 py-4 flex gap-2">
                        <svg class="hover:stroke-blue-500 cursor-pointer" @click="modificar(anticonceptivo)"
                             stroke="#758CA3" width="28px"
                             viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                            <path
                                d="M25.5 18.5L28.5 15.5L24.5 11.5L21.5 14.5M25.5 18.5L15.5 28.5H11.5V24.5L21.5 14.5M25.5 18.5L21.5 14.5"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="w-[16px] h-[18px] grid-center hover:text-yellow-500" @click="guardar(anticonceptivo, anticonceptivo.anticonceptivoId,anticonceptivo.descripcion, !anticonceptivo.status)">
                            <svg
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" class="size-4 group">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
                        <svg v-show="anticonceptivo.editar"
                             @click="guardar(anticonceptivo, anticonceptivo.anticonceptivoId,anticonceptivo.descripcion, anticonceptivo.status)"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="#758CA3" class="size-6 hover:stroke-green-600 animate-fade animate-once">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

