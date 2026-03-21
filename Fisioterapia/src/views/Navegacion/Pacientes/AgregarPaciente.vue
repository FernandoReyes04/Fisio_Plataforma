<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import ImagenDefault from '@/assets/icons/Usuario.png'
import { irPacientes } from '@/router/rutasUtiles.js'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import useVuelidate from '@vuelidate/core'
import { maxLength, minLength, numeric, required } from '@vuelidate/validators'
import { catalogosQueries } from '@/api/catalogos/catalogosQueries.js'
import { usuariosQueries } from '@/api/usuarios/usuariosQueries.js'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import VerFoto from '@/components/PacientesComponents/VerFoto.vue'

let imageUrl = ref(ImagenDefault)
let inputFile = ref(null)
let fotoPerfil = ref(null)
let verificarTelefono = ref(false)
let sexo = ref(true)
let notas = ref('')
let spinner = ref(false)
let estadosCivil = ref([])
let fisioterapeutas = ref([])
let showFoto = ref(false)
const isDropdownOpen = ref(false)
let modalCamera = ref(false)
let imagenCapturada = ref(false)
const video = ref(null)
const canvas = ref(null)
const camara = ref(false)
let streamVideo = null;

onMounted(() => {
     getCatalogos()
})



const captureImage = () => {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.videoWidth
    canvas.value.height = video.value.videoHeight
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
    // Convertir el canvas a un Blob
    canvas.value.toBlob((blob) => {
        // Crear un archivo de tipo File a partir del Blob
        const file = new File([blob], 'fotoPerfil.png', { type: 'image/png' })
        fotoPerfil.value = file // Guardar el archivo en la variable

        // Ahora puedes usar `fotoPerfil` como un archivo para tu FormData
        imageUrl.value = URL.createObjectURL(file) // Si necesitas mostrar la imagen, usa createObjectURL

        // Detener la cámara después de capturar la imagen
        stopCamera()
    }, 'image/png')
    imagenCapturada.value = true
    stopCamera()
}

const usarCamara = async () =>{
    camara.value = true
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            streamVideo = await navigator.mediaDevices.getUserMedia({ video: true });
            video.value.srcObject = streamVideo;
        } catch (error) {
            console.error("Error al acceder a la cámara: ", error);
        }
    }
}

const stopCamera = () => {
    camara.value = false
    if (streamVideo) {
        const tracks = streamVideo.getTracks();
        tracks.forEach(track => track.stop());
        streamVideo = null;
        video.value.srcObject = null; // Limpia el video.srcObject
    }
}

const openModalCamera = () => {
    modalCamera.value = true
    usarCamara()
}
const closeModalCamera = () => {
    modalCamera.value = false
    stopCamera()
    imagenCapturada.value = false
}
const savePhoto = () => {
    modalCamera.value = false
    stopCamera()
    imagenCapturada.value = false
}


const getCatalogos = async () => {
     estadosCivil.value = await catalogosQueries.getEstadoCivil(true)
     fisioterapeutas.value = await usuariosQueries.getFisiosCat()
}
//Modelos reactivos
const model = reactive({
     nombre: '',
     apellido: '',
     edad: '',
     ocupacion: '',
     telefono: '',
     institucion: '',
     domicilio: '',
     codigoPostal: '',
     fisioterapeuta: '',
     estadoCivil: '',
     tipoPaciente: ''
})

//Se le aplica las reglas
const rules = {
     nombre: { required },
     apellido: { required },
     edad: { required },
     ocupacion: { required },
     telefono: { required, numeric, minLength: minLength(10), maxLength: maxLength(10) },
     institucion: { required },
     domicilio: { required },
     codigoPostal: { required, numeric, minLength: minLength(5), maxLength: maxLength(5) },
     fisioterapeuta: { required },
     estadoCivil: { required },
     tipoPaciente: { required }
}

//Aqui se junta el modelo con las reglas
const $v = useVuelidate(rules, model)

const imagenSeleccionada = (event) => {
     imageUrl.value = URL.createObjectURL(event.target.files[0])
     fotoPerfil.value = event.target.files[0]
     stopCamera()
}

const agregarPaciente = async () => {
     spinner.value = true
     //Habilitara los errores si existen
     $v.value.$touch()
     await pacientesCommand.postPacientes(
          model.nombre,
          model.apellido,
          model.institucion,
          model.domicilio,
          model.ocupacion,
          model.telefono,
         notas.value,
         model.estadoCivil,
         model.fisioterapeuta,
         sexo.value,
         model.tipoPaciente,
         model.codigoPostal,
          model.edad,
         fotoPerfil.value,
     )
     spinner.value = false
}



onUnmounted(()=>{
     stopCamera()
})
</script>


<template>
     <div class="flex telefono:flex-col">
          <section class="mr-3">
              <div
                  class="flex flex-col items-center gap-6 text-center telefono:justify-around tablet:justify-center"
              >
                  <header class="flex flex-col items-center gap-4 telefono:w-full telefono:items-center">
                      <h1 class="text-[24px] text-gray-600 font-bold text-center">Nuevo usuario</h1>
                      <div class="relative">
                          <div
                              class="absolute z-1 bottom-1 right-1 bg-principal rounded-full p-0.5 "
                          >
                              <div
                                  class="relative"
                                  @mouseover="isDropdownOpen = true"
                                  @mouseleave="isDropdownOpen = false"
                              >
                                  <svg
                                      class=""
                                      fill="white"
                                      width="32px"
                                      height="32px"
                                      viewBox="0 0 32 32"
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                      <g id="SVGRepo_iconCarrier">
                                          <path
                                              d="M16 12.906a4.47 4.47 0 0 0 0 8.938 4.47 4.47 0 0 0 4.469-4.469A4.47 4.47 0 0 0 16 12.906zm0 7.063a2.577 2.577 0 1 1-.002-5.154A2.577 2.577 0 0 1 16 19.969z"
                                          ></path>
                                          <path
                                              d="M25.625 9.812h-4.812l-2.062-2.75h-5.5l-2.062 2.75H6.375C5.618 9.812 5 10.43 5 11.188v12.375c0 .756.618 1.375 1.375 1.375h19.25c.757 0 1.375-.617 1.375-1.375V11.188c0-.758-.618-1.376-1.375-1.376zM16 23.477a6.103 6.103 0 1 1 .001-12.205A6.103 6.103 0 0 1 16 23.477zm9.625-10.399h-2.75v-1.375h2.75v1.375z"
                                          ></path>
                                      </g>
                                  </svg>
                                  <div
                                      v-if="isDropdownOpen"
                                      id="dropdownHover"
                                      class="absolute z-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                                  >
                                      <ul
                                          class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                          aria-labelledby="dropdownHoverButton"
                                      >
                                          <li>
                                              <label
                                                  for="inputFile"
                                                  class="flex items-center gap-1 cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white justify-center"
                                              >
                                                  Adjuntar foto
                                                  <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke-width="1.5"
                                                      stroke="currentColor"
                                                      class="size-4 ml-0.5"
                                                  >
                                                      <path
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                          d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                                                      />
                                                  </svg>
                                              </label>
                                          </li>
                                          <li>
                                              <div class="">
                                                  <div
                                                      class="flex gap-2 items-center cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white justify-center"
                                                      @click="openModalCamera()"
                                                      v-if="!camara"
                                                  >
                                                      Usar camara
                                                      <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          stroke-width="1.5"
                                                          stroke="currentColor"
                                                          class="size-4"
                                                      >
                                                          <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                                          />
                                                          <path
                                                              stroke-linecap="round"
                                                              stroke-linejoin="round"
                                                              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                                          />
                                                      </svg>
                                                  </div>
                                              </div>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <img
                              :src="imageUrl"
                              @click="showFoto = true"
                              class="h-40 w-40 object-cover rounded-full z-0"
                          />
                      </div>
                  </header>
                  <!--Modal para camara-->
                  <TransitionRec
                      class="fixed z-9999 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40 transition-opacity"
                      :class="{ 'pointer-events-auto': modalCamera, 'pointer-events-none': !modalCamera }"
                  >
                      <div v-if="modalCamera">
                          <div class="w-[450px] bg-white">
                              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:flex sm:items-start">
                                  <div class="mt-3 text-center sm:mt-0 sm:text-left">
                                      <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                                          Foto de perfil
                                      </h3>
                                      <div class="h-[450px]">
                                          <div v-if="camara">
                                              <video ref="video" autoplay class="h-40 w-40 object-cover rounded-full"></video>
                                              <canvas ref="canvas" style="display: none"></canvas>
                                          </div>
                                          <img v-else :src="imageUrl" alt="profile picture">
                                      </div>
                                  </div>
                              </div>
                              <div class="bg-gray-50 px-4 py-3 flex desktop:flex laptop:flex tablet:flex-col telefono:flex-col justify-between">
                                  <button v-if="!imagenCapturada" @click="captureImage()" type="button" class="button-primary">
                                      Tomar foto
                                  </button>
                                  <button v-else class="button-primary" @click="savePhoto()">
                                      Guardar foto
                                  </button>
                                  <button class="button-primary" @click="closeModalCamera()">
                                      Cancelar
                                  </button>
                              </div>
                          </div>
                      </div>
                  </TransitionRec>
                  <TransitionRec
                      class="fixed z-99 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40"
                      @click.self="showFoto = false"
                  >
                      <VerFoto :imagen="imageUrl" v-if="showFoto" />
                  </TransitionRec>
                  <input
                      ref="inputFile"
                      type="file"
                      id="inputFile"
                      class="hidden"
                      @change="imagenSeleccionada"
                  />
                  <svg
                      class="w-64 h-64 telefono:w-66 telefono:h-60"
                      viewBox="0 0 250 300"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                      <path d="M197.582 0H0V300H250V43.152L197.582 0Z" fill="#FFD890" fill-opacity="0.5" />
                      <path
                          d="M196.701 44.1913L196.576 1.0387L248.995 44.1913H196.701Z"
                          fill="#FF9839"
                          fill-opacity="0.5"
                      />
                      <foreignObject x="10" y="50" width="100%" height="100%">
            <textarea
                class="svgtext w-full text-gray-600"
                placeholder="Notas internas"
                v-model="notas"
            ></textarea>
                      </foreignObject>
                  </svg>
              </div>
          </section>
          <section class="desktop:w-9/12 laptop:w-9/12 tablet:w-full telefono:w-full">
               <details open class="cursor-pointer">
                    <summary class="text-principal text-xl mb-2">
                         Información general
                    </summary>
                    <hr class="border-b-blue-500 mb-3">
                    <div class="grid gap-6 mb-6 md:grid-cols-2">
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Nombre(s) <span
                                   class="text-blue-600">*</span> </label>
                              <input type="text"
                                     class="input-primary" v-model="model.nombre"
                                     placeholder="Pedro Alfonso" required />
                              <span v-if="$v.nombre.$error" class="text-red-500 text-xs">El nombre es obligatorio</span>
                         </div>
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Apellidos <span
                                   class="text-blue-600">*</span></label>
                              <input type="text"
                                     class="input-primary" v-model="model.apellido"
                                     placeholder="Lopez Blanco"
                                     required />
                              <span v-if="$v.apellido.$error"
                                    class="text-red-500 text-xs">El apellido es obligatorio</span>
                         </div>

                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Fecha de
                                   nacimiento <span class="text-blue-600">*</span> </label>
                              <input type="date" class="input-primary" placeholder="Select date" v-model="model.edad">
                              <span v-if="$v.edad.$error" class="text-red-500 text-xs">La edad es obligatoria</span>
                         </div>

                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Sexo <span
                                   class="text-blue-600">*</span></label>
                              <select class="input-primary" v-model="sexo">
                                   <option :value="true">Masculino</option>
                                   <option :value="false">Femenino</option>
                              </select>
                         </div>

                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Estado
                                   civil <span class="text-blue-600">*</span> </label>
                              <select class="input-primary" v-model="model.estadoCivil">
                                   <option value="">Elige una opcion</option>
                                   <option v-for="estadoCivil in estadosCivil" :value="estadoCivil.estadoCivilId">
                                        {{ estadoCivil.descripcion }}
                                   </option>
                              </select>
                              <span v-if="$v.estadoCivil.$error"
                                    class="text-red-500 text-xs">El estado civil es obligatorio</span>
                         </div>
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Ocupación<span
                                   class="text-blue-600">*</span></label>
                              <input type="text"
                                     class="input-primary" v-model="model.ocupacion"
                                     placeholder="Abogado"
                                     required />
                              <span v-if="$v.ocupacion.$error"
                                    class="text-red-500 text-xs">La ocupacion es obligatoria</span>
                         </div>
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Teléfono<span
                                   class="text-blue-600">*</span></label>
                              <input type="tel"
                                     class="input-primary" v-model="model.telefono"
                                     placeholder="9812308723"
                                     maxlength="10"
                                     required />
                              <span v-if="$v.telefono.$error" class="text-red-500 text-xs">El telefono debe contener 10 digitos del 0 al 9</span>
                              <span v-if="verificarTelefono"
                                    class="text-red-500 text-xs">El telefono ya esta en uso</span>
                         </div>

                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Institución <span
                                   class="text-blue-600">*</span></label>
                              <input type="text"
                                     class="input-primary" v-model="model.institucion"
                                     placeholder="SEAFI"
                                     required />
                              <span v-if="$v.institucion.$error"
                                    class="text-red-500 text-xs">La institucion es obligatoria</span>
                         </div>
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Fisioterapeuta <span
                                   class="text-blue-600">*</span></label>
                              <select name="" id="" class="input-primary" v-model="model.fisioterapeuta">
                                   <option value="">Elige una opcion</option>
                                   <option v-for="fisio in fisioterapeutas" :value="fisio.fisioId">
                                        {{ fisio.nombre }}
                                   </option>
                              </select>
                              <span v-if="$v.fisioterapeuta.$error"
                                    class="text-red-500 text-xs">El fisioterapeuta es obligatorio</span>
                         </div>
                         <div>
                              <label class="block mb-2 text-sm font-medium text-gray-600">Tipo de pago <span
                                   class="text-blue-600">*</span></label>
                              <select name="" id="" class="input-primary" v-model="model.tipoPaciente">
                                   <option value="">Elige una opcion</option>
                                   <option :value="true">Normal</option>
                                   <option :value="false">Al 50% (Afiliado UAC)</option>
                              </select>
                              <span v-if="$v.tipoPaciente.$error"
                                    class="text-red-500 text-xs">El tipo de pago es obligatorio</span>
                         </div>
                    </div>
               </details>
               <details open class="cursor-pointer">
                    <summary class="text-principal text-xl mb-2">
                         Información de residencia
                    </summary>
                    <hr class="mb-3">
                    <div class="flex gap-6 telefono:flex-wrap telefono:gap-1">
                         <div class="mb-6 basis-3/4 telefono:basis-full">
                              <label class="block mb-2 text-sm font-medium text-gray-600">Domicilio <span
                                   class="text-blue-600">*</span></label>
                              <input type="text"
                                     class="input-primary" v-model="model.domicilio"
                                     placeholder="1234 Calle Principal" required />
                              <span v-if="$v.domicilio.$error"
                                    class="text-red-500 text-xs">El domicilo es obligatorio</span>
                         </div>
                         <div class="mb-6 basis-1/4 telefono:basis-full">
                              <label class="block mb-2 text-sm font-medium text-gray-600">Código
                                   Postal <span class="text-blue-600">*</span></label>
                              <input type="text"
                                     class="input-primary"
                                     placeholder="00030" v-model="model.codigoPostal"
                                     maxlength="5"
                                     required />
                              <span v-if="$v.codigoPostal.$error" class="text-red-500 text-xs">El codigo postal es obligatorio y debe tener 5 digitos</span>
                         </div>
                    </div>
               </details>
               <div class="flex justify-end gap-6 flex-wrap telefono:flex-col-reverse">
                    <button @click="irPacientes()"
                            class="text-blue-700 underline hover:text-red-400 telefono:basis-full">
                         Cancelar
                    </button>
                    <button @click="agregarPaciente()" :disabled=spinner :class="{ 'bg-[#238dff]': spinner}"
                            class="button-primary">
                         <div v-if="spinner === false">
                              Guardar
                         </div>
                         <div v-if="spinner === true" role="status" class="flex justify-center items-center">
                              <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin"
                                   viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="#E5E7EB" />
                                   <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentColor" />
                              </svg>
                              Guardando
                         </div>
                    </button>
               </div>
          </section>
     </div>
</template>


<style scoped>

.svgtext {
     width: 80%;
     height: 77%;
     background-color: transparent;
     margin-right: 20px;
     outline: none;
     border: none;
     resize: none;
     scrollbar-width: thin;
     box-shadow: none;
}
</style>