<script setup>
import UsuarioCard from '@/views/Fisioterapeutas/FisiosCard.vue'
import fisioForm from '@/components/fisioterapeutas/FisioForm.vue'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import { computed, ref } from 'vue'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'

let modalPassword = ref(false)
let modal = ref(false)
let isHovered = ref(false)
let registro = ref(false)
let loader = ref(false)

const openAdminVerification = () => {
  modalPassword.value = true
    clave.value = ''
}
const closeAdminVerification = () => {
  modalPassword.value = false
}
//Cerramos el modal e indicamos que el registro esta completo
const finalizado = () => {
  modal.value = false
  registro.value = true
}

//Se abre el modal e indica que el registro esta incompleto
const inicio = () => {
  modal.value = true
  registro.value = false
}

let clave = ref('')
let spinner = ref(false)
let alerta = ref(false)
let msjAlerta = ref('')

const isSubmitDisabled = computed(() => {
  return clave.value.trim() === ''
})

const adminVerification = async () => {
  alerta.value = false
  spinner.value = true
  let response = await usuariosQueries.esAdmin(clave.value)
  if (response.isAdmin === true) {
    modalPassword.value = false
    clave.value = ''
    inicio()
  } else {
    alerta.value = true
    msjAlerta.value = 'Clave incorrecta, vuelve a intentarlo'
    clave.value = ''
    setTimeout(() => {
      alerta.value = false
    }, 3000)
  }
  spinner.value = false
}

const recibirLoader = (boolean) =>{
    loader.value = boolean
}
</script>

<template>
  <main class="overflow-x-hidden overflow-y-hidden">
    <header class="text-center mb-8 animate-fade-left animate-once">
      <h2 class="mb-4 text-3xl font-semibold text-gray-800 md:text-5xl lg:text-6xl">
        Nuestro
        <span class="rainbow-text">Maravilloso </span>
        <span class="underline decoration-blue-400" >Equipo</span>
      </h2>
      <p class="text-lg font-normal text-gray-600 lg:text-xl">
        <span :class="{'shimmer-black': loader}">Nuestros integrantes activos en estos momentos.</span>
      </p>
    </header>
    <section
      class="pb-4 grid grid-cols-[270px_270px_270px_270px_270px] justify-center gap-x-12 gap-y-7 telefono:grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-5 telefono:place-items-center"
    >
      <UsuarioCard @enviarCarga="recibirLoader" :actualizar="registro" />
    </section>

    <!-- Modales -->

    <TransitionRec
      class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40 transition-opacity"
      @click.self="modalPassword = false"
    >
      <div v-if="modalPassword">
        <div class="w-[450px] bg-white" @salir="closeAdminVerification()">
          <TransitionRec v-if="alerta" class="desktop:items-start laptop:items-start telefono:text-center tablet:text-center">
            <p v-show="alerta" class="text-red-500 text-sm px-6 pt-5 ">{{ msjAlerta }}</p>
          </TransitionRec>
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                Clave verificadora
              </h3>
              <p class="text-sm text-gray-500 mt-2">
                Ingresa la clave verificadora para poder agregar fisioterapeutas
              </p>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 flex desktop:flex laptop:flex tablet:flex-col telefono:flex-col ">
            <input v-model="clave" type="password" class="input-primary" />

            <button
              @click="adminVerification"
              type="button"
              class="button-primary text-sm text-center flex justify-center desktop::ml-3 laptop:ml-3 telefono:ml-0 tablet:mt-3 telefono:mt-3 "
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
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </TransitionRec>

    <TransitionRec
      class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40"
      @click.self="modal = false"
    >
      <div v-if="modal">
        <fisioForm class="w-[450px] bg-white" @salir="finalizado()" />
      </div>
    </TransitionRec>

    <div class="fixed bottom-8 right-8">
      <button
        class="bg-principal h-[50px] font-poppins text-white bg-opacity-45 hover:bg-opacity-100 transition-all duration-1000 ease-out"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
        :class="isHovered ? 'px-3 rounded' : 'w-[50px] rounded-full'"
        @click="openAdminVerification()"
      >
        <span v-if="isHovered">Agregar Fisioterapeutas +</span>
        <span v-else>+</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
.rainbow-text {
  background: linear-gradient(270deg, #90e0ef, #0077b6, #0062ff);
  background-size: 1400% 1400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 10s ease infinite;
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
