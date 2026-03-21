<script setup>
import { onMounted, ref } from 'vue'

let alerta= ref(false)

onMounted(()=>{
    alertas()
})

const alertas = () =>{
    alerta.value = true;

    setTimeout(() => {
        alerta.value = false
    }, 4000);
}
</script>

<template>
    <transition enter-active-class="transition-opacity duration-1000"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-1000"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
        <div v-show="alerta" class="absolute right-2 bottom-0 p-4 mb-4 text-sm text-yellow-800 rounded-sm bg-yellow-50" role="alert">
                    <span class="font-medium">Aviso: </span> El estado de las citas se actualiza manualmente por el fisioterapeuta
        </div>
    </transition>
</template>

<style scoped>

</style>