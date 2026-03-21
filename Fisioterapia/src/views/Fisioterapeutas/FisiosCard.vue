<script setup>
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import { defineProps, onMounted, ref, watch } from 'vue'
import { base64IMG } from '@/services/verifyToken.js'
import ImagenDefault from '@/assets/icons/Usuario.png'

let fisios = ref([])
let loader = ref(false)
const emit = defineEmits(['enviarCarga']); // Definir el evento 'miEvento'

let props = defineProps({
    actualizar: Boolean
})

onMounted(() => {
    verFisios()
})

//Si el registro se acompleta el actualizar sera true
watch(() => props.actualizar, async () => {
    if(props.actualizar)
        verFisios()
})



const verFisios = async () => {
    loader.value = true
    emit('enviarCarga', loader.value)
    fisios.value = await usuariosQueries.equipoFisio()
    loader.value = false
    emit('enviarCarga', loader.value)
}
</script>

<template>
    <div v-for="fisio in fisios" :key="fisio.id" role="button"
         class="animate-fade-up animate-once max-w-sm text-center bg-white border border-gray-200 rounded-lg shadow hover:bg-blue-500 group transition-all duration-1000 ease-out">
        <img class="rounded-t-lg w-full h-[230px] object-cover group-hover:grayscale" :src="base64IMG + fisio.fotoPerfil" />
        <div class="p-3">
            <a>
                <h5 class="mb-2 text-[20px] font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-white overflow-hidden whitespace-nowrap text-ellipsis">
                    {{ fisio.nombre }}
                </h5>
            </a>
            <div class="mb-3 font-normal text-gray-700 dark:text-gray-400 group-hover:text-white">
                <p>{{ fisio.correo }}</p>
                <p>{{ fisio.telefono }}</p>
                <p>{{ fisio.especialidad }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>