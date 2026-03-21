<script setup>
import { ref } from "vue";
import { usuarioCommand } from "@/api/usuarios/usuariosCommand.js";
import TransitionRec from '@/components/recursos/TransitionRec.vue'

//recursos
let spinner = ref(false)
let alertError = ref(false)
let messageError = ref("")
//modelo
let username = ref("")
let contrasena = ref("")

const login = async () =>{
    spinner.value = true
    let response = await usuarioCommand.login(username.value, contrasena.value)

    if(response !== null){
        alertError.value = true
        messageError.value = response
    }

    spinner.value = false
}
</script>

<template>
    <div class="h-screen w-screen bg-fondo flex justify-center items-center">
        <div class="w-1/2 h-fit pb-pLogin pt-pLogin shadow-basic bg-white flex items-center pl-4 laptop:w-8/12 tablet:w-9/12 telefono:w-full telefono:h-full telefono:p-0 telefono:flex telefono:justify-center telefono:items-center telefono:flex-col telefono:gap-12">
            <div class="h-fit w-4/12 flex flex-col justify-center items-center gap-10 telefono:hidden">
                <h1 class="text-principal text-normal text-center font-bold font-poppins m-0 tablet:text-2xl">Fisioterapia</h1>
                <img class="w-2/4" src="../../assets/icons/fisioIcon.png" alt="">
            </div>
            <div class="hidden telefono:flex telefono:justify-center telefono:items-center telefono:h-auto">
                <img class="w-2/4" src="../../assets/icons/fisioIcon.png" alt="">
            </div>
            <form class="h-fit w-8/12 flex flex-col justify-center items-center gap-7 telefono:w-3/4 telefono:2/3 telefono:gap-6 telefono:h-auto">
                <TransitionRec>
                    <div class="w-8/12 h-[40px] bg-[#FED0D1] flex items-center justify-center rounded-sm" v-if="alertError">
                        <img src="../../assets/icons/error.png" class="p-1 h-[24px]">
                        <h5 class="p-1 text-gray-900 text-sm">{{ messageError }}</h5>
                    </div>
                </TransitionRec>
                <div class="flex flex-col w-8/12 justify-center gap-3 telefono:w-full">
                    <label class="text-gray-600">Nombre de usuario</label>
                    <input v-model="username" @focus="alertError = false" :disabled=spinner :class="{ 'bg-white': spinner }" class="h-[40px] border-principal rounded-sm p-3 text-gray-600 hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500" type="text"
                           placeholder="Nombre de usuario">
                </div>
                <div class="flex flex-col w-8/12 justify-center gap-3 telefono:w-full">
                    <label class="text-gray-600">Contraseña</label>
                    <input v-model="contrasena" @focus="alertError = false" :disabled=spinner class="h-[40px] border-principal rounded-sm p-3 text-gray-600 hover:outline-0 focus:text-blue-900 focus:outline-0 focus:border-blue-500" type="password"
                           placeholder="Contraseña">
                </div>
                <div class="flex flex-col w-8/12 justify-center gap-3 telefono:w-full">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" class="border rounded-sm border-gray-300">
                        <p class="text-sm text-gray-600">Recordarme</p>
                    </div>
                </div>
                <div class="w-full flex justify-center">
                    <button type="submit" @click.prevent="login()" :disabled=spinner :class="{ 'button-disabled': spinner}" class="w-8/12 h-[45px] text-1xl font-bold tracking-widest bg-blue-600 hover:bg-opacity-95 text-white rounded-sm telefono:w-full">
                        <div v-if="spinner === false">
                            Iniciar sesión
                        </div>
                        <div v-if="spinner === true" role="status" class="flex justify-center items-center">
                            <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            Iniciar sesión
                        </div>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>

.desactivar{
    background-color: #238dff;
}

</style>