<script setup>
import { base64IMG } from '@/services/verifyToken.js'

let props = defineProps({
    nombre: String,
    foto: String,
    hora: String,
    numero: Number
})
</script>

<template>
    <a href="#"
       class="group flex-none duration-200 h-[130px] w-[280px] telefono:w-[180px] telefono:h-[150px] flex flex-col gap-2 py-4 px-5 max-w-sm bg-white border rounded-lg shadow hover:bg-blue-600">
        <div class="flex items-center justify-between">
            <p class="font-bold text-lg tracking-tight text-blue-600 group-hover:text-white truncate">{{ props.nombre }}</p>
            <img :src="base64IMG + props.foto"
                 class="rounded-full h-8 w-8">
        </div>
        <p class="font-bold text-blue-600 group-hover:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {{ props.hora }} hrs.
        </p>

        <p class="group-hover:text-white text-blue-600 flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            {{ props.numero }}
        </p>
    </a>
</template>

<style scoped>

</style>