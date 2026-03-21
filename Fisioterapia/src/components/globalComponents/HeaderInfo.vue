<script setup>
import { CerrarSesion, irAjustes, irInicio, irMetricas, irPacientes } from '@/router/rutasUtiles.js'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

let menu = ref(false)
let nombre = ref(localStorage.getItem("Usuario"))
let notis = ref(false)

const formatPath = () => {
    const pathSegments = route.path.split('/').filter(segment => segment)
    const firstTwoSegments = pathSegments.slice(0, 2).join(' - ')
    return firstTwoSegments || 'Inicio'
}

const MenuMobile = () => {
    menu.value = !menu.value
}

const CerrarMenu = (ruta) => {
    ruta()
    menu.value = !menu.value
}

const popNotificaciones = () => {
    notis.value = !notis.value
}
</script>

<template>
    <header class="w-full h-[60px] flex items-center justify-between p-4 border-b">
        <div class="font-bold text-l flex items-center gap-2">
            FisioLabs
            <span class="text-sm font-semibold text-blue-700 telefono:hidden">  - {{ formatPath() }}</span>
        </div>
        <div class="relative inline-block text-left">
            <button @click="MenuMobile()" id="dropdownDefaultButton"
                    class="font-semibold laptop:hidden tablet:hidden desktop:hidden telefono:w-[100px] telefono:h-[30px] flex items-center justify-center text-blue-600 rounded-full border border-blue-600"
                    type="button">Menu
                <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <!-- Dropdown menu -->
            <div v-show="menu" id="dropdown" class="z-10 flex bg-white absolute rounded-lg border w-44 left-[-40px] top-[40px]">
                <ul class="w-full py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                    <li @click="CerrarMenu(irInicio)">
                        <div class=" px-4 py-2 hover:bg-gray-100">Inicio</div>
                    </li>
                    <li @click="CerrarMenu(irPacientes)">
                        <div class="block px-4 py-2 hover:bg-gray-100">Pacientes</div>
                    </li>
                    <li @click="CerrarMenu(irMetricas)">
                        <div class="block px-4 py-2 hover:bg-gray-100">Metricas</div>
                    </li>
                    <li @click="CerrarMenu(irAjustes)">
                        <div class="block px-4 py-2 hover:bg-gray-100">Ajustes</div>
                    </li>
                    <li @click="CerrarSesion()">
                        <div class="block px-4 py-2 hover:bg-gray-100">Cerrar Sesion</div>
                    </li>
                </ul>
            </div>
        </div>
        <section class="flex items-center gap-2">
            <div @click="router.push({name:'Ajustes'})" class="md:flex border gap-2 rounded-full p-2 px-3 duration-200 hover:text-blue-600 hover:border-blue-600 group"
                 role="button">
                <img src="../../assets/icons/Usuario.png" class="h-7 w-7">
                <p class="font-semibold flex items-center text-gray-600 telefono:hidden group-hover:text-blue-600">{{ nombre }}</p>
            </div>
        </section>
            <!-- <div data-tooltip-target="Notificaciones" data-tooltip-placement="bottom" @click="notis = true"
                  class="p-2 text-gray-500 duration-200 hover:text-blue-600 hover:border-blue-600 flex justify-center border rounded-full">
                 <span class="absolute right-4 top-3 flex h-3 w-3">
                     <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                     <span class="absolute inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                 </span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-7 h-7">
                     <path stroke-linecap="round" stroke-linejoin="round"
                           d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                 </svg>
             </div>
             <div v-if="notis" class="w-[300px] h-[400px] overflow-y-auto style_scroll absolute bg-white border top-14 right-6 rounded-md z-[2]" v-click-away="popNotificaciones" >
                 <p v-for="load in 7" class="p-3 text-sm border-b text-gray-600 hover:bg-gray-50">
                     La cita de las 6:00 pm (Paciente) fue marcada como inasistencia <br> <span class="text-blue-600 text-[10px]">20/07/2024 14:00:00hrs</span>
                 </p>
             </div>-->
        <!--<div id="Notificaciones" role="tooltip"
             class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-blue-600 rounded-lg shadow-sm opacity-0 tooltip">
            Notificaciones
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>-->
    </header>
</template>

<style scoped>
</style>
