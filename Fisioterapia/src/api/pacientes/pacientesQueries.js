import axios from 'axios'
import { apiUrl, autorization } from '@/api/headers.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'

export const pacientesQueries = {

   //Devuelve una lista de pacientes
   getPacientes: async (pagina, estado) => {
      try {
         const response = await axios.get(apiUrl + '/Pacientes?pagina=' + pagina + '&onlyActive=' + estado, autorization())

         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   //Buscador de pacientes
   getBuscador: async (pagina, nombre, estado) => {
      try {
         const response = await axios.get(apiUrl + '/Pacientes/Buscador?pagina=' + pagina + '&nombre=' + nombre + '&onlyActive=' + estado, autorization())

         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   getDatosPaciente: async (id) => {
      try {
         const response = await axios.get(apiUrl + '/Pacientes/Data?pacienteId=' + id, autorization())

         return response.data
      } catch (error) {
         console.log(error.response.data.detail)
      }
   },

   getUltimosPacientes: async () => {
      try {
         const response = await axios.get(apiUrl + '/Pacientes/Ultimos', autorization())

         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   getExpediente: async (id) => {
      try {
         const response = await axios.get(apiUrl + '/Expediente?paciente=' + id, autorization())
         return response.data
      } catch (error) {
         console.log(error?.response?.data?.detail || error)
         return null
      }
   },

   getCitasDia: async () => {
      try {
         const response = await axios.get(apiUrl + '/Cita', autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   getCitasPaciente: async (id) =>{
      try {
         const response = await axios.get(apiUrl + '/Cita/Paciente?pancienteId=' + id, autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   //Diagnostico
   diagnosticoActivo: async (id) =>{
      try {
         const response = await axios.get(apiUrl + '/Diagnostico/Status?expediente=' + id, autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   getDiagnosticoData: async (id) =>{
      try {
         const response = await axios.get(apiUrl + '/Diagnostico?diagnostico=' + id, autorization())
         return response.data
      } catch (error) {
         console.log(error)
         return null
      }
   },

   getDiagnosticoFormSections: async () => {
      try {
         const response = await axios.get(apiUrl + '/Diagnostico/FormSections', autorization())
         return response.data
      } catch (error) {
         console.log(error)
         return []
      }
   },

   getUltimaExploracion: async (id) => {
      try {
         const response = await axios.get(apiUrl + '/Diagnostico/UltimaExploracion?paciente=' + id, autorization());
         // Retorna un objeto con los datos y el booleano indicando éxito
         return {
            success: true,
            data: response.data
         };
      } catch (error) {
         // Retorna un objeto con el booleano indicando fallo
         return {
            success: false,
            data: null
         };
      }
   },

   getRevisiones: async (id) =>{
      try {
         if (!id) {
            return []
         }
         const response = await axios.get(apiUrl + '/Diagnostico/Revision?diagnostico=' + id, autorization())
         return response.data
      } catch (error) {
         console.log(error)
         return []
      }
   },

   getReportes: async (id) =>{
      try {
         const response = await axios.get(apiUrl + '/Reporte?diagnosticoId=' + id, autorization())
         return response.data
      } catch (error) {
         return false
      }
   },

   diagnosticoActivoCita: async (id,citaId) =>{
      try {
         const response = await axios.get(apiUrl + '/Cita/Diagnostico/' + id + '/' + citaId, autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   },
}