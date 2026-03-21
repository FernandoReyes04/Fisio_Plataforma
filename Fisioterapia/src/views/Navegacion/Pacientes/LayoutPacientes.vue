<script setup>
import TablaUsuarios from '@/components/PacientesComponents/TablaUsuarios.vue'
import { irAgregarPacientes } from '@/router/rutasUtiles.js'
import { ref } from 'vue'

let buscador = ref('')
let estado = ref(true)
</script>

<template>
    <section class="flex justify-between align-mid mb-5 flex-wrap gap-3 telefono:flex-col-reverse">
        <div class="w-1/2 telefono:w-full flex gap-1">
            <div class="group max-w-md w-full">
                <div class="relative flex top-[26px] items-center pl-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 group-focus-within:text-blue-500" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input v-model="buscador" type="search" id="default-search"
                       class="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-600"
                       placeholder="Buscar" />
            </div>
             <select v-model="estado" name="" id="" class="mt-[16px] telefono:w-full text-sm bg-gray-50 rounded-sm text-gray-500 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-600">
                  <option :value="true">Activos</option>
                  <option :value="false">Todos</option>
             </select>
        </div>
        <div class="w-2/2 telefono:w-full">
            <button @click="irAgregarPacientes()" class="button-primary w-full">
                Nuevo paciente
            </button>
        </div>
    </section>
    <section>
        <TablaUsuarios :buscador :estado />
    </section>
</template>

<style scoped>

</style>