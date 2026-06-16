import { apiUrl, autorization, autorizationJSON } from '@/api/headers.js'
import { NotificacionesModal } from '@/helpers/notifications/NotificacionGeneral.js'
import axios from 'axios'

export const calendarioCommand = {

   getDataFecha: async (date) => {
      try {
         const response = await axios.get(apiUrl + '/Calendario?fecha=' + date, autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   },

   // Cambia el estado de una cita.
   // estado: 2 = Inasistencia, 3 = Cancelada, 4 = Concluida
   cambiarEstadoCita: async (citaId, estado) => {
      try {
         const payload = {
            citaId,
            inasistencia: estado === 2,
            cancelar:     estado === 3,
            concluida:    estado === 4,
         }
         const [data, config] = autorizationJSON(payload)
         const response = await axios.patch(apiUrl + '/Cita', data, config)
         await NotificacionesModal.ExitosoSimple(response.data)
         return true
      } catch (error) {
         await NotificacionesModal.PantallaError(error.response?.data?.detail ?? 'Error al cambiar estado')
         return false
      }
   }

}