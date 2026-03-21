<script setup>
import { irExpediente, irInterrogatorio } from '@/router/rutasUtiles.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import { base64IMG } from '@/services/verifyToken.js'
import { ref } from 'vue'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import VerFoto from '@/components/PacientesComponents/VerFoto.vue'

let showFoto = ref(false)

let props = defineProps({
    pacientes:[],
})

const verificar = async (paciente) => {
    if (paciente.verificado === true){
        irExpediente(paciente.pacienteId)
    }else{
        const pregunta = await NotificacionesModal.PantallaWarning('Es necesario realizar el interrogatorio a este paciente', 'Continuar', 'Despues')
        if (pregunta.isConfirmed) {
            irInterrogatorio(paciente.pacienteId)
        }
    }
}

let fotoMostrar = ref('')

const mostrarFoto = (foto) =>{
    showFoto.value = true
    fotoMostrar.value = foto
}
</script>

<template>
    <div class="overflow-x-auto style_scroll">
        <div class="max-h-96 overflow-y-auto style_scroll">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Edad
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Sexo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Telefono
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr class="bg-white border-b hover:bg-gray-50 cursor-pointer" v-for="paciente in props.pacientes" @click="verificar(paciente)">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-4">
                        <img :src="base64IMG + paciente.foto" alt="" class="w-10 h-10 rounded-full object-cover hover:shadow-lg hover:shadow-blue-200 cursor-pointer"
                             @click.stop="mostrarFoto(paciente.foto)">
                        {{ paciente.nombre }}
                    </th>
                    <td class="px-6 py-4">
                        {{ paciente.edad }}
                    </td>
                    <td class="px-6 py-4">
                        {{ paciente.sexo }}
                    </td>
                    <td class="px-6 py-4">
                        {{ paciente.telefono }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <TransitionRec class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40" @click.self="showFoto = false">
            <VerFoto :imagen="base64IMG + fotoMostrar" v-if="showFoto"/>
        </TransitionRec>
    </div>

</template>

<style scoped>

</style>