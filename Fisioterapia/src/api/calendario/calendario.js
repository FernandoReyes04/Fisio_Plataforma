import { apiUrl, autorization, autorizationJSON, sinAutorizationJSON } from '@/api/headers.js'
import axios from 'axios'

export const calendarioCommand = {

   getDataFecha: async (date) => {
      try {
         const response = await axios.get(apiUrl + '/Calendario?fecha=' + date, autorization())
         return response.data
      } catch (error) {
         console.log(error)
      }
   }

}