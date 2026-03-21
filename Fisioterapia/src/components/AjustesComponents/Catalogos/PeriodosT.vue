<script setup>
import { ref } from 'vue'

let editar = ref(false)
let nuevo = ref(false)
let periodos = ref('1 vez a la semana')

const modificar = () =>{
    editar.value = !editar.value
}

const guardar = () => {
    editar.value = false
    // Aquí puedes agregar cualquier lógica adicional para guardar los cambios
}

const agregar = () =>{
    nuevo.value = !nuevo.value
}
</script>

<template>
    <div class="overflow-x-auto style_scroll">
        <h2 class="text-gray-600 mb-1 flex bg-white gap-2 items-center">
            Periodos de tratamiento
            <svg @click="agregar" v-if="!nuevo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 hover:text-blue-600 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <svg @click="agregar" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 hover:text-red-600 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </h2>
        <div class="flex p-1 gap-2 animate-fade animate-once" v-show="nuevo">
            <input type="text" class="input-primary" placeholder="Escribe el valor para agregar al catalogo">
            <button class="button-primary">Aceptar</button>
        </div>
        <div class="max-h-96 overflow-y-auto style_scroll">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        ESPECIALIDAD
                    </th>
                    <th scope="col" class="px-6 py-3">
                        ACCIONES
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer group">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <input type="text" v-model="periodos" :disabled="!editar" :class="{'bg-white border rounded-[3px] border-gray-300 p-0': editar, 'border-none group-hover:bg-gray-50 p-0': !editar}">
                    </th>
                    <td class="px-6 py-4 flex gap-2">
                        <svg class="hover:stroke-blue-500 cursor-pointer" @click="modificar"
                             stroke="#758CA3" width="28px"
                             viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                            <path
                                d="M25.5 18.5L28.5 15.5L24.5 11.5L21.5 14.5M25.5 18.5L15.5 28.5H11.5V24.5L21.5 14.5M25.5 18.5L21.5 14.5"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg
                            class="hover:stroke-red-500 cursor-pointer" stroke="#758CA3" width="28px"
                            viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                            <path d="M17.875 18.9375V25.3125" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round" />
                            <path d="M22.125 18.9375V25.3125" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round" />
                            <path d="M11.5 14.6875H28.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M13.625 14.6875H20H26.375V26.375C26.375 28.1355 24.948 29.5625 23.1875 29.5625H16.8125C15.0521 29.5625 13.625 28.1355 13.625 26.375V14.6875Z"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M16.8125 12.5625C16.8125 11.3889 17.7639 10.4375 18.9375 10.4375H21.0625C22.2361 10.4375 23.1875 11.3889 23.1875 12.5625V14.6875H16.8125V12.5625Z"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg v-show="editar" @click="guardar" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#758CA3" class="size-6 hover:stroke-green-600 animate-fade animate-once">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>

</style>