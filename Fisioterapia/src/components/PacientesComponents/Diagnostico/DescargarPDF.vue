<script setup>
import { base64PDF } from '@/services/verifyToken.js'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { onMounted, ref } from 'vue'

let props = defineProps({
    diagnosticoId: String,
    nombre: String
})

let reporte = ref('')
let loaderVistaPDF = ref(false)
let botonEstado = ref(false)

onMounted(()=>{
    obtenerReporte()
})
const obtenerReporte = async () =>{
    loaderVistaPDF.value = true
    let response = await pacientesQueries.getReportes(props.diagnosticoId)
    if (!response){
        botonEstado.value = true
    }else{
        botonEstado.value = false
    }
    reporte.value = response.reporte
    loaderVistaPDF.value = false
}

const descargarReporte = async () => {
    // Asume que response.reporte contiene el string en base64
    const base64Data = reporte.value

    // Decodifica el base64 a binario
    const byteCharacters = atob(base64Data)

    // Crea un array de 8 bits
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    // Crea un array tipo Uint8Array
    const byteArray = new Uint8Array(byteNumbers)

    // Crea un Blob con el tipo MIME de PDF
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // Crea un enlace temporal para descargar el blob como un archivo PDF
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `reporte${props.nombre}.pdf` // Nombre del archivo que se descargará
    document.body.appendChild(link)
    link.click()

    // Limpia el DOM eliminando el enlace
    document.body.removeChild(link)
}
</script>

<template>
    <div class="w-[1000px] bg-white p-4">
        <h1 class="text-gray-700 font-medium text-xl text-center">Archivo del caso</h1>
        <div class="w-full flex justify-end mb-2">
            <button class="bg-blue-600 px-4 py-2 font-poppins text-white rounded-[3px] flex gap-2 hover:bg-opacity-95 transition transition-duration-300" :class="{'button-disabled ': loaderVistaPDF || botonEstado}" :disabled="loaderVistaPDF || botonEstado" @click="descargarReporte">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Descargar</button>
        </div>
        <div v-if="loaderVistaPDF" class="h-[700px] w-full flex items-center justify-center text-gray-600 mb-2">
            <svg aria-hidden="true" role="status" class="inline w-10 h-10 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Cargando PDF...
        </div>
        <iframe v-else :src="`${base64PDF + reporte}#toolbar=0`"  class="h-[700px] w-full shadow-lg mb-2 border"></iframe>
        <div class="p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 animate-fade-right" role="alert">
            <span class="font-medium">Zoom:</span> Control + rueda del raton para acercar/alejar
        </div>
    </div>
</template>

<style scoped>

</style>
