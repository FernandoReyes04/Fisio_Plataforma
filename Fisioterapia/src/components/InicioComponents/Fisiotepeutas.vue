<script setup>
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import { onMounted, ref } from 'vue'
import { irFisioterapeutas } from '@/router/rutasUtiles.js'
import { base64IMG } from '@/services/verifyToken.js'

let fisios = ref([])
let spinner = ref(false)

onMounted(() => {
    verFisios()
})

const verFisios = async () => {
    spinner.value = true
    let usuarios = await usuariosQueries.getLastsFisios(true)
    fisios.value = usuarios
    spinner.value = false
}
</script>

<template>
    <div class="rounded-sm border shadow border-blue-50">
        <div class="flex rounded-t-sm shadow-lg items-center justify-between px-6 py-5 gap-12 bg-blue-600 mb-4">
            <h5 class="text-lg font-semibold leading-none text-white">Fisioterapeutas</h5>
            <div @click="irFisioterapeutas" role="button"
                 class="text-sm font-medium text-cyan-100 hover:text-blue-100 truncate">
                Ver a todos
            </div>
        </div>
        <div class="animate-pulse w-[305px] telefono:w-full mt-2 p-6" v-if="spinner">
            <div class="px-6 py-4 bg-gray-300 mb-4 rounded" v-for="load in 7"></div>
        </div>
        <div v-else class="flex items-center px-4 mb-4" v-for="fisio in fisios" :key="fisio.id">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full object-cover shadow-lg"
                     :src="base64IMG + fisio.fotoPerfil"
                     alt="Foto">
            </div>
            <div class="flex-1 min-w-0 ms-4 mr-3">
                <p class="text-sm font-medium text-gray-900 truncate">
                    {{ fisio.nombre }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                    {{ fisio.correo }}
                </p>
            </div>
            <div class="items-center font-semibold text-gray-700 font-mono">
                {{ fisio.telefono }}
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>