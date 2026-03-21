<script setup>
import SignosPost from '@/components/PacientesComponents/SignosVitales/SignosPost.vue'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'

const route = useRoute()
let diagnosticoId = ref(route.params.diagnosticoId)

let servicios = ref([])
let servicio = ref('')
let folio = ref(null)
let notas = ref(null)


//SIGNOS VITALES
let temperaturaR = ref(null)
let frR = ref(null)
let fcR = ref(null)
let presionArterialR = ref(null)
let pesoR = ref(null)
let estaturaR = ref(null)
let imcR = ref(null)
let indiceCinturaCaderaR = ref(null)
let saturacionoxigenoR = ref(null)
let spinner = ref(false)


onMounted(()=>{
    getServices()
})
const getServices = async () =>{
    servicios.value = await catalogosQueries.getServicios(true)
}

const isSubmitDisabled = computed(() => {
    return spinner.value || !folio.value || !notas.value || !servicio.value ||
        !temperaturaR.value || !frR.value || !fcR.value ||
        !presionArterialR.value || !pesoR.value ||
        !estaturaR.value || !imcR.value ||
        !indiceCinturaCaderaR.value || !saturacionoxigenoR.value;
});


const obtenerSignos = (datos) => {
    temperaturaR.value = datos.temperatura
    frR.value = datos.fr
    fcR.value = datos.fc
    presionArterialR.value = datos.presionArterial
    pesoR.value = datos.peso
    estaturaR.value = datos.estatura
    imcR.value = datos.imc
    indiceCinturaCaderaR.value = datos.indiceCinturaCadera
    saturacionoxigenoR.value = datos.saturacionOxigeno
}
const emit = defineEmits(['salir'])

const subirRevision = async () =>{
    spinner.value = true
   let response = await pacientesCommand.crearRevision(notas.value,folio.value,diagnosticoId.value,servicio.value,frR.value,fcR.value,temperaturaR.value,pesoR.value,estaturaR.value,imcR.value,indiceCinturaCaderaR.value,saturacionoxigenoR.value,presionArterialR.value)
    if (response === true)
        emit('salir')
    spinner.value = false
}
</script>

<template>
    <div class="rounded-sm w-[800px]">
        <header class="text-2xl text-gray-600 p-4 bg-gray-100 flex justify-center rounded-tl rounded-tr">
            Revision
        </header>
        <div class="flex gap-3 p-3">
            <section class="w-7/12">
                <SignosPost @signos="obtenerSignos"/>
            </section>
            <section class="w-5/12 flex flex-col gap-2.5">
                <p>Comprobante de pago <span class="text-blue-600">*</span></p>
                <input type="text" class="input-primary" placeholder="Escribe aqui el folio de pago" v-model="folio">
                <p>Observaciones <span class="text-blue-600">*</span></p>
                <textarea name="" id="revision" cols="30" v-model="notas" placeholder="Escribe aqui tus observaciones de la revision" rows="9" class="input-primary resize-none"></textarea>
                <p>Servicios <span class="text-blue-600">*</span></p>
                <select name="" id="" class="input-primary" v-model="servicio">
                    <option value="">Ninguno</option>
                    <option v-for="servicio in servicios" :key="servicio.id" :value="servicio.servicioId"> {{ servicio.descripcion }}</option>
                </select>
                <button @click="subirRevision" class="rounded-[3px] p-2 bg-blue-600 text-white w-full hover:bg-pHover"
                        :disabled="isSubmitDisabled"
                        :class="{
                        'cursor-not-allowed': isSubmitDisabled
              }"
                >

                    <svg
                        v-show="spinner"
                        aria-hidden="true"
                        role="status"
                        class="inline w-5 h-5 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                        />
                    </svg>
                    Subir revisión</button>
            </section>
        </div>
    </div>
</template>

<style scoped>

</style>