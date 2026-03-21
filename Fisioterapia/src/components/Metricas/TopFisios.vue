<script setup>
import { onMounted, ref } from 'vue'
import { graficos } from '@/api/graficos/charts.js'
import { base64IMG } from '@/services/verifyToken.js'

let fisiosTop = ref([])

onMounted(()=>{
    getTop()
})

const getTop = async ()=> {
    fisiosTop.value = await graficos.topFisios()
    fisiosTop.value.forEach((e, index) => {
        e.top = index + 1 // Asigna 1, 2, 3, y así sucesivamente
    })
}
</script>

<template>
    <div class="flex justify-evenly items-end w-full"> <!-- Alinea los tres elementos, asegurando que el top 1 esté centrado -->
        <div v-for="fisios in fisiosTop" :key="fisios.nombre" class="flex flex-col items-center gap-1">
            <div class="relative">
                <img :src="base64IMG + fisios.foto"
                     class="rounded-full object-cover shadow-md shadow-blue-300"
                     :class="{
                        'w-48 h-48': fisios.top === 2,  /* Tamaño para top 2 */
                        'w-56 h-56': fisios.top === 1,  /* Tamaño más grande para top 1 */
                        'w-44 h-44': fisios.top === 3   /* Tamaño más pequeño para top 3 */
                     }">
                <svg class="w-8 h-8 bottom-0 right-2 absolute transform"
                     :class="{
                        'star-glow-yellow stroke-yellow-500 fill-amber-500': fisios.top === 1,
                        'star-glow-gray stroke-gray-500 fill-gray-400': fisios.top === 2,
                        'star-glow-amber stroke-yellow-800 fill-amber-700': fisios.top === 3
                     }"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
            </div>
            <p class="text-blue-700 font-semibold text-lg">{{ fisios.nombre }}</p>
            <p class="font-semibold text-gray-700">{{ fisios.total }} citas este mes</p>
        </div>
    </div>
</template>


<style scoped>
@keyframes glow-shadow {
    0%, 100% {
        filter: drop-shadow(0 0 5px #f7da00);
    }
    50% {
        filter: drop-shadow(0 0 15px #ffd700); /* Brillo más intenso en el centro */
    }
}

@keyframes glow-shadow-gray {
    0%, 100% {
        filter: drop-shadow(0 0 5px #808080);
    }
    50% {
        filter: drop-shadow(0 0 15px #a9a9a9);
    }
}

@keyframes glow-shadow-amber {
    0%, 100% {
        filter: drop-shadow(0 0 5px #b5651d);
    }
    50% {
        filter: drop-shadow(0 0 15px #ffbf00);
    }
}

/* Clases para aplicar el brillo con shadow */
.star-glow-yellow {
    animation: glow-shadow 1.5s infinite;
}

.star-glow-gray {
    animation: glow-shadow-gray 1.5s infinite;
}

.star-glow-amber {
    animation: glow-shadow-amber 1.5s infinite;
}
</style>
