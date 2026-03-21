<script setup>
import { irEditarPaciente, irExpediente, irInterrogatorio } from '@/router/rutasUtiles.js'
import { onMounted, ref, watch } from 'vue'
import { pacientesQueries } from '@/api/pacientes/pacientesQueries.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import { notifiacionApi } from '@/helpers/notifications/ConsumoAlertas.js'
import { pacientesCommand } from '@/api/pacientes/pacientesCommand.js'
import { base64IMG } from '@/services/verifyToken.js'
import TransitionRec from '@/components/recursos/TransitionRec.vue'
import VerFoto from '@/components/PacientesComponents/VerFoto.vue'

let props = defineProps({
     pagina: Number,
     buscador: String,
     estado: Boolean
})

let pacientes = ref([])
let paginas = ref(null)
let paginaActual = ref(1)
let ultimaPagina = ref(null)
let totalPacientes = ref(null)
let inicioPaciente = ref(null)
let finalPaciente = ref(null)
let buscador = ref(props.buscador)
let loader = ref(false)
let showFoto = ref(false)

//El watch sera para we este a la escucha de que el props cambie
watch([() => props.buscador, () => props.estado], ([newBuscador, newEstado]) => {
     buscador.value = newBuscador
     obtenerTablaPacientes(1, newEstado)
})

onMounted(() => {
     obtenerTablaPacientes(1, props.estado)
})

let actualizar = ref(true)

const paginacion = (page) => {
     ultimaPagina.value = page

     muestraPacientes(paginaActual, totalPacientes.value)

     if (page > 5) {
          let alto = page - 1

          let inicial = Math.max(1, paginaActual.value - 2)

          if (paginas.value !== null) {
               /* Hacia adelante */
               let posicion = paginas.value[3]

               if (posicion <= paginaActual.value) {
                    actualizar.value = true
                    if (paginaActual.value === page - 1) {
                         inicial = Math.max(1, paginaActual.value - 3)
                    }
               }

               if (posicion === alto) {
                    actualizar.value = false
               }

               /* Hacia atras */
               posicion = paginas.value[1]

               if (posicion >= paginaActual.value) {
                    actualizar.value = true
               }
          }

          if (actualizar.value) {
               paginas.value = Array.from({ length: 5 }, (_, index) => inicial + index)
               actualizar.value = false
          }
     } else {
          paginas.value = Array.from({ length: page }, (_, index) => index + 1)
     }
}

const muestraPacientes = (pagina, total) => {
     inicioPaciente.value = pagina.value === 1 ? '1' : (pagina.value - 1) + '1'
     finalPaciente.value = paginaActual.value === Math.ceil(total / 10) ? (pagina.value - 1) + '' + (total % 10) : pagina.value + '0'
}

const obtenerTablaPacientes = async (pagina, estado) => {
     loader.value = true
     paginaActual.value = pagina
     //Si el buscador no hay nada devolvera todos los pacientes
     if (props.buscador.length > 0) {
          let searching = await pacientesQueries.getBuscador(pagina,buscador.value, props.estado)
          //Este es el numero de paginas total
          pacientes.value = searching?.pacientes ?? []
          //Para cuando busquemos algo por defecto inicie en la pagina 1
          //paginaActual.value = 1;
          //Nos pintara las paginas
          paginacion(searching?.numPaginas ?? 1)
          totalPacientes.value = searching?.total ?? 0
     } else {
          let getAll = await pacientesQueries.getPacientes(pagina,estado)
          pacientes.value = getAll?.pacientes ?? []
          paginacion(getAll?.numPaginas ?? 1)
          totalPacientes.value = getAll?.total ?? 0
     }
     pacientes.value.forEach(e =>{
          e.modificando = false
     })
     loader.value = false
}

const citas = async (id) => {
     const pregunta = await NotificacionesModal.PantallaWarning('Es necesario realizar el interrogatorio a este paciente', 'Continuar', 'Después')
     if (pregunta.isConfirmed) {
          irInterrogatorio(id)
     }
}

const archivar = async (id, nombre, status, paciente) => {
     console.log(paciente.modificando)
     if (status === true){
          const pregunta = await NotificacionesModal.PantallaArchivar(`¿Desea archivar a este paciente: ${nombre}?`)
          if (pregunta.isConfirmed) {
               paciente.modificando = true
               let respuesta = await pacientesCommand.archivarPaciente(id)
               paciente.modificando = false
               if (respuesta === true) {
                    if (pacientes.value.length === 1) {
                         obtenerTablaPacientes(paginaActual.value - 1, true)
                    } else {
                         await obtenerTablaPacientes(paginaActual.value, props.estado)
                         finalPaciente.value -= 1
                    }
               }
          }
     }else{
          const pregunta2 = await NotificacionesModal.PantallaPonerActivo(`¿Desea poner activo a este paciente: ${nombre}?`)
          if (pregunta2.isConfirmed) {
               paciente.modificando = true
               let respuesta = await pacientesCommand.archivarPaciente(id)
               paciente.modificando = false
               if (respuesta === true) {
                    if (pacientes.value.length === 1) {
                         obtenerTablaPacientes(paginaActual.value - 1, true)
                    } else {
                         await obtenerTablaPacientes(paginaActual.value, props.estado)
                         finalPaciente.value -= 1
                    }
               }
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
     <div class=" overflow-x-auto mb-5 style_scroll">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
               <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
               <tr>
                    <th scope="col" class="w-5/12 py-3 px-2 telefono:p-4">Nombre</th>
                    <th scope="col" class="w-1/12 py-3 telefono:p-4">Edad</th>
                    <th scope="col" class="w-2/12 py-3 telefono:p-4">Sexo</th>
                    <th scope="col" class="w-2/12 py-3 telefono:p-4">Teléfono</th>
                    <th scope="col" class="w-1/12 py-3 px-2 telefono:p-4">Fisioterapeuta</th>
                    <th scope="col" class="w-1/12 py-3 telefono:p-4"></th>
               </tr>
               </thead>
               <tbody>
               <tr v-if="pacientes.length === 0" class="h-[532px]">
                    No hay pacientes
               </tr>
               <tr class="hover:bg-gray-50 hover:text-blue-500 border-b" v-for="paciente in pacientes"
                   :key="paciente.id">
                   <td class="py-3 telefono:p-4" :class="{'animate-pulse': paciente.modificando}">
                       <div class="flex items-center gap-3">
                           <img :src="base64IMG + paciente.foto" alt="" class="w-7 h-7 rounded-full object-cover hover:shadow-lg hover:shadow-blue-200 cursor-pointer"
                                @click="mostrarFoto(paciente.foto)">
                           {{ paciente.nombre }}
                           <div  v-if="paciente.estatus === false" title="Archivado">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="size-4 stroke-yellow-500">
                                   <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                               </svg>
                           </div>
                       </div>
                   </td>
                    <td class="py-3 telefono:p-4">{{ paciente.edad }}</td>
                    <td class="py-3 telefono:p-4">{{ paciente.sexo }}</td>
                    <td class="py-3 telefono:p-4">{{ paciente.telefono }}</td>
                    <td class="py-3 telefono:p-4 truncate px-2">
                        <p class="w-full truncate text-blue-600 rounded font-semibold bg-blue-100 p-2">
                            {{ paciente.fisioterapeuta }}
                        </p>
                    </td>
                    <td class="py-3 telefono:p-4 flex gap-2">
                         <div title="Nueva cita" v-if="paciente.verificado === true"
                              @click="notifiacionApi.agendarCita(paciente.nombre, paciente.pacienteId)">
                              <svg class="hover:stroke-green-500 cursor-pointer" width="28px" stroke="#758CA3"
                                   viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                                   <path d="M11.5 20H28.5M20 11.5V28.5" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" />
                              </svg>
                         </div>
                         <div v-else @click="citas(paciente.pacienteId)" title="Nueva cita">
                              <svg width="28px" stroke="#758CA3"
                                   class="hover:stroke-yellow-500 cursor-pointer"
                                   viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                                   <path d="M11.5 20H28.5M20 11.5V28.5" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" />
                              </svg>
                         </div>
                         <div @click="irEditarPaciente(paciente.pacienteId)" title="Editar datos del paciente">
                              <svg
                                   class="hover:stroke-blue-500 cursor-pointer"
                                   stroke="#758CA3" width="28px"
                                   viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                                   <path
                                        d="M25.5 18.5L28.5 15.5L24.5 11.5L21.5 14.5M25.5 18.5L15.5 28.5H11.5V24.5L21.5 14.5M25.5 18.5L21.5 14.5"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                         </div>
                         <div v-if="paciente.verificado === false" @click="citas(paciente.pacienteId)"
                              title="Expediente">
                              <svg
                                   class="hover:stroke-yellow-500 cursor-pointer"
                                   stroke="#758CA3" width="28px"
                                   viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                                   <path fill-rule="evenodd" clip-rule="evenodd"
                                         d="M20 20C18.116 20 16.5838 18.4751 16.5838 16.6C16.5838 14.7249 18.116 13.2 20 13.2C21.884 13.2 23.4162 14.7249 23.4162 16.6C23.4162 18.4751 21.884 20 20 20ZM23.2095 20.572C24.5649 19.4866 25.3549 17.7313 25.0645 15.8094C24.7272 13.5799 22.8636 11.7958 20.6141 11.5357C17.5096 11.1761 14.8757 13.5816 14.8757 16.6C14.8757 18.2065 15.6239 19.6379 16.7905 20.572C13.9243 21.6439 11.8319 24.1607 11.5039 27.5573C11.4561 28.0597 11.8498 28.5 12.3571 28.5C12.7918 28.5 13.1625 28.1736 13.2009 27.7426C13.5434 23.9491 16.4617 21.7 20 21.7C23.5383 21.7 26.4566 23.9491 26.7991 27.7426C26.8375 28.1736 27.2082 28.5 27.6429 28.5C28.1502 28.5 28.5439 28.0597 28.4961 27.5573C28.1681 24.1607 26.0757 21.6439 23.2095 20.572Z"
                                         fill="#758CA3" />
                              </svg>
                         </div>
                         <div v-else @click="irExpediente(paciente.pacienteId)" title="Expediente">
                              <svg
                                   class="hover:stroke-blue-500 cursor-pointer"
                                   stroke="#758CA3" width="28px"
                                   viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <rect x="1" y="1" width="38" height="38" rx="19" stroke-width="2" />
                                   <path fill-rule="evenodd" clip-rule="evenodd"
                                         d="M20 20C18.116 20 16.5838 18.4751 16.5838 16.6C16.5838 14.7249 18.116 13.2 20 13.2C21.884 13.2 23.4162 14.7249 23.4162 16.6C23.4162 18.4751 21.884 20 20 20ZM23.2095 20.572C24.5649 19.4866 25.3549 17.7313 25.0645 15.8094C24.7272 13.5799 22.8636 11.7958 20.6141 11.5357C17.5096 11.1761 14.8757 13.5816 14.8757 16.6C14.8757 18.2065 15.6239 19.6379 16.7905 20.572C13.9243 21.6439 11.8319 24.1607 11.5039 27.5573C11.4561 28.0597 11.8498 28.5 12.3571 28.5C12.7918 28.5 13.1625 28.1736 13.2009 27.7426C13.5434 23.9491 16.4617 21.7 20 21.7C23.5383 21.7 26.4566 23.9491 26.7991 27.7426C26.8375 28.1736 27.2082 28.5 27.6429 28.5C28.1502 28.5 28.5439 28.0597 28.4961 27.5573C28.1681 24.1607 26.0757 21.6439 23.2095 20.572Z"
                                         fill="#758CA3" />
                              </svg>
                         </div>
                         <div @click="archivar(paciente.pacienteId,paciente.nombre,paciente.estatus, paciente)">
                              <div class="grid-center" title="Archivar paciente" v-if="paciente.estatus === true">
                                  <div class="w-[16px] h-[18px]">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 38 38" stroke-width="2" stroke="#758CA3" class="size-7 hover:stroke-yellow-500 cursor-pointer">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                      </svg>
                                  </div>
                              </div>
                             <div class="grid-center2" v-else title="Quitar de archivados">
                                 <div class="w-[16px] h-[18px]">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 38 38" stroke-width="2" stroke="#758CA3" class="size-7 hover:stroke-blue-500 cursor-pointer">
                                         <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                     </svg>
                                 </div>
                             </div>
                         </div>
                    </td>
               </tr>
               </tbody>
          </table>
         <TransitionRec class="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40" @click.self="showFoto = false">
             <VerFoto :imagen="base64IMG + fotoMostrar" v-if="showFoto"/>
         </TransitionRec>
     </div>
     <div class="flex justify-between relative">
          <!-- --------------------------------------------- Area Botones --------------------------------------------- -->
          <div class="relative flex items-center text-gray-600 button-with-hover group">
               <button class="group-hover:text-blue-600 flex gap-2 items-center" :disabled="paginaActual === 1"
                       @click="obtenerTablaPacientes(1, props.estado)">
                    <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="M5 1 1 5l4 4" />
                    </svg>
                    <svg class="w-3 h-3 rtl:rotate-180 desktop:hidden laptop:hidden tablet:hidden" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="M5 1 1 5l4 4" />
                    </svg>
                    <p class="telefono:hidden">Inicio</p>
               </button>
          </div>
          <div class="flex items-center h-[20px] text-gray-600 gap-3">
               <button @click="obtenerTablaPacientes(paginaActual - 1, props.estado)" :disabled="paginaActual === 1"
                       class="hover:text-blue-600">
                    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="M5 1 1 5l4 4" />
                    </svg>
               </button>
               <button class="relative pr-2 pl-2" v-for="pagina in paginas" :key="pagina.pacienteId"
                       :class="{'hover:text-blue-600': pagina !== paginaActual, 'border-blue-600 border-b text-blue-600': pagina === paginaActual}"
                       @click="obtenerTablaPacientes(pagina, props.estado)">{{ pagina }}
               </button>
               <button @click="obtenerTablaPacientes(paginaActual + 1, props.estado);" :disabled="paginaActual === ultimaPagina"
                       class="hover:text-blue-600">
                    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="m1 9 4-4-4-4" />
                    </svg>
               </button>
          </div>
          <div class="relative flex items-center text-gray-600 button-with-hover group">
               <button class="group-hover:text-blue-600 flex gap-2 items-center"
                       :disabled="paginaActual === ultimaPagina"
                       @click="obtenerTablaPacientes(ultimaPagina, props.estado)">
                    <p class="telefono:hidden">Ultimo</p>
                    <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="#FFFFFF"
                         viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="m1 9 4-4-4-4" />
                    </svg>
                    <svg class="w-2.5 h-2.5 rtl:rotate-180 desktop:hidden laptop:hidden tablet:hidden"
                         aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 6 10">
                         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                               d="m1 9 4-4-4-4" />
                    </svg>
               </button>
          </div>
     </div>
     <div class="w-full mt-4 flex items-center gap-4 telefono:justify-center">
        <span class="text-sm text-blue-800">Mostrando {{ inicioPaciente }} - {{ finalPaciente
             }} pacientes de {{ totalPacientes }}</span>
          <svg v-if="loader" aria-hidden="true"
               class="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
               viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor" />
               <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill" />
          </svg>
     </div>
</template>

<style scoped>
</style>